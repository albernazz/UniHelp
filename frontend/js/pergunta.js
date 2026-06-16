const params = new URLSearchParams(window.location.search);
const perguntaId = params.get('id');

const usuario = JSON.parse(localStorage.getItem('usuario'));
const token = localStorage.getItem('token'); 

async function carregarPergunta() {
    try {
        if (!perguntaId) {
            return;
        }

        const response = await fetch(`${API_URL}/perguntas/${perguntaId}/detalhes`);
        
        if (!response.ok) {
            return;
        }

        const dados = await response.json();

        document.getElementById('tituloPergunta').textContent = dados.pergunta.titulo;
        document.getElementById('descricaoPergunta').textContent = dados.pergunta.descricao;

        const lista = document.getElementById('listaRespostas');
        lista.innerHTML = '';

        if (dados.respostas && dados.respostas.length > 0) {
            dados.respostas.forEach(resposta => {
                const card = document.createElement('div');
                card.className = 'card';

                const conteudo = document.createElement('p');
                conteudo.textContent = resposta.conteudo;

                card.appendChild(conteudo);
                lista.appendChild(card);
            });
        }

    } catch (error) {
        console.error(error);
    }
}

carregarPergunta();

const responderBtn = document.getElementById('responderBtn');
if (responderBtn) {
    responderBtn.addEventListener('click', responderPergunta);
}

async function responderPergunta() {
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    const conteudo = document.getElementById('novaResposta').value;

    if (!conteudo || !conteudo.trim()) {
        alert('A resposta não pode estar vazia.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/respostas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                conteudo,
                pergunta_id: perguntaId,
                usuario_id: usuario.id
            })
        });

        if (!response.ok) {
            const erro = await response.json();
            alert(erro.erro || 'Erro ao responder');
            return;
        }

        document.getElementById('novaResposta').value = '';
        
        carregarPergunta();

    } catch (error) {
        console.error(error);
        alert('Erro ao enviar resposta');
    }
}