# UniHelp 🎓 - Guia de Inicialização e Configuração

Este guia contém o passo a passo detalhado para configurar, inicializar e testar o **UniHelp** (um "StackOverflow" universitário) em uma nova máquina. O projeto é composto por uma API desenvolvida em Node.js (Express), banco de dados PostgreSQL e uma interface web (Frontend) nativa.

---

## 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
1. **Node.js** (versão 16 ou superior)
2. **npm** (gerenciador de pacotes do Node, instalado junto com o Node.js)
3. **PostgreSQL** (SGBD para gerenciamento do banco de dados)

---

## 🛠️ Passo 1: Instalação das Dependências

1. Abra o terminal na pasta raiz do projeto (onde está localizado o arquivo `package.json`).
2. Execute o comando abaixo para instalar todas as bibliotecas necessárias (incluindo Express, Driver do PostgreSQL, Bcrypt para criptografia, JWT para autenticação, CORS e as regras de segurança do Rate Limiting):

```bash
npm install
Nota: Se o pacote express-rate-limit não estiver listado no seu package.json, garanta sua instalação executando:

Bash
npm install express-rate-limit
🗄️ Passo 2: Configuração do Banco de Dados (PostgreSQL)
O UniHelp utiliza quatro tabelas principais interconectadas por chaves estrangeiras com exclusão em cascata (ON DELETE CASCADE).

Abra o utilitário de linha de comando do PostgreSQL (psql) ou utilize uma ferramenta gráfica como o pgAdmin.

No seu terminal do PostgreSQL, crie o banco de dados e conecte-se a ele:

SQL
CREATE DATABASE unihelp;
\c unihelp;
Copie, cole e execute o script DDL completo abaixo para estruturar o banco de dados com as novas funcionalidades de busca, categorias e sistema de votos:

SQL
-- 1. Tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- Ex: 'aluno', 'professor', 'admin'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Perguntas
CREATE TABLE perguntas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100) DEFAULT 'Geral', -- Sistema de categorias/tags
    usuario_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE
);

-- 3. Tabela de Respostas
CREATE TABLE respostas (
    id SERIAL PRIMARY KEY,
    conteudo TEXT NOT NULL,
    votos_uteis INT DEFAULT 0,     -- Contador de votos positivos
    votos_nao_uteis INT DEFAULT 0, -- Contador de votos negativos
    pergunta_id INT NOT NULL,
    usuario_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pergunta
        FOREIGN KEY (pergunta_id) 
        REFERENCES perguntas(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario_resposta
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE
);

-- 4. Tabela de Controle de Votos (Impede duplicidade e gerencia remoção/alteração)
CREATE TABLE votos_respostas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    resposta_id INT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('util', 'nao_util')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voto_usuario 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_voto_resposta 
        FOREIGN KEY (resposta_id) REFERENCES respostas(id) ON DELETE CASCADE,
    CONSTRAINT uk_usuario_resposta 
        UNIQUE (usuario_id, resposta_id)
);
🔑 Passo 3: Configuração das Variáveis de Ambiente (.env)
A aplicação busca as credenciais confidenciais a partir de um arquivo de ambiente localizado na raiz do projeto.

Na pasta raiz do projeto (mesmo nível das pastas src e frontend), crie um arquivo chamado exatamente .env.

Adicione o seguinte conteúdo ao arquivo, adaptando os valores conforme as configurações da sua máquina:

Snippet de código
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=unihelp
DB_PASSWORD=SUA_SENHA_DO_POSTGRES_AQUI
DB_PORT=5432

JWT_SECRET=UMA_CHAVE_SECRETA_E_SEGURA_PARA_O_JWT
⚠️ Atenção: Substitua SUA_SENHA_DO_POSTGRES_AQUI pela senha real definida na instalação do seu PostgreSQL.

🚀 Passo 4: Inicialização do Projeto
Com o banco configurado, dependências instaladas e o arquivo .env preenchido, você já pode colocar o servidor de pé.

No seu terminal, execute o comando de inicialização a partir do diretório raiz:

Bash
node src/server.js
Se tudo estiver correto, você verá no terminal a seguinte mensagem de sucesso:

Plaintext
Servidor rodando na porta 3000
🌐 Passo 5: Acessando a Aplicação
A API do backend foi desenhada para servir automaticamente a interface web estática.

Abra qualquer navegador web de sua preferência.

Acesse o endereço local do projeto:

Plaintext
http://localhost:3000
O sistema redirecionará você de forma automática para a tela do feed principal (/feed.html), onde você poderá se cadastrar, fazer login, realizar buscas por perguntas, filtrar por categorias e interagir votando em respostas úteis ou não úteis.

🔒 Segurança: Como testar a proteção de Rate Limiting
Para garantir que a proteção de força bruta e spam está operando nas rotas da API (/usuarios, /perguntas, /respostas), você pode simular múltiplos acessos rápidos.

Teste Rápido (Alterando o limite)
No arquivo src/server.js, altere temporariamente o parâmetro max: 100 para max: 3.

Reinicie o servidor (node src/server.js).

Atualize a página do navegador (F5) 4 vezes seguidas na rota http://localhost:3000/perguntas.

Na 4ª tentativa, você receberá um status de erro HTTP 429 (Too Many Requests) com a mensagem de bloqueio.

Lembre-se de retornar o valor original para max: 100 após o teste.