const pool = require('../config/db');

const listarRespostas = async (req, res) => {
    const result = await pool.query('SELECT * FROM respostas ORDER BY criado_em DESC');
    res.json(result.rows);
};

const buscarRespostaPorId = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM respostas WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Resposta não encontrada' });
    }

    res.json(result.rows[0]);
};

const criarResposta = async (req, res) => {
    const { conteudo, pergunta_id } = req.body;
    const usuario_id = req.usuario.id;

    if (!conteudo || !conteudo.trim()) {
        return res.status(400).json({
            erro: 'O conteúdo da resposta não pode estar vazio.'
        });
    }

    const result = await pool.query(
        `
        INSERT INTO respostas (conteudo, pergunta_id, usuario_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [conteudo, pergunta_id, usuario_id]
    );

    res.status(201).json(result.rows[0]);
};

const atualizarResposta = async (req, res) => {
    const { id } = req.params;
    const { conteudo } = req.body;
    const usuarioId = req.usuario.id;

    if (!conteudo || !conteudo.trim()) {
        return res.status(400).json({
            erro: 'O conteúdo da resposta não pode estar vazio.'
        });
    }

    const result = await pool.query(
        `
        UPDATE respostas
        SET conteudo = $1
        WHERE id = $2 AND usuario_id = $3
        RETURNING *
        `,
        [conteudo, id, usuarioId]
    );

    if (result.rows.length === 0) {
        return res.status(403).json({
            erro: 'Não tem permissão para editar esta resposta ou ela não existe'
        });
    }

    res.json(result.rows[0]);
};

const deletarResposta = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const result = await pool.query(
        'DELETE FROM respostas WHERE id = $1 AND usuario_id = $2 RETURNING *',
        [id, usuarioId]
    );

    if (result.rows.length === 0) {
        return res.status(403).json({
            erro: 'Não tem permissão para apagar esta resposta ou ela não existe'
        });
    }

    res.json({ mensagem: 'Resposta removida com sucesso' });
};

module.exports = {
    listarRespostas,
    buscarRespostaPorId,
    criarResposta,
    atualizarResposta,
    deletarResposta
};

const votarResposta = async (req, res) => {
    const { id } = req.params; // ID da resposta
    const { tipo } = req.body; // 'util' ou 'nao_util'
    const usuario_id = req.usuario.id; // Pegamos o ID de quem está logado pelo token

    if (tipo !== 'util' && tipo !== 'nao_util') {
        return res.status(400).json({ erro: 'Tipo de voto inválido' });
    }

    try {
        // 1. Verifica se a resposta existe
        const respostaCheck = await pool.query('SELECT * FROM respostas WHERE id = $1', [id]);
        if (respostaCheck.rows.length === 0) {
            return res.status(404).json({ erro: 'Resposta não encontrada' });
        }

        // 2. Verifica se já existe um voto deste utilizador para esta resposta
        const votoExistente = await pool.query(
            'SELECT * FROM votos_respostas WHERE usuario_id = $1 AND resposta_id = $2',
            [usuario_id, id]
        );

        let result;

        if (votoExistente.rows.length > 0) {
            const votoAnterior = votoExistente.rows[0].tipo;

            if (votoAnterior === tipo) {
                // Clicou no MESMO botão: REMOVER O VOTO
                await pool.query('DELETE FROM votos_respostas WHERE id = $1', [votoExistente.rows[0].id]);

                const coluna = tipo === 'util' ? 'votos_uteis' : 'votos_nao_uteis';
                result = await pool.query(
                    `UPDATE respostas SET ${coluna} = ${coluna} - 1 WHERE id = $1 RETURNING *`,
                    [id]
                );
                return res.json({ mensagem: 'Voto removido com sucesso', resposta: result.rows[0] });

            } else {
                // Clicou no botão OPOSTO: TROCAR O VOTO
                await pool.query('UPDATE votos_respostas SET tipo = $1 WHERE id = $2', [tipo, votoExistente.rows[0].id]);

                if (tipo === 'util') {
                    result = await pool.query(
                        'UPDATE respostas SET votos_uteis = votos_uteis + 1, votos_nao_uteis = votos_nao_uteis - 1 WHERE id = $1 RETURNING *',
                        [id]
                    );
                } else {
                    result = await pool.query(
                        'UPDATE respostas SET votos_nao_uteis = votos_nao_uteis + 1, votos_uteis = votos_uteis - 1 WHERE id = $1 RETURNING *',
                        [id]
                    );
                }
                return res.json({ mensagem: 'Voto alterado com sucesso', resposta: result.rows[0] });
            }
        } else {
            // Não tinha votado ainda: ADICIONAR VOTO
            await pool.query(
                'INSERT INTO votos_respostas (usuario_id, resposta_id, tipo) VALUES ($1, $2, $3)',
                [usuario_id, id, tipo]
            );

            const coluna = tipo === 'util' ? 'votos_uteis' : 'votos_nao_uteis';
            result = await pool.query(
                `UPDATE respostas SET ${coluna} = ${coluna} + 1 WHERE id = $1 RETURNING *`,
                [id]
            );
            return res.json({ mensagem: 'Voto registado com sucesso', resposta: result.rows[0] });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao processar o voto' });
    }
};

module.exports = {
    listarRespostas, buscarRespostaPorId, criarResposta, atualizarResposta, deletarResposta, votarResposta
};