# ✈️ Aerocode — Sistema de Gestão da Produção de Aeronaves

Bem-vindo ao repositório da Aerocode — um sistema CLI em **TypeScript / Node.js** desenvolvido como MVP para gerir o ciclo de produção de aeronaves.

---

## 🔍 Visão Geral

O objetivo do projeto é refletir um sistema de gestão que abrange desde o registro da aeronave até etapas de testes e entrega, com persistência em arquivos de texto.

---

## 🧩 Funcionalidades

- **Gestão de Aeronaves**  
  Cadastro com código único, modelo, tipo (Comercial ou Militar), capacidade e alcance.  
  Consulta detalhada das aeronaves registradas.

- **Controle de Etapas de Produção**  
  Criação e ordenação lógica de etapas, com status (Pendente, Em Andamento, Concluída).  
  Associação das etapas a aeronaves específicas.

- **Gerenciamento de Peças**  
  Registro de peças (nome, tipo — nacional/importada, fornecedor, status).  
  Monitoramento do status e atualização conforme avanço.

- **Gestão de Funcionários e Acessos**  
  Cadastro de funcionários (ID, nome, telefone, endereço).  
  Autenticação (usuário/senha).  
  Perfis de acesso: Administrador, Engenheiro, Operador.  
  Associação de funcionários às etapas.

- **Registro de Testes**  
  Tipos de testes: Elétrico, Hidráulico, Aerodinâmico.  
  Resultados possíveis: Aprovado ou Reprovado.

- **Relatórios e Persistência de Dados**  
  Geração de relatório final com detalhes da aeronave, peças, etapas, testes, cliente e data de entrega.  
  Dados salvos em arquivos de texto para garantir persistência entre sessões.

---

## 🛠️ Tecnologias

- **TypeScript** — tipagem estática e maior robustez no código  
- **Node.js** — execução da aplicação CLI e manipulação de arquivos

---

## ✅ Pré-requisitos

- Node.js (versão 18.x ou superior)  
- NPM ou Yarn
  
## Guia de inicialização:
```##bash
# Clone o repositório
git clone https://github.com/kaiquehsp/AV1.git

# Entre no diretório do projeto
cd AV1

# Instale as dependências
npm install

# Inicie a aplicação
npm start

