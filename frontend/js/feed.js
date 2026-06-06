const usuario =
    JSON.parse(
        localStorage.getItem('usuario')
    );

if (!usuario) {

    window.location.href = 'login.html';
}

document.getElementById('boasVindas')
    .innerText =
    `Olá, ${usuario.nome}!`;

document
    .getElementById('logoutBtn')
    .addEventListener('click', () => {

        localStorage.removeItem('usuario');

        window.location.href =
            'login.html';
    });

async function carregarPerguntas() {

    try {

        const response = await fetch(
            'http://localhost:3000/perguntas'
        );

        const perguntas =
            await response.json();

        const lista =
            document.getElementById(
                'listaPerguntas'
            );

        lista.innerHTML = '';

        perguntas.forEach(pergunta => {

            lista.innerHTML += `
                <div class="card">

                    <h3>
                        ${pergunta.titulo}
                    </h3>

                    <p>
                        ${pergunta.descricao}
                    </p>

                    <button
                        onclick="abrirPergunta(${pergunta.id})">
                        Ver Discussão
                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

function abrirPergunta(id) {

    window.location.href =
        `pergunta.html?id=${id}`;
}

carregarPerguntas();

document
    .getElementById('publicarBtn')
    .addEventListener('click', publicarPergunta);

async function publicarPergunta() {

    const usuario =
        JSON.parse(
            localStorage.getItem('usuario')
        );

    const titulo =
        document.getElementById('titulo').value;

    const descricao =
        document.getElementById('descricao').value;

    try {

        const response = await fetch(
            'http://localhost:3000/perguntas',
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({
                    titulo,
                    descricao,
                    usuario_id: usuario.id
                })
            }
        );

        if (!response.ok) {

            alert('Erro ao publicar');

            return;
        }

        document.getElementById('titulo').value = '';
        document.getElementById('descricao').value = '';

        carregarPerguntas();

    } catch (error) {

        console.error(error);
    }
}