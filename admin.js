const adminEmail = "girotto@admin.com"; // coloque aqui seu e-mail

const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
const divPedidos = document.getElementById("pedidos-admin");

if (!usuario || usuario.email !== adminEmail) {
  alert("⛔ Acesso restrito ao administrador.");
  window.location.href = "index.html";
} else {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (pedidos.length === 0) {
    divPedidos.innerHTML = "<p>📭 Nenhum pedido realizado ainda.</p>";
  } else {
    pedidos.reverse().forEach(pedido => {
      const bloco = document.createElement("div");
      bloco.classList.add("pedido-admin");

      let html = `
        <h3>Cliente: ${pedido.nome} (${pedido.email})</h3>
        <p>Data: ${pedido.data}</p>
        <ul>
      `;

      pedido.itens.forEach(item => {
        html += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
      });

      html += `</ul><strong>Total: R$ ${pedido.total.toFixed(2)}</strong><hr>`;
      bloco.innerHTML = html;
      divPedidos.appendChild(bloco);
    });
  }
}
