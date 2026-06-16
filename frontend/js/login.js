const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            const dataErro = await response.json();
            alert(dataErro.erro || 'Erro na autenticação');
            return;
        }

        const respostaLogin = await response.json();

        localStorage.setItem(
            'usuario',
            JSON.stringify(respostaLogin.usuario)
        );
        
        localStorage.setItem(
            'token',
            respostaLogin.token
        );

        window.location.href = 'feed.html';

    } catch (error) {
        console.error(error);
        alert('Erro ao realizar login');
    }
});