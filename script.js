const URL = "https://jsonplaceholder.typicode.com";

const abas = document.querySelectorAll('.aba');
const btnBuscar = document.getElementById('btn-buscar');
const inputUsuarios = document.getElementById('filtro-usuario');
const listaUsuarios = document.getElementById('lista-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const inputNome = document.getElementById('filtro-nome');
const inputEmail = document.getElementById('filtro-email');
const inputIdPost = document.getElementById('filtro-id-post');
const listaPosts = document.getElementById('lista-posts');
const contadorPosts = document.getElementById('contador-posts');

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

    document.getElementById('status').hidden = true;

    mostrarUsuarios();
    mostrarPosts();
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

function mostrarPosts() {
    const nome = inputNome.value.trim().toLowerCase();
    const email = inputEmail.value.trim().toLowerCase();
    const idPost = inputIdPost.value.trim();

    // o post é filtrado quando o nome e email do autor combinam com
    //  o que foi digitado, e quando o id do post é vazio ou combina com o que foi digitado
    const filtrados = posts.filter((p) => {
        const autor = users.find((u) => u.id === p.userId);

        const nomeCombina = autor.name.toLowerCase().includes(nome);
        const emailCombina = autor.email.toLowerCase().includes(email);
        const idCombina = idPost === '' || p.id === Number(idPost);

        return nomeCombina && emailCombina && idCombina;
    });

    const cards = filtrados.map((p) => {
        const autor = users.find((u) => u.id === p.userId);
        const foto = photos.find((f) => f.id === p.userId); // foto com o id do usuário
        const totalComentarios = comments.filter((c) => c.postId === p.id).length;

        // clicar no card abre/fecha os comentários
        // o stopPropagation evita que clicar nos comentários feche a caixa
        return `
      <div class="card post" onclick="alternarComentarios(${p.id})">
        <div class="post-topo">
          <div class="avatar"><img src="${foto.url}" alt="Foto de ${autor.name}"></div>
          <div>
            <strong>${autor.name}</strong>
            <span>${autor.email}</span>
          </div>
        </div>
        <div class="post-corpo">
          <p class="post-meta">Post ${p.id}</p>
          <h3>${p.title}</h3>
          <p>${p.body}</p>
          <p class="post-rodape">Ver comentários (${totalComentarios})</p>
          <div class="comentarios" id="comentarios-${p.id}" onclick="event.stopPropagation()" hidden></div>
        </div>
      </div>`;
    });

    listaPosts.innerHTML = cards.join('');
    contadorPosts.textContent =
        filtrados.length + ' de ' + posts.length + ' posts';
}

inputNome.addEventListener('input', mostrarPosts);
inputEmail.addEventListener('input', mostrarPosts);
inputIdPost.addEventListener('input', mostrarPosts);

// comentario
function criarComentario(c) {
    return `
      <div class="comentario">
        <strong>${c.name}</strong>
        <small>${c.email}</small>
        <p>${c.body}</p>
      </div>`;
}

function alternarComentarios(idPost) {
    const caixa = document.getElementById('comentarios-' + idPost);

    if (caixa.hidden) {
        // só pega os comentários desse post quando abre
        const doPost = comments.filter((c) => c.postId === idPost);
        caixa.innerHTML = doPost.map(criarComentario).join('');
        caixa.hidden = false;
    } else {
        caixa.hidden = true;
    }
}

iniciar()