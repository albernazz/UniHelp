const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const listarUsuarios = async (req, res) => {
    const result = await pool.query('SELECT id, nome, email, tipo FROM usuarios');
    res.json(result.rows);
};

const buscarUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, nome, email, tipo FROM usuarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
};

const criarUsuario = async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const result = await pool.query(
        `
        INSERT INTO usuarios (nome, email, senha, tipo)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email, tipo
        `,
        [nome, email, senhaCriptografada, tipo]
    );

    res.status(201).json(result.rows[0]);
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const result = await pool.query(
        `
        UPDATE usuarios
        SET nome = $1, email = $2, senha = $3, tipo = $4
        WHERE id = $5
        RETURNING id, nome, email, tipo
        `,
        [nome, email, senhaCriptografada, tipo, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
};

const deletarUsuario = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário removido com sucesso' });
};

const buscarUsuarioPorEmail = async (req, res) => {
    const { email } = req.params;
    const result = await pool.query('SELECT id, nome, email, tipo FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
};

const autenticarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    delete usuario.senha;
    
    res.json({
        usuario: usuario,
        token: token
    });
};

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    autenticarUsuario
};