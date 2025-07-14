// ===== FUNÇÃO PARA CRIAR/GARANTIR O ADMIN PADRÃO =====
async function garantirAdminPadrao() {
    try {
        await db_usuarios.get('admin@heroflix.com');
        console.log('Usuário administrador padrão já existe.');
    } catch (err) {
        if (err.name === 'not_found') {
            console.log('Criando usuário administrador padrão...');
            await db_usuarios.put({
                _id: 'admin@heroflix.com',
                nome: 'Admin',
                senha: 'admin123',
                tipo_acesso: 'admin'
            });
            console.log('Usuário administrador padrão criado com sucesso.');
        } else {
            console.error('Ocorreu um erro ao verificar o admin padrão:', err);
        }
    }
}

// ===== FUNÇÃO PARA POPULAR O CATÁLOGO INICIALMENTE =====
async function popularOlimpoSeNecessario() {
    try {
        await db_filmes.get('filme_1');
        console.log('O Panteão já está populado com lendas.');
    } catch (err) {
        if (err.name === 'not_found') {
            console.log('Populando o Panteão com as lendas iniciais...');
            
            // ===== LISTA DE LENDAS COM TRAILERS REAIS ATUALIZADA =====
            const novasLendas = [
                { _id: 'filme_1', titulo: 'Perseu e a Medusa', sinopse: 'Um jovem herói parte em uma missão impossível para obter a cabeça da Górgona Medusa para salvar sua mãe.', categoria: 'Jornadas Épicas', url_imagem: 'https://deusesgregos.com.br/wp-content/uploads/2024/06/image-2024-06-18T182008.783-1.png', url_trailer: 'https://www.youtube.com/embed/GkZkweNpl1E' },
                { _id: 'filme_2', titulo: 'A Queda de Ícaro', sinopse: 'A história trágica de um jovem que, em sua ambição de alcançar o sol, ignora os avisos de seu pai e encontra seu destino.', categoria: 'Tragédias Gregas', url_imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Gowy-icaro-prado.jpg/1200px-Gowy-icaro-prado.jpg', url_trailer: 'https://www.youtube.com/embed/viI1sMvKUCA' },
                { _id: 'filme_3', titulo: 'O Festim de Dionísio', sinopse: 'O deus do vinho convoca uma celebração lendária, mas o ciúme entre sátiros e ninfas ameaça transformar a festa em caos.', categoria: 'Fábulas de Sátiros', url_imagem: 'https://substackcdn.com/image/fetch/$s_!OKu2!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffff85734-c8a6-42a0-962e-16e014901274_800x857.jpeg', url_trailer: 'https://www.youtube.com/embed/5euLgngf2Lc' },
                { _id: 'filme_4', titulo: 'A Caixa de Pandora', sinopse: 'A curiosidade de uma mulher libera todos os males no mundo, deixando apenas a Esperança aprisionada. Uma lenda contada em traços vivos.', categoria: 'Lendas em Pergaminho', url_imagem: 'https://super.abril.com.br/wp-content/uploads/2018/02/o-que-c3a9-a-caixa-de-pandora.png?w=720&h=440&crop=1', url_trailer: 'https://www.youtube.com/embed/FyI6c0b6hgI' },
                { _id: 'filme_6', titulo: 'O Autômato de Hefesto', sinopse: 'O deus ferreiro cria um guardião de bronze colossal para proteger uma ilha, mas sua criação se volta contra os mortais.', categoria: 'Oráculos de Bronze', url_imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrt4kHdPO7PNQpYeWbUrhV4DiMLmyNHusGZ8YrbAx7u3v_UeCwdAeBTiSl1nf-WiKGBHy7dqk-FBXS6zG1f799hWY5JAG9GKBzWzmILtxgJCinMAQmZYAKLliG45tAKrU0zrA2GefbmIM/s1600/Automaton.jpg', url_trailer: 'https://www.youtube.com/embed/X1hV4DZKviI' },
                { _id: 'filme_7', titulo: 'Jasão e o Velo de Ouro', sinopse: 'O líder dos Argonautas navega por mares traiçoeiros e enfrenta desafios divinos para recuperar um tesouro místico.', categoria: 'Jornadas Épicas', url_imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBmt-R8lDsn1qkpoLjEO7mzLgt8QihNhPlNg&s', url_trailer: 'https://www.youtube.com/embed/4b-Pdt_dxMU' },
                { _id: 'filme_8', titulo: 'O Mito de Sísifo', sinopse: 'Condenado pelos deuses a uma eternidade de esforço fútil, um rei astuto reflete sobre a natureza do seu castigo no submundo.', categoria: 'Tragédias Gregas', url_imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRur-_dDsMBHicKjjyotew4QcyyXpujwmJcSA&s', url_trailer: 'https://www.youtube.com/embed/HvWsUDbAAgs' },
                { _id: 'filme_9', titulo: 'Eco e Narciso', sinopse: 'Uma ninfa amaldiçoada a repetir os outros e um jovem belo que se apaixona pelo próprio reflexo se encontram em uma fábula sobre amor e vaidade.', categoria: 'Fábulas de Sátiros', url_imagem: 'https://static.todamateria.com.br/upload/ec/oe/ecoenarcisojohnwilliamwaterhouse-cke.jpg', url_trailer: 'https://www.youtube.com/embed/u65t9YmHIeQ' },
                { _id: 'filme_10', titulo: 'Os 12 Trabalhos de Hércules', sinopse: 'Para se redimir de um crime terrível, o maior dos heróis precisa completar doze tarefas aparentemente impossíveis dadas pelos deuses.', categoria: 'Jornadas Épicas', url_imagem: 'https://www.fantasticacultural.com.br/imgs/imgs_600_mob/202203150906029-herculos_mitologia_grega_lion_pieter_paul_rubens.webp', url_trailer: 'https://www.youtube.com/embed/b8cKYQmHHzQ' }
            ];

            await db_filmes.bulkDocs(novasLendas);
            console.log('O Panteão foi populado com 9 novas lendas!');
        } else {
            console.error('Um Titã interferiu na verificação do Panteão:', err);
        }
    }
}


// Espera o conteúdo da página carregar para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Garante que o usuário admin e o catálogo inicial existam
    garantirAdminPadrao();
    popularOlimpoSeNecessario();

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const errorMessageDiv = document.getElementById('error-message');

            try {
                const user = await db_usuarios.get(email);

                if (user.senha === senha) {
                    sessionStorage.setItem('usuario_logado', JSON.stringify({
                        email: user._id,
                        nome: user.nome,
                        tipo_acesso: user.tipo_acesso
                    }));
                    window.location.href = 'home.html';
                } else {
                    errorMessageDiv.textContent = 'Senha incorreta. Tente novamente.';
                }
            } catch (err) {
                if (err.name === 'not_found') {
                    errorMessageDiv.textContent = 'Usuário não encontrado.';
                } else {
                    errorMessageDiv.textContent = 'Ocorreu um erro. Tente mais tarde.';
                }
            }
        });
    }
});