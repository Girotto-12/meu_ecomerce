const user = JSON.parse(localStorage.getItem("usuarioLogado"));
const historicoEl = document.getElementById("historico");

if (!user) {
  alert("⚠️ Você precisa estar logado para ver seus pedidos.");
  window.location.href = "login.html";
}

const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Filtra só os pedidos do usuário logado
const pedidosDoUsuario = pedidos.filter(p => p.email === user.email);

if (pedidosDoUsuario.length === 0) {
  historicoEl.innerHTML = "<p>🛒 Você ainda não fez nenhum pedido.</p>";
} else {
  pedidosDoUsuario.forEach((pedido, index) => {
    const card = document.createElement("div");
    card.classList.add("produto");

    let produtosHtml = "";
    pedido.itens.forEach(item => {
      produtosHtml += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
    });

    card.innerHTML = `
      <h3>Pedido #${index + 1}</h3>
      <p><strong>Data:</strong> ${pedido.data}</p>
      <ul>${produtosHtml}</ul>
      <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
      <hr>
    `;

    historicoEl.appendChild(card);
  });
}
