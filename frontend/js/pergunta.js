const params = new URLSearchParams(window.location.search);
const perguntaId = params.get('id');

async function carregarPergunta() {
    try {
        const response = await fetch(`http://localhost:3000/perguntas/${perguntaId}/detalhes`);
        const dados = await response.json();

        document.getElementById('tituloPergunta').innerText = dados.pergunta.titulo;
        document.getElementById('descricaoPergunta').innerText = dados.pergunta.descricao;

        const lista = document.getElementById('listaRespostas');
        lista.innerHTML = '';

        dados.respostas.forEach(resposta => {
            lista.innerHTML += `
                <div class="card">
                    <p>${resposta.conteudo}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}

carregarPergunta();

document.getElementById('responderBtn').addEventListener('click', responderPergunta);

async function responderPergunta() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token'); // <-- Recuperação do token
    
    const conteudo = document.getElementById('novaResposta').value;

    try {
        const response = await fetch('http://localhost:3000/respostas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <-- Envio do token no cabeçalho
            },
            body: JSON.stringify({
                conteudo,
                pergunta_id: perguntaId,
                usuario_id: usuario.id
            })
        });

        if (!response.ok) {
            alert('Erro ao responder');
            return;
        }

        document.getElementById('novaResposta').value = '';
        carregarPergunta();

    } catch (error) {
        console.error(error);
    }
}