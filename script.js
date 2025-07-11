// Lista de Produtos
const produtos = [
    {
        id: 1,
        nome: "Linguica Toscana Tradicional",
        preco: 7.99,
        imagem: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        nome: "Linguica Toscana com Alho",
        preco: 7.99,
        imagem: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        nome: "Linguica Fininha Artesanal",
        preco: 7.99,
        imagem: "https://via.placeholder.com/150"
    },
    {
        id: 4,
        nome: "Linguica Toscana Apimentada",
        preco: 7.99,
        imagem: "https://via.placeholder.com/150"
    },
    {
        id: 5,
        nome: "Linguica Toscana de Frango",
        preco: 7.99,
        imagem: "https://via.placeholder.com/150"
    },
];

// Exibe produtos na tela
const listaProdutos = document.querySelector('.lista-produtos');

produtos.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('produto');

    card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>Adicionar ao carrinho</button>
    `;

    listaProdutos.appendChild(card);    
});

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert(`✅ ${produto.nome} foi adicionado ao carrinho!`);
}

// SAUDAÇÃO DE USUÁRIO
const user = JSON.parse(localStorage.getItem("usuarioLogado"));

if (user) {
    const header = document.querySelector("header");

    // Tenta localizar um elemento com ID 'saudacao-usuario'
    let saudacaoEl = document.getElementById("saudacao-usuario");

    // Se não existir, cria e adiciona
    if (!saudacaoEl) {
        saudacaoEl = document.createElement("p");
        saudacaoEl.id = "saudacao-usuario";
        saudacaoEl.style.textAlign = "right";
        saudacaoEl.style.margin = "0 20px";
        header.appendChild(saudacaoEl);
    }

    saudacaoEl.innerHTML = `
        👋 Olá, <strong>${user.nome}</strong>! 
        <button onclick="sair()" style="margin-left: 10px; padding: 4px 10px;">Sair</button>
    `;
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da sua conta.");
    window.location.reload();
}

if (user && user.email === "girotto@admin.com") {
  const nav = document.querySelector("nav");
  const adminLink = document.createElement("a");
  adminLink.href = "admin.html";
  adminLink.textContent = "Painel Admin";
  nav.appendChild(adminLink);
}
