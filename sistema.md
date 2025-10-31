Sistema de Gestão de Irregularidades

Visão Geral do Projeto



Aplicação web full-stack para gerenciamento de irregularidades em postes de telecomunicação.

O sistema permite que os usuários façam upload de arquivos Excel, acompanhem irregularidades, gerenciem processos de verificação e gerem relatórios detalhados.



Estrutura do Projeto

├── client/              # Aplicação frontend em React

│   ├── src/

│   │   ├── components/  # Componentes de interface (UI)

│   │   ├── pages/       # Páginas principais

│   │   ├── hooks/       # Hooks personalizados do React

│   │   └── lib/         # Funções utilitárias

│   └── index.html

├── server/              # Aplicação backend em Express

│   ├── index.ts         # Ponto de entrada do servidor

│   ├── routes.ts        # Rotas da API

│   ├── storage.ts       # Interface de armazenamento (em memória)

│   └── vite.ts          # Configuração do middleware Vite

├── shared/              # Tipos compartilhados entre cliente e servidor

│   └── schema.ts        # Esquemas e tipos de dados

└── attached\_assets/     # Imagens enviadas pelos usuários



Stack Tecnológica



Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui



Backend: Express.js, TypeScript, tsx



Gerenciamento de Dados: Armazenamento em memória (pode ser atualizado para banco de dados)



Gráficos: Recharts



Formulários: React Hook Form com validação via Zod



Processamento de Excel: Biblioteca xlsx



Funcionalidades Principais



Upload de Arquivos: Importação e processamento de planilhas Excel com dados de irregularidades



Painel de Controle: Exibição de estatísticas e métricas das irregularidades



Filtros Avançados: Filtragem por município, status, localização e tipo de irregularidade



Verificação: Fluxo de verificação JVM para irregularidades recorrentes



Rastreamento em Campo: Marcação de irregularidades para verificação presencial



Exportação: Exportação de dados em formato Excel e JSON



Gráficos: Análise visual do fluxo de irregularidades ao longo do tempo



Análises Detalhadas: Painel analítico completo com métricas de desempenho



Desenvolvimento



Execute npm run dev para iniciar o servidor de desenvolvimento



A aplicação roda na porta 5000



O frontend utiliza Vite para recarregamento automático (HMR)



O backend usa tsx para execução de TypeScript com auto-reload



O workflow “Start application” já está configurado e em execução



Armazenamento



Atualmente o sistema utiliza armazenamento em memória.

Os dados são mantidos em:



Array de irregularidades



Array de dados para gráficos



Para persistir os dados, recomenda-se atualizar para PostgreSQL ou outro banco de dados relacional.



Próximos Passos



A aplicação está pronta para desenvolvimento!

Você pode:



Fazer upload de arquivos Excel para testar o sistema de irregularidades



Adicionar persistência de dados com PostgreSQL



Implantar a aplicação em ambiente de produção



Personalizar as funcionalidades conforme necessário

