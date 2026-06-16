const form = document.getElementById('registroForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        tipo: document.getElementById('tipo').value
    };

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.error(error);
        alert('Erro ao criar conta');
    }
});