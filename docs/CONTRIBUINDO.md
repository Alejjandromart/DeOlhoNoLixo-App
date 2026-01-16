# 🤝 Guia de Contribuição - DeOlho NoLixo

Obrigado por considerar contribuir com o DeOlho NoLixo! Este guia te ajudará a começar.

---

## 📋 Índice

1. [Como Contribuir](#-como-contribuir)
2. [Fluxo de Trabalho com Git](#-fluxo-de-trabalho-com-git)
3. [Padrões de Código](#-padrões-de-código)
4. [Commits Semânticos](#-commits-semânticos)
5. [Pull Requests](#-pull-requests)
6. [Áreas de Contribuição](#-áreas-de-contribuição)
7. [Code Review](#-code-review)

---

## 🚀 Como Contribuir

### Para Novos Contribuidores

1. **Fork o repositório** no GitHub
2. **Clone seu fork**:
   ```bash
   git clone https://github.com/seu-usuario/DeOlhoNoLixo-App.git
   cd DeOlhoNoLixo-App
   ```

3. **Adicione o remote upstream**:
   ```bash
   git remote add upstream https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
   ```

4. **Configure o ambiente** seguindo o [guia de instalação](INSTALACAO.md)

5. **Crie uma branch para sua contribuição**

6. **Faça suas alterações**

7. **Teste suas alterações**

8. **Abra um Pull Request**

---

## 🔄 Fluxo de Trabalho com Git

### Estrutura de Branches

```
main (produção)
  └── develop (desenvolvimento)
       ├── feature/nome-da-feature
       ├── fix/nome-do-bug
       └── refactor/nome-da-refatoracao
```

#### Branches Principais

- **`main`**: Código em produção (protegida)
- **`develop`**: Branch de integração (base para features)

#### Branches de Trabalho

- **`feature/`**: Novas funcionalidades
- **`fix/`**: Correções de bugs
- **`refactor/`**: Refatoração de código
- **`docs/`**: Documentação
- **`test/`**: Testes
- **`chore/`**: Tarefas de manutenção

### Workflow Padrão

#### 1. Sincronizar com upstream

```bash
git checkout develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

#### 2. Criar nova branch

```bash
# Para feature
git checkout -b feature/minha-funcionalidade

# Para fix
git checkout -b fix/correcao-bug

# Para refactor
git checkout -b refactor/otimizacao-componente
```

**Nomenclatura de branches**:
- Use kebab-case (palavras separadas por hífen)
- Seja descritivo mas conciso
- Prefixe com o tipo (feature/, fix/, etc)

**Exemplos**:
```bash
feature/autenticacao-biometrica
fix/crash-camera-permission
refactor/feed-performance
docs/update-readme
```

#### 3. Fazer alterações

```bash
# Editar arquivos...

# Adicionar alterações
git add .

# Commit seguindo Conventional Commits
git commit -m "feat: adiciona autenticação biométrica"
```

#### 4. Manter branch atualizada

```bash
# Atualizar develop
git checkout develop
git pull upstream develop

# Voltar para sua branch
git checkout feature/minha-funcionalidade

# Fazer rebase (recomendado) ou merge
git rebase develop
# ou
git merge develop
```

#### 5. Enviar para seu fork

```bash
git push origin feature/minha-funcionalidade
```

#### 6. Abrir Pull Request

- Acesse seu fork no GitHub
- Clique em "Compare & pull request"
- Base: `Alejjandromart/DeOlhoNoLixo-App` → `develop`
- Compare: `seu-usuario/DeOlhoNoLixo-App` → `feature/minha-funcionalidade`
- Preencha o template de PR
- Marque reviewers

---

## ✅ Padrões de Código

### TypeScript/React Native

#### Componentes Funcionais

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Interface para props
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Componente com FC (Functional Component)
export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

// Styles no final
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

#### Hooks Customizados

```typescript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // lógica
  }, []);

  return { user, loading };
};
```

#### Organização de Imports

```typescript
// 1. React e React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Bibliotecas externas
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// 3. Componentes locais
import { CustomButton } from '../components/CustomButton';
import { Header } from '../components/Header';

// 4. Contexts e Hooks
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';

// 5. Utilitários e constantes
import { Colors } from '../constants/Colors';
import { formatDate } from '../utils/formatters';

// 6. Tipos
import type { User } from '../_types/type';
```

### Python/FastAPI

#### Estrutura de Arquivo

```python
"""
Módulo de autenticação.
Contém endpoints relacionados à autenticação de usuários.
"""

# Imports padrão
import os
from typing import Optional

# Imports de terceiros
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

# Imports locais
from app.services import auth_service
from app.models import User
from app.utils import validators

# Router
router = APIRouter(prefix="/auth", tags=["Authentication"])


# Modelos
class LoginRequest(BaseModel):
    """Modelo de requisição de login."""
    email: str
    password: str


# Endpoints
@router.post("/login")
async def login(credentials: LoginRequest):
    """
    Realiza login do usuário.
    
    Args:
        credentials: Email e senha do usuário
        
    Returns:
        Token de autenticação
        
    Raises:
        HTTPException: Se credenciais inválidas
    """
    # implementação
    pass
```

#### Nomenclatura Python

```python
# Variáveis e funções: snake_case
user_name = "João"
def get_user_by_id(user_id: int):
    pass

# Classes: PascalCase
class UserService:
    pass

# Constantes: UPPER_SNAKE_CASE
MAX_LOGIN_ATTEMPTS = 5
API_BASE_URL = "http://api.example.com"

# Variáveis privadas: prefixo _
_internal_cache = {}

# Métodos privados: prefixo _
def _validate_password(password: str):
    pass
```

### Nomenclatura Geral

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente React | PascalCase | `CustomButton.tsx` |
| Função/Variável JS | camelCase | `handlePress` |
| Constante JS | UPPER_SNAKE_CASE | `API_URL` |
| Interface/Type | PascalCase (prefixo I) | `IUserProps` |
| Função Python | snake_case | `get_user_data` |
| Classe Python | PascalCase | `UserService` |
| Constante Python | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Arquivo TS | camelCase ou PascalCase | `userService.ts`, `CustomButton.tsx` |
| Arquivo Python | snake_case | `auth_service.py` |
| Pasta | camelCase ou PascalCase | `components`, `DenunciaIA` |

---

## 📝 Commits Semânticos

Seguimos a convenção [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona login com Google` |
| `fix` | Correção de bug | `fix: corrige crash ao tirar foto` |
| `docs` | Documentação | `docs: atualiza README` |
| `style` | Formatação (não afeta código) | `style: formata código com Prettier` |
| `refactor` | Refatoração | `refactor: otimiza renderização do feed` |
| `perf` | Melhoria de performance | `perf: adiciona cache de imagens` |
| `test` | Testes | `test: adiciona testes para AuthService` |
| `chore` | Tarefas de manutenção | `chore: atualiza dependências` |
| `build` | Sistema de build | `build: configura EAS build` |
| `ci` | Integração contínua | `ci: adiciona GitHub Actions` |
| `revert` | Reverter commit | `revert: reverte commit abc123` |

### Escopos Comuns

- `auth`: autenticação
- `feed`: feed de denúncias
- `denuncia`: criação/edição de denúncias
- `profile`: perfil do usuário
- `ia`: backend de IA
- `api`: backend principal
- `ui`: componentes UI
- `navigation`: navegação

### Exemplos de Commits Bons

```bash
feat(auth): implementa login com biometria
fix(camera): corrige permissão de câmera no Android
docs(readme): adiciona seção de troubleshooting
refactor(feed): otimiza renderização de lista com FlatList
perf(ia): adiciona cache de classificações
test(auth): adiciona testes unitários para AuthContext
chore(deps): atualiza React Native para 0.72
```

### Exemplos de Commits Ruins ❌

```bash
update                           # muito vago
fix bug                          # não descreve o que foi corrigido
added new feature                # não especifica a feature
WIP                              # não deve ser commitado
fix: correção                    # redundante e vago
```

### Breaking Changes

Para mudanças que quebram compatibilidade:

```bash
feat(api)!: muda estrutura de resposta da API

BREAKING CHANGE: o campo `user_id` foi renomeado para `userId`
```

---

## 🔍 Pull Requests

### Template de PR

Ao abrir um PR, preencha:

```markdown
## Descrição
Breve descrição do que foi implementado/corrigido.

## Tipo de Mudança
- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 📝 Documentação
- [ ] ♻️ Refatoração
- [ ] ⚡ Performance

## Como Testar
1. Passo a passo para testar a mudança
2. ...

## Screenshots (se aplicável)
Cole screenshots ou GIFs

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testado localmente (mobile + backend se necessário)
- [ ] Documentação atualizada
- [ ] Commits seguem Conventional Commits
- [ ] Sem conflitos com develop
```

### Boas Práticas de PR

✅ **FAÇA**:
- Mantenha PRs pequenos e focados (1 feature por PR)
- Adicione screenshots/GIFs para mudanças visuais
- Descreva claramente o que foi alterado
- Teste tudo antes de abrir o PR
- Responda comentários de revisão

❌ **NÃO FAÇA**:
- PRs gigantes com múltiplas features
- Commits com código comentado
- Misturar refatoração com nova feature
- Ignorar comentários de revisão
- Fazer force push após revisão

---

## 🎯 Áreas de Contribuição

### 🎨 Frontend Mobile

**Tecnologias**: React Native, TypeScript, Expo

**Tarefas**:
- Criar novos componentes UI
- Implementar telas
- Melhorar UX/UI
- Adicionar animações
- Otimizar performance

**Como começar**:
1. Escolha uma issue com label `frontend`
2. Familiarize-se com a estrutura em `app/`
3. Veja componentes existentes em `app/components/`

### 🔧 Backend API

**Tecnologias**: Python, FastAPI, Redis, Firebase

**Tarefas**:
- Criar novos endpoints
- Otimizar queries
- Implementar cache
- Melhorar segurança

**Como começar**:
1. Escolha uma issue com label `backend`
2. Estude a estrutura em `backend/BackendRedis/`
3. Consulte a documentação FastAPI

### 🤖 IA e Machine Learning

**Tecnologias**: YOLOv8, Google Gemini, Python

**Tarefas**:
- Melhorar modelo YOLOv8
- Otimizar prompts Gemini
- Adicionar novas classes de detecção
- Implementar novos algoritmos

**Como começar**:
1. Escolha uma issue com label `ia`
2. Estude `backendIA/` e `backend/trash.v1i.yolov8/`
3. Teste o modelo localmente

### 📝 Documentação

**Tecnologias**: Markdown

**Tarefas**:
- Melhorar README
- Criar tutoriais
- Traduzir documentação
- Adicionar exemplos de código

**Como começar**:
1. Escolha uma issue com label `documentation`
2. Edite arquivos `.md` em `docs/`

### 🧪 Testes

**Tecnologias**: Jest, React Native Testing Library, Pytest

**Tarefas**:
- Criar testes unitários
- Implementar testes de integração
- Aumentar cobertura de testes

**Como começar**:
1. Escolha uma issue com label `testing`
2. Crie testes em arquivos `.test.ts` ou `test_*.py`

---

## 👀 Code Review

### Checklist do Reviewer

Ao revisar um PR, verificar:

- [ ] **Funcionalidade**: código faz o que propõe?
- [ ] **Testes**: mudanças foram testadas?
- [ ] **Performance**: não introduz problemas de performance?
- [ ] **Segurança**: não expõe dados sensíveis?
- [ ] **Padrões**: segue convenções do projeto?
- [ ] **Documentação**: código está documentado?
- [ ] **Legibilidade**: código é fácil de entender?
- [ ] **Commits**: seguem Conventional Commits?

### Como Dar Feedback

✅ **Bom feedback**:
```
Ótimo trabalho! Algumas sugestões:

1. Em `UserService.ts:45`, considere usar `useMemo` para 
   otimizar a renderização.
   
2. Adicione tratamento de erro para caso a API falhe.

3. A lógica em `handlePress` poderia ser extraída para 
   um hook customizado para reutilização.
```

❌ **Feedback ruim**:
```
Não gostei.
Refaça tudo.
```

---

## 🏆 Reconhecimento de Contribuidores

Contribuidores são adicionados ao README principal na seção de agradecimentos!

---

## 📞 Dúvidas?

- Abra uma [Discussion](https://github.com/Alejjandromart/DeOlhoNoLixo-App/discussions)
- Entre em contato via Issues
- Consulte a documentação em `docs/`

---

**Obrigado por contribuir! Juntos por cidades mais limpas! 🌍♻️**

---

[← Voltar ao README](../README.md)
