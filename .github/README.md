# Kanban Sync com GitHub Projects

Este diretório contém a automação para sincronizar o arquivo `kanban.yml` com o quadro GitHub Projects.

## 📋 Estrutura

- `sync-kanban.yml` - Workflow do GitHub Actions
- `scripts/sync_kanban.py` - Script Python para sincronização via API GraphQL

## ⚙️ Configuração

### 1. Encontrar o Número do Projeto

1. Acesse seu projeto no GitHub: `https://github.com/users/Alejjandromart/projects/X`
2. O número `X` na URL é o `PROJECT_NUMBER`

### 2. Configurar Variável no Repositório

1. Vá em: **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Clique em **New repository variable**
3. Nome: `PROJECT_NUMBER`
4. Valor: O número do seu projeto (ex: `1`, `2`, etc.)
5. Clique em **Add variable**

### 3. Permissões do GitHub Actions

Certifique-se de que o GitHub Actions tem permissão para acessar projetos:

1. Vá em: **Settings** → **Actions** → **General**
2. Role até **Workflow permissions**
3. Selecione: **Read and write permissions**
4. Marque: **Allow GitHub Actions to create and approve pull requests**
5. Clique em **Save**

## 🚀 Como Usar

### Sincronização Automática

O workflow é executado automaticamente quando:
- Você faz push de alterações no arquivo `kanban.yml` na branch `main`

### Sincronização Manual

1. Vá em: **Actions** → **Sync Kanban to GitHub Projects**
2. Clique em **Run workflow**
3. Selecione a branch (normalmente `main`)
4. Clique em **Run workflow**

## 📝 O que o Script Faz

1. Lê o arquivo `kanban.yml`
2. Conecta ao projeto do GitHub via API GraphQL
3. Verifica quais tarefas já existem no projeto
4. Cria draft issues para tarefas que ainda não existem
5. Mantém tarefas existentes intactas (não duplica)

## 🔍 Estrutura de Cada Tarefa

Cada tarefa do `kanban.yml` é convertida em um draft issue com:

- **Título**: Emoji + nome da tarefa
- **Corpo**: Informações formatadas incluindo:
  - Área (Mobile, Backend, IA, Banco de Dados)
  - Responsável
  - Prioridade
  - Tempo estimado
  - Descrição detalhada
  - Requisitos
  - Dependências
  - Status atual

## 🛠️ Executar Localmente

Para testar o script localmente:

```bash
# Instalar dependências
pip install pyyaml requests

# Configurar variáveis de ambiente
export GITHUB_TOKEN="seu_token_aqui"
export PROJECT_NUMBER="numero_do_projeto"
export GITHUB_REPOSITORY_OWNER="Alejjandromart"

# Executar o script
python .github/scripts/sync_kanban.py
```

## ⚠️ Notas Importantes

- O script **não deleta** tarefas existentes no projeto
- O script **não atualiza** tarefas que já existem (apenas cria novas)
- Tarefas são identificadas pelo título (emoji incluído)
- O `GITHUB_TOKEN` é fornecido automaticamente pelo GitHub Actions

## 🐛 Troubleshooting

### Erro: "PROJECT_NUMBER variable not set"
**Solução**: Configure a variável `PROJECT_NUMBER` nas configurações do repositório

### Erro: "Project X not found"
**Solução**: Verifique se o número do projeto está correto e se você tem permissão de acesso

### Erro: "GraphQL query failed"
**Solução**: Verifique as permissões do GitHub Actions nas configurações do repositório

## 📚 Referências

- [GitHub Projects API](https://docs.github.com/en/graphql/reference/objects#projectv2)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GraphQL API](https://docs.github.com/en/graphql)
