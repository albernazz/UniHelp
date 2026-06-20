const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

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
const errorHandler = require('./middlewares/error.middleware');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// --- Rate Limiting (Segurança) ---
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Limita a 3 requisições
    message: { erro: 'Muitas requisições deste IP, por favor, tente novamente mais tarde.' }
});

// Aplica o Rate Limit em todas as rotas da API
app.use('/perguntas', limiter);
app.use('/usuarios', limiter);
app.use('/respostas', limiter);
// ---------------------------------

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/perguntas', perguntasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/respostas', respostasRoutes);

app.get('/', (req, res) => {
    res.redirect('/feed.html');
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});