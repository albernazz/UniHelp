const express = require('express');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envPath)) {
    console.log('Arquivo .env encontrado em:', envPath);
} else {
    console.log('ERRO: Arquivo .env NAO encontrado no caminho:', envPath);
}

require('dotenv').config({ path: envPath });

const usuariosRoutes = require('./routes/usuarios.routes');
const perguntasRoutes = require('./routes/perguntas.routes');
const respostasRoutes = require('./routes/respostas.routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/perguntas', perguntasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/respostas', respostasRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
    console.log('Usuario do banco:', process.env.DB_USER);
});