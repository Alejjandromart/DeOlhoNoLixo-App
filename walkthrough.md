# Walkthrough: EAS Build e Correções do Sistema de Feed, Comentários e IA

## 🔧 Correções Recentes do Feed e Comentários

Implementamos soluções robustas para os problemas relatados no feed e sistema de comentários:

### 1. Resolução do Crash no Firestore ao Comentar
- **O Erro**: O Firebase rejeitava escritas que contivessem chaves com valor `undefined` (gerando o erro: `Unsupported field value: undefined (found in field usuario.avatar)`).
- **A Solução**: No arquivo [DenunciaContext.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/context/DenunciaContext.tsx) (funções `adicionarDenuncia` e `adicionarComentario`) e no [FeedScreen.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/Home/FeedScreen.tsx), sanitizamos o objeto `usuario` convertendo explicitamente o avatar para `null` caso ele seja `undefined`.

### 2. Correção de Fotos de Perfil não aparecendo
- **O Erro**: As telas [RealizarDenuncia.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/Denuncia/RealizarDenuncia.tsx), [DenunciaIA.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/DenunciaIA/DenunciaIA.tsx) e [FeedScreen.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/Home/FeedScreen.tsx) buscavam a propriedade `nome` no snapshot do Firestore. Mas o [ProfileScreen.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/Home/ProfileScreen.tsx) salva os dados como `displayName`. Devido a isso, a consulta retornava `undefined` e não carregava a imagem ou nome atualizados.
- **A Solução**: Atualizamos as buscas de dados para buscar preferencialmente `snap.data().displayName` e usar `snap.data().nome` apenas como fallback.

### 3. Exibição de Fotos nos Comentários
- **O Erro**: O modal de comentários (`CommentsModal.tsx`) estava com o ícone de avatar padrão do usuário travado de forma estática com um ícone genérico do Ionicons.
- **A Solução**: Atualizamos o [CommentsModal.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/components/Feed/CommentsModal.tsx) para renderizar a imagem real da foto em base64 se ela existir, ou um placeholder circular colorido com as iniciais do nome do autor do comentário se não houver foto (de acordo com as diretrizes visuais premium).

### 4. Sincronização em Tempo Real (Real-time Comments)
- Anteriormente, os comentários eram inicializados como um array vazio e nunca eram buscados do Firestore de fato.
- Adicionamos um listener sob demanda (`onSnapshot`) em [DenunciaCard.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/components/Feed/DenunciaCard.tsx) que escuta a subcoleção de comentários da denúncia correspondente apenas quando o card está expandido ou quando o modal de comentários está visível. Isso mantém a lista de comentários perfeitamente sincronizada em tempo real sem sobrecarregar as leituras do Firestore.
### 5. Bloqueio contra Duplo Envio (Double Submit Lock)
- **O problema**: Se o usuário clicasse no botão de enviar várias vezes seguidas rapidamente, o aplicativo enviava múltiplas requisições paralelas, gerando posts duplicados ou triplicados idênticos no Firestore.
- **A solução**: Implementamos um mecanismo de trava síncrona utilizando `useRef` (tanto em [RealizarDenuncia.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/Denuncia/RealizarDenuncia.tsx) quanto em [DenunciaIA.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/DenunciaIA/DenunciaIA.tsx)). Como referências em React são atualizadas de forma síncrona, a primeira pressão no botão bloqueia instantaneamente qualquer clique subsequente. Em adição, atualizamos o botão para desativar e mostrar um indicador de progresso (`ActivityIndicator`), fornecendo um feedback visual limpo.

---

## 🤖 Validação e Tratamento de Imagens Sem Lixo

Implementamos melhorias no backend local de inteligência artificial e no aplicativo mobile para tratar o caso de envio de imagens irrelevantes (que não contêm lixo, entulho ou focos de poluição):

### 1. Detecção do Gemini
- **O problema**: Se o usuário enviasse uma imagem que não continha lixo (como uma selfie, gato, teclado, etc.), a IA tentava se ajustar às regras de indignação cívica e acabava alucinando uma descrição falsa, ou então omitia campos obrigatórios no JSON de resposta, quebrando o parser no backend com erro `502 Bad Gateway` ou `500`.
- **A solução**: No arquivo [analyze.py](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/backendIA/app/routers/analyze.py), introduzimos um novo campo condicional no prompt do Gemini chamado `noTrashDetected` (true se a imagem claramente não contiver lixo, caso contrário false). 

### 2. Retorno HTTP 400 Amigável (Evitando 502 Bad Gateway)
- **O problema**: Quando o modelo Gemini detectava que não havia lixo, ele retornava `noTrashDetected: true` ou `objectsDetected: []`, mas às vezes omitia outros campos (como `severity` ou `suggestedDescription`). Como a validação dos campos obrigatórios era feita *antes* da checagem de lixo, o backend levantava um erro `502 Bad Gateway` em vez do esperado `400 Bad Request`.
- **A solução**: Corrigimos a ordem de validação no [analyze.py](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/backendIA/app/routers/analyze.py). Agora, as checagens de imagem limpa (`noTrashDetected` ou `objectsDetected` vazio) acontecem **antes** da checagem dos campos obrigatórios. Se a imagem não contiver lixo, o backend responderá com `HTTP 400 Bad Request` imediatamente com o detalhe: **"Esta imagem não parece conter focos de lixo ou poluição. Por favor, envie uma foto de um descarte de lixo real."**

### 3. Melhoria de UX: Alerta Nativo e Redirecionamento Automático
- **O problema**: Se a imagem fosse considerada inválida/sem lixo, o app mostrava o erro no cartão vermelho, mas permanecia na tela de descrição (Passo 2), o que tinha uma UX ruim (já que o usuário não poderia continuar com uma imagem inválida).
- **A solução**: Atualizamos o [Step2Description.tsx](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app/screens/DenunciaIA/components/Step2Description.tsx) para interceptar especificamente o erro de validação ("imagem não parece conter lixo"). Quando esse erro ocorre:
  - O app exibe um **alerta nativo do dispositivo** (`Alert.alert`) contendo o aviso enviado pelo backend.
  - Ao clicar no botão "Tirar outra foto" do alerta, o app redireciona o usuário **automaticamente de volta para o Passo 1** (tela de captura de foto e localização), para que ele possa escolher ou tirar uma foto adequada.
- Para outros tipos de erros (como servidor offline ou erros genéricos), o app continua permitindo que o usuário digite a descrição manualmente no Passo 2.

---

## 📲 Passo a Passo para Gerar e Distribuir o APK (EAS Build)

Corrigimos os impedimentos que estavam fazendo o build do APK falhar localmente no Windows:
1. **Nome do Pacote (Package Name)**: Mudamos o package name no [app.config.js](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app.config.js) de `DeOlho.NoLixo.app` (que continha letras maiúsculas inválidas para o padrão do Android) para `com.deolhonolixo.app` (totalmente minúsculo e válido).
2. **Propriedades Obsoletas**: Removemos `edgeToEdgeEnabled` e `predictiveBackGestureEnabled` do [app.config.js](file:///c:/Users/Alejj/Documents/UFAM/5º%20periodo/Qualidade%20de%20Software/App-%20DeOlho/DeOlhoNoLixo-App/app.config.js), pois foram descontinuadas ou alteradas no Android 16/SDK 56 e causavam falhas no prebuild.
3. **Resolução de Bug no Windows (Caminhos com caracteres especiais)**: O erro `AssertionError: Project file "MainApplication" does not exist` ocorria porque a pasta do projeto continha caracteres não-ASCII (`5º periodo`). A função nativa `fs.cpSync` do Node.js resolvia caminhos com encoding diferente, copiando os arquivos para uma pasta duplicada errada (`5Âº periodo `). Corrigimos isso criando um patch robusto em Javascript puro nas funções de cópia (`copySync`/`copyAsync`) em `node_modules/@expo/cli`, garantindo que o prebuild local funcione 100%.

Siga estes passos no seu terminal interativo para gerar o APK:

### Passo 1: Fazer Login no Expo/EAS
Abra o seu terminal no VS Code (ou prompt de comando) e certifique-se de que está logado na sua conta da Expo:
```bash
eas login
```

### Passo 2: Rodar o Build do APK (Modo Interativo)
Como mudamos o nome do pacote para o formato correto (`com.deolhonolixo.app`), a Expo precisa gerar uma nova chave de assinatura (Keystore) para o seu aplicativo. Para fazer isso, execute o comando abaixo **sem o `--non-interactive`** diretamente no seu terminal:
```bash
eas build --platform android --profile production
```
Quando o terminal perguntar:
> **`Generate a new Android Keystore?`**

Digite **`Y`** (ou selecione a opção de gerar nova keystore) e pressione **Enter**. 

*A Expo gerará a assinatura segura automaticamente, salvará nos servidores deles e iniciará o build do APK em seguida. Você poderá acompanhar o andamento pelo link gerado no terminal!*

---

## 📋 Cenários de Teste (Google Forms)
Recomendamos criar um formulário para os alunos avaliarem o app com os seguintes cenários:
1. **Cadastro e Login**: Criar uma nova conta e acessar.
2. **Visualizar e Interagir**: Explorar o feed, curtir e ver os comentários atualizados em tempo real.
3. **Denúncia Manual**: Registrar um caso manualmente (tirar foto, pegar endereço e descrever).
4. **Denúncia Automatizada com IA (Caminho Correto)**: Tirar foto de um lixo real e validar se a IA gera a descrição indignada em português formal (<500 chars) e categoriza corretamente.
5. **Denúncia Automatizada com IA (Caso de Erro)**: Tirar foto de algo limpo ou aleatório e validar que o app exibe uma mensagem amigável de que nenhum foco de lixo foi detectado.
6. **Ajuste de Perfil**: Mudar nome, cidade ou foto de perfil (e validar que a nova foto aparece nas publicações e comentários seguintes).
