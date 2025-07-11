const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
const lista = document.getElementById("lista-pedidos");

if (!usuario) {
  alert("⚠️ Você precisa estar logado para ver o histórico.");
  window.location.href = "login.html";
} else {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const pedidosUsuario = pedidos.filter(p => p.email === usuario.email);

  if (pedidosUsuario.length === 0) {
    lista.innerHTML = "<p>📭 Você ainda não fez nenhum pedido.</p>";
  } else {
    pedidosUsuario.reverse().forEach(pedido => {
      const div = document.createElement("div");
      div.classList.add("pedido");
      let html = `<h3>Pedido em ${pedido.data}</h3><ul>`;
      pedido.itens.forEach(item => {
        html += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
      });
      html += `</ul><strong>Total: R$ ${pedido.total.toFixed(2)}</strong><hr>`;
      div.innerHTML = html;
      lista.appendChild(div);
    });
  }
}
