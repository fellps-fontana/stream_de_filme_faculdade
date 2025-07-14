function converterUrlYouTube(url) {
    let videoId = null;
    try {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
    } catch (e) {
        console.error("Erro ao processar a URL do YouTube:", e);
        return url;
    }
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    console.warn("Não foi possível extrair um ID de vídeo do YouTube da URL:", url);
    return url;
}

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado'));
    if (!usuarioLogado || usuarioLogado.tipo_acesso !== 'admin') {
        alert('Acesso negado. Apenas os deuses do Olimpo podem entrar aqui.');
        window.location.href = 'home.html';
        return;
    }

   const addMovieForm = document.getElementById('add-movie-form');
    if (addMovieForm) {
        const formMessage = document.getElementById('form-message');
        const movieIdField = document.getElementById('movieId');
        const movieRevField = document.getElementById('movieRev');
        const cancelEditMovieBtn = document.getElementById('cancel-edit-movie');
        const movieListDiv = document.getElementById('movie-list-admin');

        async function displayMoviesAdmin() {
            movieListDiv.innerHTML = 'Carregando lendas...';
            const result = await db_filmes.allDocs({ include_docs: true });
            movieListDiv.innerHTML = '';
            result.rows.forEach(item => {
                const movie = item.doc;
                const movieAdminCard = document.createElement('div');
                movieAdminCard.className = 'user-card';
                movieAdminCard.innerHTML = `
                    <div><strong>${movie.titulo}</strong><br><small>${movie.categoria}</small></div>
                    <div>
                        <button class="edit-btn" data-id="${movie._id}">Editar</button>
                        <button class="delete-btn" data-id="${movie._id}">Excluir</button>
                    </div>
                `;
                movieListDiv.appendChild(movieAdminCard);
            });
        }

        function resetMovieForm() {
            addMovieForm.reset();
            movieIdField.value = '';
            movieRevField.value = '';
            addMovieForm.querySelector('h1').textContent = 'Forjar uma Nova Lenda';
            addMovieForm.querySelector('button[type="submit"]').textContent = 'Forjar Lenda';
            cancelEditMovieBtn.style.display = 'none';
        }

        addMovieForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = movieIdField.value;
            const rev = movieRevField.value;
            const movieData = {
                titulo: document.getElementById('titulo').value,
                sinopse: document.getElementById('sinopse').value,
                categoria: document.getElementById('categoria').value,
                url_imagem: document.getElementById('url_imagem').value,
                url_trailer: converterUrlYouTube(document.getElementById('url_trailer').value)
            };
            if (id) {
                movieData._id = id;
                movieData._rev = rev;
            } else {
                movieData._id = 'filme_' + new Date().getTime();
            }
            try {
                await db_filmes.put(movieData);
                formMessage.textContent = 'Lenda salva com sucesso no panteão!';
                formMessage.className = 'success';
                resetMovieForm();
                displayMoviesAdmin();
                setTimeout(() => { formMessage.textContent = '' }, 3000);
            } catch (err) {
                console.error('Erro ao salvar filme:', err);
                formMessage.textContent = 'Houve uma fúria dos Titãs. Tente novamente.';
                formMessage.className = 'error';
            }
        });

        movieListDiv.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.dataset.id;
            if (!id) return;
            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza que deseja apagar esta lenda dos pergaminhos para sempre?')) {
                    try {
                        const movieDoc = await db_filmes.get(id);
                        await db_filmes.remove(movieDoc);
                        displayMoviesAdmin();
                    } catch (err) { console.error('Erro ao excluir filme:', err); }
                }
            }
            if (target.classList.contains('edit-btn')) {
                try {
                    const movieDoc = await db_filmes.get(id);
                    movieIdField.value = movieDoc._id;
                    movieRevField.value = movieDoc._rev;
                    document.getElementById('titulo').value = movieDoc.titulo;
                    document.getElementById('sinopse').value = movieDoc.sinopse;
                    document.getElementById('categoria').value = movieDoc.categoria;
                    document.getElementById('url_imagem').value = movieDoc.url_imagem;
                    document.getElementById('url_trailer').value = movieDoc.url_trailer;
                    addMovieForm.querySelector('h1').textContent = 'Editar Lenda Existente';
                    addMovieForm.querySelector('button[type="submit"]').textContent = 'Atualizar Lenda';
                    cancelEditMovieBtn.style.display = 'inline-block';
                    window.scrollTo(0, 0);
                } catch (err) { console.error('Erro ao carregar filme para edição:', err); }
            }
        });
        
        cancelEditMovieBtn.addEventListener('click', resetMovieForm);
        displayMoviesAdmin();
    }

        const userForm = document.getElementById('user-form');
    if (userForm) {
        const userListDiv = document.getElementById('user-list');
        const userIdField = document.getElementById('userId');
        const userRevField = document.getElementById('userRev');
        const emailField = document.getElementById('email');
        const senhaField = document.getElementById('senha');
        const cancelEditButton = document.getElementById('cancel-edit');

        async function displayUsers() {
            userListDiv.innerHTML = 'Carregando mortais e deuses...';
            const result = await db_usuarios.allDocs({ include_docs: true });
            userListDiv.innerHTML = '';
            result.rows.forEach(item => {
                const user = item.doc;
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = `
                    <div><strong>${user.nome}</strong> (${user.tipo_acesso})<br><small>${user._id}</small></div>
                    <div>
                        <button class="edit-btn" data-id="${user._id}">Editar</button>
                        <button class="delete-btn" data-id="${user._id}">Excluir</button>
                    </div>
                `;
                userListDiv.appendChild(userCard);
            });
        }

        function resetForm() {
            userForm.reset();
            userIdField.value = '';
            userRevField.value = '';
            emailField.disabled = false;
            senhaField.placeholder = "Senha";
            senhaField.value = '';
            userForm.querySelector('button[type="submit"]').textContent = 'Salvar Usuário';
            cancelEditButton.style.display = 'none';
        }

        userForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = userIdField.value;
            const rev = userRevField.value;
            const userData = {
                nome: document.getElementById('nome').value,
                tipo_acesso: document.getElementById('tipo_acesso').value,
            };
            if (id) {
                userData._id = id;
                userData._rev = rev;
                if (senhaField.value) {
                    userData.senha = senhaField.value;
                }
            } else {
                userData._id = emailField.value;
                if (!senhaField.value) {
                    alert('A senha é obrigatória para novos usuários.');
                    return;
                }
                userData.senha = senhaField.value;
            }
            try {
                await db_usuarios.put(userData);
                alert('Usuário salvo com sucesso!');
                resetForm();
                displayUsers();
            } catch (err) {
                console.error('Erro ao salvar usuário:', err);
                alert('Erro ao salvar usuário.');
            }
        });

        userListDiv.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.dataset.id;
            if (!id) return;
            if (target.classList.contains('delete-btn')) {
                if (id === 'admin@heroflix.com') {
                    alert('Não é sábio tentar apagar o deus dos deuses!');
                    return;
                }
                if (confirm('Tem certeza que deseja banir este mortal do Olimpo?')) {
                    try {
                        const userDoc = await db_usuarios.get(id);
                        await db_usuarios.remove(userDoc);
                        displayUsers();
                    } catch (err) {
                        console.error('Erro ao excluir:', err);
                        alert('Erro ao excluir usuário.');
                    }
                }
            }
            if (target.classList.contains('edit-btn')) {
                try {
                    const userDoc = await db_usuarios.get(id);
                    userIdField.value = userDoc._id;
                    userRevField.value = userDoc._rev;
                    document.getElementById('nome').value = userDoc.nome;
                    emailField.value = userDoc._id;
                    emailField.disabled = true;
                    document.getElementById('tipo_acesso').value = userDoc.tipo_acesso;
                    senhaField.placeholder = "Deixe em branco para não alterar";
                    senhaField.value = '';
                    userForm.querySelector('button[type="submit"]').textContent = 'Atualizar Usuário';
                    cancelEditButton.style.display = 'inline-block';
                    window.scrollTo(0, 0);
                } catch (err) {
                    console.error('Erro ao carregar para edição:', err);
                }
            }
        });
        
        cancelEditButton.addEventListener('click', resetForm);
        displayUsers();
    }
});