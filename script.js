const URL = "https://jsonplaceholder.typicode.com";

const abas = document.querySelectorAll('.aba');
const btnBuscar = document.getElementById('btn-buscar');

let users = [];
let posts = [];
let comments = [];
let photos = [];

async function getData(rota){
    try {
        const resposta = await fetch(URL + "/" + rota);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar dados da rota ${rota}: ${resposta.status}`);
        }
        localStorage.setItem(rota, JSON.stringify(dados));
    } catch (error) {
        console.log("Erro o buscar dados a API: ", error);
    }
}

async function iniciar() {
    try {
        const rotas = ['users', 'posts', 'comments', 'photos'];

        // for...of faz uma rota de cada vez; só busca se ainda não estiver salva
        for (const rota of rotas) {
            if (localStorage.getItem(rota) === null) {
                await getData(rota);
            }
    }

    // A partir daqui, tudo vem do localStorage
    usuarios = JSON.parse(localStorage.getItem('users'));
    posts = JSON.parse(localStorage.getItem('posts'));
    comentarios = JSON.parse(localStorage.getItem('comments'));
    fotos = JSON.parse(localStorage.getItem('photos'));

    document.getElementById('status').remove();
    mostrarUsuarios();
    mostrarPosts();
    mostrarComentarios();
    mostrarFotos();
    } catch (erro) {
    const status = document.getElementById('status');
    status.textContent = 'Não foi possível carregar os dados da API.';
    status.classList.add('erro');
    }
}

function buscarDeNovo() {
    localStorage.clear();
    location.reload();
}

btnBuscar.addEventListener('click', buscarDeNovo);

abas.forEach((aba) => {
    // seleciono a aba clicada e escondo as outras com o ID
    aba.addEventListener('click', () => {

    const nome = aba.id

    document.querySelectorAll('.painel').forEach((painel) => {
        painel.hidden = painel.id !== nome;
    });
    });
});