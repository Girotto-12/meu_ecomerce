const SUPABASE_URL = 'https://idukyfshevrbutkddvuw.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("formProduto");
const listaEl = document.getElementById("lista-produtos");
const nomeInput = document.getElementById("nome");
const precoInput = document.getElementById("preco");
const imagemInput = document.getElementById("imagem");
const botao = form.querySelector("button");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let editandoIndex = null;

// ✅ Cadastro inicial
form.addEventListener("submit", cadastrarProduto);

function cadastrarProduto(e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);
    const imagem = imagemInput.value.trim();

    if (!nome || isNaN(preco) || !imagem) {
        alert("⚠️ Preencha todos os campos corretamente.");
        return;
    }

    const promocao = document.getElementById("promocao").checked;

    const novoProduto = {
        id: Date.now(),
        nome,
        preco,
        imagem,
        promocao
    };

    produtos.push(novoProduto);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    form.reset();
    renderizarProdutos();
    alert("✅ Produto cadastrado com sucesso!");
}

// ✅ Editar produto
function editarProduto(index) {
    const produto = produtos[index];
    nomeInput.value = produto.nome;
    precoInput.value = produto.preco;
    imagemInput.value = produto.imagem;
    document.getElementById("promocao").checked = produto.promocao || false;


    botao.textContent = "Salvar Edição";
    editandoIndex = index;

    form.removeEventListener("submit", cadastrarProduto);
    form.addEventListener("submit", salvarEdicao);
}

function salvarEdicao(e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);
    const imagem = imagemInput.value.trim();
    const promocao = document.getElementById("promocao").checked;

    if (!nome || isNaN(preco) || !imagem) {
        alert("⚠️ Preencha todos os campos corretamente.");
        return;
    }

    produtos[editandoIndex] = {
        ...produtos[editandoIndex],
        nome,
        preco,
        imagem,
        promocao
    };

    localStorage.setItem("produtos", JSON.stringify(produtos));
    form.reset();
    botao.textContent = "Cadastrar Produto";

    form.removeEventListener("submit", salvarEdicao);
    form.addEventListener("submit", cadastrarProduto);

    renderizarProdutos();
    alert("✏️ Produto editado com sucesso!");
}

// ✅ Remover produto
function removerProduto(index) {
    if (confirm("Tem certeza que deseja remover este produto?")) {
        produtos.splice(index, 1);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderizarProdutos();
    }
}

// ✅ Renderiza os produtos na tela
function renderizarProdutos() {
    listaEl.innerHTML = "";

    if (produtos.length === 0) {
        listaEl.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
        return;
    }

    produtos.forEach((produto, index) => {
        const card = document.createElement("div");
        card.classList.add("produto");

        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100px;">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            ${produto.promocao ? '<span style="color: red; font-weight: bold;">🔥 Em Promoção!</span>' : ''}
            <button onclick="editarProduto(${index})">✏️ Editar</button>
            <button onclick="removerProduto(${index})" style="margin-left: 8px;">🗑️ Remover</button>
        `;

        listaEl.appendChild(card);
    });
}

renderizarProdutos();

async function carregarProdutos() {
  const { data: produtos, error } = await supabase.from("produtos").select("*");
  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return;
  }

  const container = document.getElementById("lista-produtos");
  produtos.forEach((produto) => {
    const div = document.createElement("div");
    div.classList.add("produto");
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
    `;
    container.appendChild(div);
  });
}

carregarProdutos();
