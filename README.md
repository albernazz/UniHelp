# UniHelp 🎓: Plataforma de Apoio Acadêmico

## Descrição do Projeto

O UniHelp é uma plataforma inovadora projetada para funcionar como um "StackOverflow" universitário, facilitando a troca de conhecimento e a colaboração entre estudantes. Ele oferece um ambiente onde os usuários podem fazer perguntas, fornecer respostas, votar em conteúdos úteis e categorizar discussões, promovendo uma comunidade acadêmica engajada e interativa.

## Funcionalidades Principais

- **Sistema de Perguntas e Respostas:** Os usuários podem postar dúvidas e receber soluções da comunidade.
- **Votação e Reputação:** Mecanismo de votos para classificar a utilidade das perguntas e respostas, construindo a reputação dos usuários.
- **Categorização de Conteúdo:** Organização de discussões por categorias para facilitar a busca e a navegação.
- **Busca Avançada:** Funcionalidade de busca para encontrar rapidamente informações relevantes.
- **Autenticação Segura:** Sistema de login e registro com autenticação baseada em JWT e criptografia de senhas (bcrypt).
- **Controle de Taxa (Rate Limiting):** Proteção contra abusos e garantia de estabilidade da plataforma.

## Tecnologias Utilizadas

### Backend (API)

O backend do UniHelp é construído com uma API robusta e escalável, utilizando as seguintes tecnologias:

- **Node.js:** Ambiente de execução JavaScript assíncrono e orientado a eventos.
- **Express.js:** Framework web para Node.js, utilizado para construir a API RESTful.
- **PostgreSQL:** Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) para persistência de dados.
- **Bcrypt:** Biblioteca para hash de senhas, garantindo a segurança das credenciais dos usuários.
- **JSON Web Tokens (JWT):** Padrão para criação de tokens de acesso seguros, utilizados na autenticação.
- **CORS:** Middleware para habilitar o Cross-Origin Resource Sharing, permitindo requisições de diferentes origens.
- **Express Rate Limit:** Middleware para limitar o número de requisições repetidas a endpoints públicos, prevenindo ataques de força bruta e DoS.
- **Dotenv:** Módulo para carregar variáveis de ambiente de um arquivo `.env`.
- **Nodemon:** Ferramenta que ajuda no desenvolvimento de aplicações baseadas em Node.js reiniciando automaticamente o servidor quando detecta alterações nos arquivos.

### Frontend (Interface Web)

A interface do usuário é uma aplicação web nativa, desenvolvida com:

- **HTML5:** Estrutura semântica e acessível para o conteúdo da web.
- **CSS3:** Estilização moderna e responsiva para uma experiência de usuário agradável.
- **JavaScript:** Lógica interativa e dinâmica para o comportamento da aplicação.

## Pré-requisitos

Para configurar e executar o UniHelp em sua máquina local, você precisará ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** (gerenciador de pacotes do Node.js, geralmente instalado junto com o Node.js)
- **PostgreSQL** (servidor de banco de dados)

## Instalação e Configuração

Siga os passos abaixo para colocar o UniHelp em funcionamento:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/albernazz/UniHelp.git
    cd UniHelp
    ```

2.  **Instale as dependências do backend:**

    Navegue até a pasta raiz do projeto (onde se encontra o `package.json`) e execute:

    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados:**

    - Certifique-se de que o PostgreSQL esteja em execução.
    - Crie um banco de dados para o projeto (ex: `unihelp_db`).
    - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

    ```
    DB_USER=seu_usuario_postgres
    DB_HOST=localhost
    DB_DATABASE=unihelp_db
    DB_PASSWORD=sua_senha_postgres
    DB_PORT=5432
    JWT_SECRET=sua_chave_secreta_jwt
    ```

    *Substitua `seu_usuario_postgres`, `sua_senha_postgres` e `sua_chave_secreta_jwt` pelos seus dados.* 

4.  **Execute as migrações (se houver) e seeds (se houver):**

    *(Assumindo que existam scripts para isso, caso contrário, este passo pode ser adaptado ou removido.)*

    ```bash
    # Exemplo: npm run migrate
    # Exemplo: npm run seed
    ```

## Como Executar

Para iniciar a aplicação, execute o seguinte comando na raiz do projeto:

```bash
npm start
# Ou para desenvolvimento com recarregamento automático:
npm run dev
```

O servidor da API estará disponível em `http://localhost:3000` (ou a porta configurada).

Para acessar a interface web, abra o arquivo `frontend/login.html` (ou `frontend/feed.html` após o login) em seu navegador.

## Estrutura do Projeto

```
UniHelp/
├── frontend/             # Contém os arquivos da interface web (HTML, CSS, JavaScript)
│   ├── css/
│   ├── js/
│   ├── feed.html
│   ├── login.html
│   ├── pergunta.html
│   └── registro.html
├── src/                  # Contém o código-fonte do backend (API Node.js)
│   ├── config/           # Configurações gerais
│   ├── controllers/      # Lógica de negócio para cada rota
│   ├── middlewares/      # Middlewares para tratamento de erros, autenticação, etc.
│   ├── routes/           # Definição das rotas da API
│   └── server.js         # Ponto de entrada da aplicação backend
├── .gitignore            # Arquivos e diretórios a serem ignorados pelo Git
├── .http                 # Arquivos de requisição HTTP (ex: para testes com REST Client)
├── package.json          # Metadados do projeto e lista de dependências
├── package-lock.json     # Registro exato das versões das dependências
└── README.md             # Este arquivo
```

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir para o UniHelp, siga estas diretrizes:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e commit (`git commit -m 'feat: adiciona nova funcionalidade'`).
4.  Envie para a branch (`git push origin feature/sua-feature`).
5.  Abra um Pull Request detalhando suas alterações.

## Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## Autores

- **Davi Albernaz**
- **Davi Castro**
- **Eduardo Gonçalves**
- **André Morais**
