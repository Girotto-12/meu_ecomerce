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
    const item = document.createElement("div");
    item.classList.add("produto");

    item.innerHTML = `
      <h3>${produto.nome}</h3>
      <p>Preço: R$ ${Number(produto.preco).toFixed(2)}</p>
      <button onclick="removerItem(${index})">Remover</button>
      <hr>
    `;

    container.appendChild(item);
    total += Number(produto.preco); // garante que é número
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
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

  let resumo = "Resumo do pedido:\n\n";
  carrinho.forEach((item, i) => {
    resumo += `${i + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
  });

  const total = carrinho.reduce((acc, p) => acc + p.preco, 0);
  resumo += `\nTotal: R$ ${total.toFixed(2)}\n`;
  resumo += `Cliente: ${usuario.nome}`;

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push({
    email: usuario.email,
    nome: usuario.nome,
    data: new Date().toLocaleString(),
    itens: [...carrinho],
    total
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert(`✅ Pedido finalizado com sucesso!\n\n${resumo}`);

  carrinho = [];
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
});
