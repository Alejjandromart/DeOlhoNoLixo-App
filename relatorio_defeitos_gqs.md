# Relatório de Defeitos e Soluções (Gestão de Qualidade de Software)

**Componente Curricular**: Gestão de Qualidade de Software (5º Período - UFAM)  
**Projeto**: Aplicativo Móvel "DeOlho" (DeOlhoNoLixo-App)  
**Objetivo**: Relatório técnico consolidando os defeitos identificados, suas causas raiz e as respectivas ações de garantia de qualidade (correções e refatorações) aplicadas ao longo das sessões de desenvolvimento e deploy dos últimos 3 dias.

---

## Tabela Resumida de Defeitos (13 Defeitos Encontrados)

| ID | Classificação do Defeito | Severidade | Impacto | Status |
|---|---|---|---|---|
| D01 | Conflito de Endpoints no Expo Router | Crítica | Impedia a inicialização e o bundling local/remoto | Resolvido |
| D02 | Dependência Quebrada de Recurso (Vídeo Inexistente) | Crítica | Quebra de Bundling do Metro (Falha na compilação) | Resolvido |
| D03 | Erro de Caminho Relativo (Import Quebrado) | Média | Falha no empacotamento do Metro local | Resolvido |
| D04 | Incompatibilidade Crítica Expo Router vs React Navigation | Crítica | Falha no processo `expo-doctor` na build remota EAS | Resolvido |
| D05 | Sobrecarga de Upload EAS (Datasets de IA no Repositório) | Alta | Lentidão extrema e erros de nome de arquivo longo no Windows | Resolvido |
| D06 | Perfil do Usuário Não-Funcional (Mockado) | Alta | Falha de persistência de dados de usabilidade do perfil | Resolvido |
| D07 | Tela de Sucesso Falsa na Denúncia IA (Mockada) | Alta | Denúncias realizadas via IA não eram gravadas no banco | Resolvido |
| D08 | Falha de Bloqueio por Filtros de Segurança do Gemini | Alta | Fotos de resíduos eram bloqueadas pela IA por falso positivo | Resolvido |
| D09 | Fragilidade no Parsing de Resposta JSON da IA (Gemini) | Alta | Crash do parser ao receber markdown ou array na resposta da IA | Resolvido |
| D10 | Duplicidade no Envio de Denúncias (Double Submit) | Média | Duplicação de registros se o usuário clicasse várias vezes no botão | Resolvido |
| D11 | Mismatch do Nome de Pacote Android (Firebase Crash) | Crítica | Falha de autenticação e crash no carregamento do Google Services | Resolvido |
| D12 | Resolução de Caminho Incorreta de Assets no app.config.js | Média | Erro do compilador EAS por caminhos não-prefixados com `./` | Resolvido |
| D13 | Falha de Dupla Inicialização do Firebase (Hot Reload) | Alta | Crash de desenvolvimento: "Firebase App named '[DEFAULT]' already exists" | Resolvido |

---

## Detalhamento dos Defeitos e Soluções

### D01: Conflito de Endpoints no Expo Router (BottomTabBar)
- **Sintoma**: Ao executar `npx expo export` ou iniciar a compilação, o Metro Bundler quebrava com o erro:
  `Found conflicting screens with the same pattern. The pattern 'components/BottomTabBar' resolves to both '__root > components/BottomTabBar/index' and '__root > components/BottomTabBar'`.
- **Causa Raiz**: O diretório `app/components/` estava posicionado dentro do escopo de descoberta automática de rotas do Expo Router. Havia simultaneamente uma pasta `app/components/BottomTabBar/` (contendo o código) e um arquivo re-exportador redundante `app/components/BottomTabBar.tsx` no mesmo nível.
- **Ação Corretiva**: Exclusão física do arquivo re-exportador redundante `BottomTabBar.tsx`. O Node.js automaticamente resolve importações direcionadas a pastas lendo o arquivo `index.tsx` de seu interior, removendo o conflito sem quebrar referências.

### D02: Dependência Quebrada de Recurso (Vídeo Inexistente)
- **Sintoma**: Falha no processo de exportação local:
  `Error: Unable to resolve module ../assets/videos/VideoTutorial.mp4 from .../VideoTutorial.tsx`.
- **Causa Raiz**: O componente `VideoTutorial.tsx` possuía uma chamada de importação/carregamento síncrono (`require`) para o arquivo `VideoTutorial.mp4`. O arquivo de vídeo havia sido removido anteriormente do Git por ser pesado, gerando uma referência nula no Metro Bundler (que inspeciona e valida estaticamente todos os requires, mesmo em código não utilizado).
- **Ação Corretiva**: Como a análise estática provou que o componente `VideoTutorial.tsx` era código morto (não possuía nenhuma importação ativa no app), o componente inteiro foi excluído de `app/components/` para sanar a quebra do compilador.

### D03: Erro de Caminho Relativo (Import Quebrado em LikeButtonExample)
- **Sintoma**: Falha de compilação apontada pelo Metro:
  `Error: Unable to resolve module ../components/LikeExplosion from app\screens\Examples\LikeButtonExample.tsx`.
- **Causa Raiz**: O arquivo de exemplo de animações estava localizado a três níveis de profundidade (`app/screens/Examples/LikeButtonExample.tsx`), mas tentava importar o componente de animação utilizando apenas um nível de retorno (`../components/LikeExplosion`), fazendo com que o Metro buscasse o arquivo no caminho de diretório inexistente `app/screens/components/LikeExplosion`.
- **Ação Corretiva**: Correção manual da árvore de importação no cabeçalho do arquivo `LikeButtonExample.tsx`, alterando o import para `../../components/LikeExplosion`.

### D04: Incompatibilidade Crítica Expo Router vs React Navigation (SDK 56)
- **Sintoma**: O processo de build remota no Expo EAS falhava sumariamente durante a verificação estática do `expo-doctor` retornando código de saída `1` e exibindo o erro:
  `As of SDK 56, expo-router is no longer compatible with react-navigation. The following @react-navigation packages are installed as direct dependencies and should be removed: ...`
- **Causa Raiz**: O aplicativo móvel foi construído inteiramente sobre a arquitetura tradicional do `@react-navigation` (usando `NavigationContainer` e `createStackNavigator` declarados em `App.tsx` e registrados via `index.js`). No entanto, a dependência `expo-router` estava instalada no `package.json` e listada como plugin ativo no `app.config.js`. A partir do Expo SDK 56, o utilitário `expo-doctor` bloqueia de forma fatal a presença simultânea de ambos para evitar conflitos de ciclo de vida de roteamento.
- **Ação Corretiva**:
  1. Desinstalação da dependência `expo-router` do `package.json`.
  2. Remoção do plugin `"expo-router"` de `app.config.js`.
  3. Exclusão de arquivos órfãos de rota (`app/index.tsx`).
  4. Instalação manual das dependências nativas de peer exigidas pelas demais APIs do Expo (`expo-asset` e `expo-linking`) com as versões recomendadas para o SDK 56.

### D05: Sobrecarga de Upload EAS (Datasets de IA no Repositório)
- **Sintoma**: Lentidão extrema no processo de empacotamento da build remota, acompanhado de avisos de `Filename too long` no Git do Windows devido a caminhos como `backend/trash.v1i.yolov8/train/images/...`.
- **Causa Raiz**: O repositório unificado (monorepo) guardava os arquivos do app móvel junto aos dados de IA do backend (incluindo centenas de imagens em alta definição e arquivos de anotação de coordenadas para treino da YOLOv8). Durante o comando `eas build`, a CLI do Expo por padrão ignorava o `.gitignore` para arquivos já rastreados no Git e tentava fazer o upload de mais de 500MB de assets de IA.
- **Ação Corretiva**: Criação do arquivo de configuração de escopo `.easignore` no diretório raiz do projeto. Foram adicionados os padrões de exclusão para `backend/`, `backendIA/`, `ai-deolho2/` e arquivos de debug do VS Code. Isso reduziu o tamanho de upload de build para apenas 122MB e eliminou os erros de caminho de arquivos no Windows.

### D06: Perfil do Usuário Não-Funcional (Mockado)
- **Sintoma**: A tela de perfil do usuário (`ProfileScreen.tsx`) exibia informações estáticas fictícias de e-mail/nome, e a funcionalidade de clicar no botão "Salvar" não alterava nenhum dado no banco de dados.
- **Causa Raiz**: A UI do perfil estava desacoplada das APIs de autenticação e banco de dados do Firebase Firestore.
- **Ação Corretiva**: Refatoração completa de `ProfileScreen.tsx`. Adicionamos um hook `useEffect` para carregar as informações em tempo real do documento `users/{uid}` no Firestore no momento da montagem e configuramos o salvamento persistente utilizando `updateProfile` da API de Autenticação do Firebase e `setDoc` (Firestore) ao clicar no botão.

### D07: Tela de Sucesso Falsa na Denúncia IA (Mockada)
- **Sintoma**: O assistente de envio de denúncia inteligente por inteligência artificial avançava até a tela de sucesso (`SuccessScreen`), porém nenhuma denúncia aparecia no Feed principal e nenhum dado de imagem era gravado.
- **Causa Raiz**: A função de submissão do formulário (`handleSubmit` em `DenunciaIA.tsx`) apenas imprimia os dados no console e pulava para a tela final de sucesso, sem fazer chamadas aos serviços de persistência.
- **Ação Corretiva**: Acoplamento do `adicionarDenuncia` (importado do `DenunciaContext`) ao método `handleSubmit` de `DenunciaIA.tsx`. O fluxo passou a converter a imagem local para Base64, fazer o upload seguro para o Cloudinary, gravar a URL final e dados geográficos no Firestore e disparar o webhook de e-mail ao backend de notificação.

### D08: Falha de Bloqueio por Filtros de Segurança do Gemini
- **Sintoma**: A API do Gemini falhava ao analisar fotos de lixo com erros genéricos ou retornando respostas vazias.
- **Causa Raiz**: As configurações padrão de segurança do Gemini bloqueavam imagens de resíduos contendo lixo orgânico em decomposição ou poluição visual severa, interpretando de forma errônea como "conteúdo perigoso" ou "assédio/conteúdo impróprio" (falsos positivos).
- **Ação Corretiva**: Configuração explícita do parâmetro `safety_settings` no arquivo de chamadas da IA (`gemini_client.py`), ajustando os limiares de segurança para as categorias críticas (`HATE_SPEECH`, `HARASSMENT`, `DANGEROUS_CONTENT`) para `HarmBlockThreshold.BLOCK_NONE`, garantindo que imagens ambientais nunca sejam censuradas.

### D09: Fragilidade no Parsing de Resposta JSON da IA (Gemini)
- **Sintoma**: Falha e crash do backend de IA na rota de análise ao ler respostas do Gemini.
- **Causa Raiz**: O modelo de linguagem ocasionalmente formatava a resposta JSON envelopando-a em blocos de código markdown (como \`\`\`json ... \`\`\`) ou encapsulando em uma estrutura de lista (`[...]` contendo um objeto) em vez de retornar puramente o objeto `{...}`, quebrando o método simplista `json.loads` anterior.
- **Ação Corretiva**: Substituição do parser síncrono simples por uma lógica robusta de identificação de chaves (`{}`) e colchetes (`[]`). Caso o Gemini retorne um array de objetos, o backend extrai dinamicamente o primeiro elemento antes de desserializar os campos do modelo de dados (`AnalysisResult`).

### D10: Duplicidade no Envio de Denúncias (Double Submit)
- **Sintoma**: Registros de denúncias idênticos inseridos de forma duplicada no Firestore por um único envio.
- **Causa Raiz**: Ausência de desabilitação e estado de bloqueio no botão de envio. Usuários com conexões lentas clicavam repetidas vezes no botão "Enviar" enquanto a imagem era carregada, ativando múltiplos processos de escrita.
- **Ação Corretiva**: Criação de uma referência mutável `submittingRef` utilizando o hook `useRef(false)` no componente `DenunciaIA.tsx`. O manipulador `handleSubmit` realiza um retorno imediato preventivo se a referência estiver ativa e a define como `true` no primeiro clique, impossibilitando envios paralelos.

### D11: Mismatch do Nome de Pacote Android (Firebase Crash)
- **Sintoma**: O app instalava no celular Android mas sofria crash instantâneo na inicialização, ou o Firebase Auth recusava logins retornando erro de identificador.
- **Causa Raiz**: Inconsistência de capitalização e nomenclatura do pacote Android no arquivo `app.config.js` (`DeOlho.NoLixo`) em relação ao configurado no painel do console do Firebase e no arquivo estático `google-services.json`. O Android exige estritamente nomes de pacotes em letras minúsculas.
- **Ação Corretiva**: Alteração do nome de pacote de forma padronizada em todos os arquivos (`app.config.js` e `google-services.json`) para a versão minúscula e sem caracteres especiais: `deolho.nolixo`.

### D12: Resolução de Caminho Incorreta de Assets no app.config.js
- **Sintoma**: O EAS Build falhava na fase de preparação com o erro "Asset file not found" ao tentar empacotador o ícone do app e a splash screen.
- **Causa Raiz**: O arquivo de configuração dinâmica `app.config.js` definia os caminhos das imagens (`icon`, `splash`, `favicon`) como caminhos relativos diretos (ex: `app/assets/images/splash.png`). A CLI do EAS exige o prefixo `./` para resolver os caminhos do diretório de compilação remota.
- **Ação Corretiva**: Substituição dos caminhos nos campos `icon`, `splash.image`, `adaptiveIcon.foregroundImage` e `web.favicon` para incluir o prefixo `./` (ex: `./app/assets/images/splash.png`).

### D13: Falha de Dupla Inicialização do Firebase (Hot Reload)
- **Sintoma**: Crash de desenvolvimento no Metro:
  `FirebaseError: Firebase App named '[DEFAULT]' already exists`.
- **Causa Raiz**: O arquivo `app/lib/firebase.ts` inicializava o aplicativo chamando `initializeApp(firebaseConfig)` diretamente. No recarregamento rápido do Metro (Hot Reload), o código JavaScript é re-executado, disparando o método repetidamente sobre um aplicativo já registrado.
- **Ação Corretiva**: Modificação do fluxo de inicialização no `firebase.ts` utilizando a condicional `getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]`, reutilizando a instância já estabelecida.

---

## Lições Aprendidas de Gestão de Qualidade de Software (GQS)

1. **Validação Estática Robusta (Quality Gates)**: O uso de verificadores estáticos integrados (como o `expo-doctor`) e testes de exportação locais (`npx expo export`) reduzem drasticamente as falhas de implantação tardias e economizam tempo de computação em servidores de build.
2. **Definição de Escopos de Compilação**: A manutenção de monorepos híbridos (front e back) sem o correto isolamento no empacotador de build (`.easignore`) compromete a velocidade de deploy e abre portas para falhas de estouro de caminho no sistema operacional de compilação.
3. **Gerenciamento Atômico de Estado (Anti-duplicação)**: Garantir a idempotência das transações no backend e introduzir barreiras de duplo clique (com `useRef`) em formulários que realizam upload de arquivos pesados são requisitos fundamentais de usabilidade e contenção de custos em infraestrutura de nuvem.
4. **Alinhamento Estrito de Configuração**: Pequenas discrepâncias de maiúsculas e minúsculas em nomes de pacotes de sistemas operacionais nativos (como o Android `package`) com arquivos de serviço de terceiros (`google-services.json`) representam defeitos de integração silenciosos que quebram o fluxo de build ou geram crashes intermitentes.
