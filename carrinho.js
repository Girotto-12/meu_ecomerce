let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const container = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");

function renderizarCarrinho() {
  container.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = "<p>🛒 Seu carrinho está vazio.</p>";
    totalEl.textContent = "Total: R$ 0.00";
    return;
  }

  carrinho.forEach((produto, index) => {
    // Adiciona quantidade se não existir
    if (!produto.quantidade) produto.quantidade = 1;

    const subtotal = produto.preco * produto.quantidade;
    total += subtotal;

    const item = document.createElement("div");
    item.classList.add("item-carrinho");

    item.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="item-carrinho-info">
        <div class="item-carrinho-nome">${produto.nome}</div>
        <div class="item-carrinho-preco">Preço: R$ ${produto.preco.toFixed(2)}</div>
        <div>Subtotal: R$ ${subtotal.toFixed(2)}</div>
        <div>
          <button onclick="alterarQuantidade(${index}, -1)">−</button>
          <strong>${produto.quantidade}</strong>
          <button onclick="alterarQuantidade(${index}, 1)">+</button>
        </div>
        <button onclick="removerItem(${index})">🗑️ Remover</button>
      </div>
    `;

    container.appendChild(item);
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade < 1) carrinho[index].quantidade = 1;
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

renderizarCarrinho();


// ✅ ÚNICO event listener para finalizar o pedido
document.getElementById("finalizarPedido").addEventListener("click", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) {
    alert("⚠️ Você precisa estar logado para finalizar o pedido.");
    window.location.href = "login.html";
    return;
  }

  if (carrinho.length === 0) {
    alert("🛒 Seu carrinho está vazio.");
    return;
  }

  document.getElementById("modalPagamento").classList.remove("hidden");
});

function finalizarComPagamento(formaPagamento) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  let resumo = "Resumo do pedido:\n\n";
  carrinho.forEach((item, i) => {
    resumo += `${i + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
  });

  const total = carrinho.reduce((acc, p) => acc + p.preco, 0);
  resumo += `\nTotal: R$ ${total.toFixed(2)}\n`;
  resumo += `Cliente: ${usuario.nome}\n`;
  resumo += `Forma de Pagamento: ${formaPagamento}`;

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push({
    email: usuario.email,
    nome: usuario.nome,
    data: new Date().toLocaleString(),
    itens: [...carrinho],
    total,
    pagamento: formaPagamento
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert(`✅ Pedido finalizado com sucesso!\n\n${resumo}`);

  carrinho = [];
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();

  document.getElementById("modalPagamento").classList.add("hidden");
}

