
document.addEventListener('DOMContentLoaded', async () => {
    // Pega os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id'); // Pega o valor do parâmetro 'id'

    if (!movieId) {
        // Se não houver ID na URL, redireciona para a home
        window.location.href = 'home.html';
        return;
    }

    // Seleciona os elementos do HTML que vamos preencher
    const movieImage = document.getElementById('movie-image');
    const movieTitle = document.getElementById('movie-title');
    const movieCategory = document.getElementById('movie-category');
    const movieSynopsis = document.getElementById('movie-synopsis');
    const trailerContainer = document.getElementById('trailer-container');

    try {
        // Busca o filme específico no banco de dados usando o ID
        const movie = await db_filmes.get(movieId);

        // Preenche a página com os dados do filme
        document.title = `Hero Flix - ${movie.titulo}`; // Atualiza o título da aba do navegador
        movieImage.src = movie.url_imagem;
        movieImage.alt = `Pôster de ${movie.titulo}`;
        movieTitle.textContent = movie.titulo;
        movieCategory.textContent = movie.categoria;
        movieSynopsis.textContent = movie.sinopse;

        // Cria e insere o trailer do YouTube
        if (movie.url_trailer) {
            const iframe = document.createElement('iframe');
            iframe.src = movie.url_trailer;
            iframe.width = "560";
            iframe.height = "315";
            iframe.title = `Trailer de ${movie.titulo}`;
            iframe.setAttribute('frameborder', '0'); // Método mais compatível
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            trailerContainer.appendChild(iframe);
        } else {
            trailerContainer.textContent = 'Trailer indisponível.';
        }

    } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
        // Atualiza a tela para mostrar que o filme não foi encontrado
        const container = document.querySelector('.movie-details-container');
        if(container) {
            container.innerHTML = '<h1>Lenda não encontrada nos pergaminhos.</h1>';
        }
    }
});