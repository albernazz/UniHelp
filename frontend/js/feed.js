const usuario = JSON.parse(localStorage.getItem('usuario'));
const token = localStorage.getItem('token');
const boasVindas = document.getElementById('boasVindas');
const authBtn = document.getElementById('authBtn');

if (usuario) {
    boasVindas.textContent = `Olá, ${usuario.nome}!`;
    authBtn.textContent = 'Sair';
    authBtn.addEventListener('click', () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        window.location.reload();
    });
} else {
    boasVindas.textContent = 'Bem-vindo ao UniHelp!';
    authBtn.textContent = 'Entrar';
    authBtn.addEventListener('click', () => window.location.href = 'login.html');
}

let paginaAtual = 1;
const limitePorPagina = 5;

async function carregarPerguntas(pagina = 1) {
    const busca = document.getElementById('inputBusca').value;
    const categoria = document.getElementById('filtroCategoria').value;

    try {
        const response = await fetch(`${API_URL}/perguntas?pagina=${pagina}&limite=${limitePorPagina}&busca=${encodeURIComponent(busca)}&categoria=${encodeURIComponent(categoria)}`);
        const respostaJson = await response.json();

        const lista = document.getElementById('listaPerguntas');
        lista.innerHTML = '';

        respostaJson.dados.forEach(pergunta => {
            const card = document.createElement('div');
            card.className = 'card';

            const titulo = document.createElement('h3');
            titulo.textContent = pergunta.titulo;

            const badge = document.createElement('span');
            badge.textContent = ` [${pergunta.categoria || 'Geral'}]`;
            badge.style.color = '#888';
            badge.style.fontSize = '0.8em';
            titulo.appendChild(badge);

            const descricao = document.createElement('p');
            descricao.textContent = pergunta.descricao;

            const botao = document.createElement('button');
            botao.textContent = 'Ver Discussão';
            botao.addEventListener('click', () => abrirPergunta(pergunta.id));

            card.appendChild(titulo);
            card.appendChild(descricao);
            card.appendChild(botao);
            lista.appendChild(card);
        });

        document.getElementById('infoPagina').textContent = `Página ${respostaJson.paginaAtual} de ${respostaJson.totalPaginas || 1}`;
        document.getElementById('btnAnterior').disabled = respostaJson.paginaAtual === 1;
        document.getElementById('btnProxima').disabled = respostaJson.paginaAtual >= respostaJson.totalPaginas;
        paginaAtual = respostaJson.paginaAtual;
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('btnBuscar').addEventListener('click', () => carregarPerguntas(1));
document.getElementById('btnAnterior').addEventListener('click', () => { if (paginaAtual > 1) carregarPerguntas(paginaAtual - 1); });
document.getElementById('btnProxima').addEventListener('click', () => carregarPerguntas(paginaAtual + 1));

function abrirPergunta(id) {
    window.location.href = `pergunta.html?id=${id}`;
}

carregarPerguntas(paginaAtual);

const publicarBtn = document.getElementById('publicarBtn');
if (publicarBtn) {
    publicarBtn.addEventListener('click', publicarPergunta);
}

async function publicarPergunta() {
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;

    try {
        const response = await fetch(`${API_URL}/perguntas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ titulo, descricao, categoria, usuario_id: usuario.id })
        });
        if (!response.ok) {
            alert('Erro ao publicar');
            return;
        }
        document.getElementById('titulo').value = '';
        document.getElementById('descricao').value = '';
        carregarPerguntas(1);
    } catch (error) {
        console.error(error);
    }
}