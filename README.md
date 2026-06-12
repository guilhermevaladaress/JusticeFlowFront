# JusticeFlow Web

## Tecnologias

- **React 19** + **TypeScript**
- **Vite** — bundler e dev server

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- API do JusticeFlow

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd justiceflow-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a URL da API

Verifique o arquivo de configuração de ambiente (ex: `src/services/api.ts` ou `.env`) e confirme que a URL base aponta para a API local:

```
http://localhost:<porta-da-api>
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.
