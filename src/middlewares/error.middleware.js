const errorHandler = (err, req, res, next) => {
    console.error(`[ERRO] ${err.message}`);

    const status = err.status || 500;
    const mensagem = err.status ? err.message : 'Erro interno no servidor';

    res.status(status).json({
        erro: mensagem
    });
};

module.exports = errorHandler;