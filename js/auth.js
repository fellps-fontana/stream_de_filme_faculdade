// Em js/auth.js

// Espera o conteúdo da página carregar para executar o script
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const errorMessageDiv = document.getElementById('error-message');

            try {
                // O _id no banco de usuários é o próprio e-mail
                const user = await db_usuarios.get(email);

                if (user.senha === senha) {
                    // Login bem-sucedido!
                    // Salva informações no sessionStorage para usar em outras páginas
                    sessionStorage.setItem('usuario_logado', JSON.stringify({
                        email: user._id,
                        nome: user.nome,
                        tipo_acesso: user.tipo_acesso
                    }));
                    
                    // Redireciona para a página inicial
                    window.location.href = 'home.html';
                } else {
                    // Senha incorreta
                    errorMessageDiv.textContent = 'Senha incorreta. Tente novamente.';
                }
            } catch (err) {
                // Usuário não encontrado ou outro erro
                if (err.name === 'not_found') {
                    errorMessageDiv.textContent = 'Usuário não encontrado.';
                } else {
                    errorMessageDiv.textContent = 'Ocorreu um erro. Tente mais tarde.';
                }
            }
        });
    }
});