const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'login.html';
}

document.getElementById('boasVindas').textContent = `Olá, ${usuario.nome}!`;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

let paginaAtual = 1;
const limitePorPagina = 5;

async function carregarPerguntas(pagina = 1) {
    try {
        const response = await fetch(`${API_URL}/perguntas?pagina=${pagina}&limite=${limitePorPagina}`);
        const respostaJson = await response.json();
        
        const lista = document.getElementById('listaPerguntas');
        lista.innerHTML = '';

        respostaJson.dados.forEach(pergunta => {
            const card = document.createElement('div');
            card.className = 'card';

            const titulo = document.createElement('h3');
            titulo.textContent = pergunta.titulo;

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

document.getElementById('btnAnterior').addEventListener('click', () => {
    if (paginaAtual > 1) {
        carregarPerguntas(paginaAtual - 1);
    }
});

document.getElementById('btnProxima').addEventListener('click', () => {
    carregarPerguntas(paginaAtual + 1);
});

function abrirPergunta(id) {
    window.location.href = `pergunta.html?id=${id}`;
}

carregarPerguntas(paginaAtual);

document.getElementById('publicarBtn').addEventListener('click', publicarPergunta);

async function publicarPergunta() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    try {
        const response = await fetch(`${API_URL}/perguntas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                titulo,
                descricao,
                usuario_id: usuario.id
            })
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