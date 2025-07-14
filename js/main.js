const LENDAS_DAS_CATEGORIAS = {
    "Jornadas Épicas": {
        titulo: "Jornadas Épicas",
        descricao: "Relatos de heróis que desafiaram bestas e o próprio destino em busca da glória eterna, com o aço e a coragem como seus únicos aliados."
    },
    "Tragédias Gregas": {
        titulo: "Tragédias Gregas",
        descricao: "Crônicas de reis e rainhas cujas paixões, orgulho e falhas selaram a queda de grandes impérios e atraíram a ira dos céus."
    },
    "Fábulas de Sátiros": {
        titulo: "Fábulas de Sátiros",
        descricao: "Contos de amores proibidos, festins regados a vinho e as travessuras de criaturas selvagens nos bosques sagrados, longe dos olhos dos homens."
    },
    "Lendas em Pergaminho": {
        titulo: "Lendas em Pergaminho",
        descricao: "Mitos imortais recontados em cores e formas que dançam como sombras em uma caverna, para inspirar novas gerações."
    },
    "Oráculos de Bronze": {
        titulo: "Oráculos de Bronze",
        descricao: "Profecias de um tempo onde a força dos heróis se une à engenhosidade de Hefesto, forjando futuros de metal e vapor."
    }
};

// TUDO deve estar dentro deste bloco, que espera a página carregar
document.addEventListener('DOMContentLoaded', () => {

    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    const userGreeting = document.getElementById('user-greeting');
    const logoutButton = document.getElementById('logout-button');
    const userInfoDiv = document.querySelector('.user-info');

    userGreeting.textContent = `Saudações, ${usuarioLogado.nome}!`;

    if (usuarioLogado.tipo_acesso === 'admin') {
        const adminButton = document.createElement('a');
        adminButton.href = 'admin.html';
        adminButton.textContent = 'Painel de Hefesto';
        adminButton.className = 'admin-button';
        userInfoDiv.insertBefore(adminButton, logoutButton);
    }

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('usuario_logado');
        window.location.href = 'login.html';
    });

    const movieGrid = document.getElementById('movie-grid');
    const categoryDisplay = document.getElementById('category-display');
    const categoryTitle = document.getElementById('category-title');
    const categoryDescription = document.getElementById('category-description');

    async function displayMovies(filterCategory = 'Todos') {
        movieGrid.innerHTML = ''; 
        
        if (filterCategory !== 'Todos' && LENDAS_DAS_CATEGORIAS[filterCategory]) {
            const lenda = LENDAS_DAS_CATEGORIAS[filterCategory];
            categoryTitle.textContent = lenda.titulo;
            categoryDescription.textContent = lenda.descricao;
            categoryDisplay.style.display = 'block';
        } else {
            categoryDisplay.style.display = 'none';
        }

        try {
            const result = await db_filmes.allDocs({ include_docs: true });
            
            result.rows.forEach(row => {
                const movie = row.doc;

                if (filterCategory !== 'Todos' && movie.categoria !== filterCategory) {
                    return;
                }

                const movieCard = document.createElement('a');
                movieCard.href = `filme.html?id=${movie._id}`;
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <img src="${movie.url_imagem}" alt="${movie.titulo}">
                    <h3>${movie.titulo}</h3>
                `;
                
                movieGrid.appendChild(movieCard);
            });

        } catch (err) {
            console.error('Erro ao buscar filmes:', err);
        }
    }

    const categoryButtons = document.querySelectorAll('.category-button');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active-category'));
            button.classList.add('active-category');

            const category = button.getAttribute('data-category');
            displayMovies(category); 
        });
    });

    displayMovies();
    const todosButton = document.querySelector('.category-button[data-category="Todos"]');
    if(todosButton) {
        todosButton.classList.add('active-category');
    }
});