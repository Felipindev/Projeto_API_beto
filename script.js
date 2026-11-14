const URL = "https://jsonplaceholder.typicode.com";

const abas = document.querySelectorAll('.aba');
const btnBuscar = document.getElementById('btn-buscar');
const inputUsuarios = document.getElementById('filtro-usuario');
const listaUsuarios = document.getElementById('lista-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');

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
    users = JSON.parse(localStorage.getItem('users'));
    posts = JSON.parse(localStorage.getItem('posts'));
    comments = JSON.parse(localStorage.getItem('comments'));
    photos = JSON.parse(localStorage.getItem('photos'));

    mostrarUsuarios();
    // mostrarPosts();
    // mostrarComentarios();
    // mostrarFotos();
    } catch (erro) {
    const status = document.getElementById('status');
    status.textContent = 'Não foi possível carregar os dados da API.';
    status.classList.add('erro');
    console.error('Erro ao iniciar a aplicação: ', erro);
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

function mostrarUsuarios() {
  // filtra os usuários que tem o texto digitado no nome
  const termo = inputUsuarios.value.trim().toLowerCase();
  const filtrados = users.filter((u) => u.name.toLowerCase().includes(termo));

  // percorre cada usuario pra criar o html
  const cards = filtrados.map((u) => {
    // find procura a foto do usuário pelo id
    const foto = photos.find((f) => f.id === u.id);

    // soma 1 para cada post que tiver o mesmo userId do usuário
    const totalPosts = posts.reduce((total, p) => (p.userId === u.id ? total + 1 : total), 0);

    return `
      <div class="card usuario">
        <div class="avatar"><img src="${foto.url}" alt="Foto de ${u.name}"></div>
        <div>
          <h3>${u.name}</h3>
          <p>${u.email}</p>
          <p>${u.address.city}</p>
          <p class="qtd">${totalPosts} posts</p>
        </div>
      </div>`;
  });

  listaUsuarios.innerHTML = cards.join('');
  contadorUsuarios.textContent =
    filtrados.length + ' de ' + users.length + ' usuários';
}

inputUsuarios.addEventListener('input', mostrarUsuarios);

iniciar()