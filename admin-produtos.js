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

    const novoProduto = {
        id: Date.now(),
        nome,
        preco,
        imagem,
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

    if (!nome || isNaN(preco) || !imagem) {
        alert("⚠️ Preencha todos os campos corretamente.");
        return;
    }

    produtos[editandoIndex] = {
        ...produtos[editandoIndex],
        nome,
        preco,
        imagem
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
            <button onclick="editarProduto(${index})">✏️ Editar</button>
            <button onclick="removerProduto(${index})" style="margin-left: 8px;">🗑️ Remover</button>
        `;

        listaEl.appendChild(card);
    });
}

renderizarProdutos();
