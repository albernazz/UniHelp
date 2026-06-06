const express = require('express');

const usuariosRoutes = require('./routes/usuarios.routes');

const perguntasRoutes = require('./routes/perguntas.routes');

const respostasRoutes = require('./routes/respostas.routes');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('UniHelp API funcionando');
});

app.use('/perguntas', perguntasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/respostas', respostasRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});