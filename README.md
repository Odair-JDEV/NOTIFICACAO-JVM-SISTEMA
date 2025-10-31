# 🛰️ Sistema de Gestão de Irregularidades

![Status](https://img.shields.io/badge/status-em_desenvolvimento-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Vite%20%7C%20TypeScript-orange?style=flat-square)

---

## 📘 Visão Geral

O **Sistema de Gestão de Irregularidades** é uma aplicação web **full-stack** desenvolvida para o **gerenciamento de irregularidades em postes e redes de telecomunicação**.  
Permite importar planilhas Excel, visualizar estatísticas, acompanhar verificações em campo e gerar relatórios completos de forma prática e intuitiva.

---

## 🧱 Estrutura do Projeto
├── client/ # Frontend React (interface do usuário)
│ ├── src/
│ │ ├── components/ # Componentes de interface
│ │ ├── pages/ # Páginas principais
│ │ ├── hooks/ # Hooks personalizados
│ │ └── lib/ # Funções utilitárias
│ └── index.html
├── server/ # Backend Express
│ ├── index.ts # Ponto de entrada do servidor
│ ├── routes.ts # Rotas da API
│ ├── storage.ts # Armazenamento em memória
│ └── vite.ts # Integração com Vite
├── shared/ # Tipos compartilhados (cliente/servidor)
│ └── schema.ts
└── attached_assets/ # Imagens e arquivos enviados pelos usuários

yaml
Copiar código

---

## ⚙️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| **Frontend** | React • TypeScript • Vite • Tailwind CSS • shadcn/ui |
| **Backend** | Express.js (TypeScript) |
| **Formulários** | React Hook Form + Zod |
| **Gráficos** | Recharts |
| **Planilhas** | Biblioteca `xlsx` |
| **Banco de Dados (atual)** | Armazenamento em memória (pode ser substituído por PostgreSQL) |

---

## 🧑‍💻 Como Rodar o Projeto Localmente

### 🔹 Requisitos
- Node.js instalado ([instalar aqui](https://nodejs.org))
- Git instalado ([instalar aqui](https://git-scm.com))

### 🔹 Passos

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/Odair-JDEV/NOTIFICACAO-JVM-SISTEMA.git

# 2️⃣ Acesse o diretório do projeto
cd NOTIFICACAO-JVM-SISTEMA

# 3️⃣ Instale as dependências
npm install

# 4️⃣ Inicie o servidor de desenvolvimento
npm run dev
A aplicação será iniciada em:
👉 http://localhost:5000 (ou 5173, conforme configuração do Vite)

🧩 Outras Formas de Edição
✏️ Editar diretamente pelo GitHub
Acesse o arquivo desejado no repositório.

Clique no ícone “✏️ Edit”.

Faça as alterações e clique em Commit changes.

☁️ Usar GitHub Codespaces
Vá até o repositório.

Clique em Code → Codespaces → New Codespace.

O ambiente será criado automaticamente para edição online.

🚀 Implantação (Deploy)
🌐 Opção 1: Implantar na Vercel (Recomendada)
Acesse https://vercel.com

Crie uma conta gratuita e conecte o GitHub.

Clique em Add New → Project.

Escolha o repositório
➜ NOTIFICACAO-JVM-SISTEMA

A Vercel detectará automaticamente o Vite e configurará o deploy.

Clique em Deploy.

Após a publicação, o sistema ficará acessível em:

perl
Copiar código
https://nome-do-projeto.vercel.app
🔗 Conectar um Domínio Personalizado
Acesse o painel do projeto na Vercel.

Vá em Settings → Domains → Add Domain.

Informe seu domínio (ex: sistemairregularidades.com.br).

Siga as instruções de DNS fornecidas pela Vercel.

Após a propagação, o sistema estará disponível no seu domínio próprio.

🧩 Build e Preview Local
bash
Copiar código
# Gera o build otimizado
npm run build

# Visualiza o resultado antes do deploy
npm run preview
Os arquivos gerados ficam na pasta dist/, prontos para hospedagem.

🧭 Próximos Passos
✅ Implementar persistência com PostgreSQL

✅ Adicionar autenticação de usuários

✅ Criar histórico de verificações de campo

✅ Gerar relatórios automáticos (PDF/Excel)

✅ Adicionar painel administrativo com permissões

💡 Contribuições
Sinta-se à vontade para contribuir!
Basta fazer um fork do projeto, criar uma branch e abrir um pull request.

bash
Copiar código
git checkout -b feature/minha-nova-funcionalidade
git commit -m "Adiciona nova funcionalidade"
git push origin feature/minha-nova-funcionalidade
📄 Licença
Este projeto está licenciado sob a licença MIT.
Você pode utilizá-lo, modificar e distribuir livremente.

👨‍💻 Autor
Odair JDEV