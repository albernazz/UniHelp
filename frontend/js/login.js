const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const email =
        document.getElementById('email').value;

    const senha =
        document.getElementById('senha').value;

    try {

        const response = await fetch(
            `http://localhost:3000/usuarios/email/${email}`
        );

        if (!response.ok) {

            alert('Usuário não encontrado');

            return;
        }

        const usuario = await response.json();

        if (usuario.senha !== senha) {

            alert('Senha incorreta');

            return;
        }

        localStorage.setItem(
            'usuario',
            JSON.stringify(usuario)
        );

        window.location.href = 'feed.html';

    } catch (error) {

        console.error(error);

        alert('Erro ao realizar login');
    }

});