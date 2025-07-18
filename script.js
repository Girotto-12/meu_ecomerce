// Lista de Produtos
const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// Elementos
const listaProdutos = document.querySelector(".lista-produtos");

// Exibe produtos na tela
function renderizarProdutos(lista = produtos) {
  listaProdutos.innerHTML = "";

  if (lista.length === 0) {
    listaProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach((produto) => {
    const card = document.createElement("div");
    card.classList.add("produto");

    const seloPromocao = produto.promocao
      ? `<span class="selo-promocao">🔥 Promoção</span>`
      : "";

    card.innerHTML = `
      ${seloPromocao}
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${Number(produto.preco).toFixed(2)}</p>
      <button onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>Adicionar ao carrinho</button>
    `;

    listaProdutos.appendChild(card);
  });
}

renderizarProdutos();

// ✅ Adicionar ao carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  // Animação rápida no botão (se quiser implementar depois)
  alert(`✅ ${produto.nome} foi adicionado ao carrinho!`);
}


// ✅ Saudação de usuário
const user = JSON.parse(localStorage.getItem("usuarioLogado"));

if (user) {
  const header = document.querySelector("header");

  let saudacaoEl = document.getElementById("saudacao-usuario");

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

// ✅ Filtro por nome e preço
function filtrarProdutos() {
  const nome = document.getElementById("filtroNome").value.toLowerCase();
  const min = parseFloat(document.getElementById("filtroMin").value);
  const max = parseFloat(document.getElementById("filtroMax").value);

  const filtrados = produtos.filter((p) => {
    const nomeValido = p.nome.toLowerCase().includes(nome);
    const precoMinimoValido = isNaN(min) || p.preco >= min;
    const precoMaximoValido = isNaN(max) || p.preco <= max;
    return nomeValido && precoMinimoValido && precoMaximoValido;
  });

  renderizarProdutos(filtrados);
}

function limparFiltros() {
  document.getElementById("filtroNome").value = "";
  document.getElementById("filtroMin").value = "";
  document.getElementById("filtroMax").value = "";
  renderizarProdutos(produtos);
}

// script.js ou outro arquivo JS principal
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://idukyfshevrbutkddvuw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua chave completa aqui
const supabase = createClient(supabaseUrl, supabaseKey);
