import { supabase } from "./supabaseClient.js";

console.log("carrinho.js carregou ✅");

document.addEventListener("DOMContentLoaded", async () => {
  const listaEl = document.getElementById("itens-carrinho");
  const totalEl = document.getElementById("total");
  const btnFinalizar = document.getElementById("finalizarPedido");

  const modal = document.getElementById("modalPagamento");
  const btnCartao = document.getElementById("btnCartao");
  const btnPix = document.getElementById("btnPix");
  const btnDinheiro = document.getElementById("btnDinheiro");

  if (!listaEl || !totalEl || !btnFinalizar) {
    console.error("❌ IDs do carrinho não encontrados. Verifique: itens-carrinho, total, finalizarPedido");
    return;
  }

  // 1) Sessão
  const { data: sessData, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) console.error(sessErr);

  const session = sessData?.session;
  if (!session) {
    alert("Faça login primeiro.");
    window.location.href = "login.html";
    return;
  }

  const userId = session.user.id;

  // 2) Buscar ou criar o draft order do usuário
  async function getOrCreateDraftOrder() {
    const { data: existing, error } = await supabase
      .from("orders")
      .select("id, subtotal_cents, shipping_cents, tax_cents, total_cents, status")
      .eq("user_id", userId)
      .eq("status", "draft")
      .maybeSingle();

    if (error) throw error;

    if (existing) return existing;

    const { data: created, error: createErr } = await supabase
      .from("orders")
      .insert([{ user_id: userId, status: "draft" }])
      .select("id, subtotal_cents, shipping_cents, tax_cents, total_cents, status")
      .single();

    if (createErr) throw createErr;

    return created;
  }

  // 3) Buscar itens do draft order (com join em products)
  async function fetchOrderItems(orderId) {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        id,
        qty,
        unit_price_cents,
        line_total_cents,
        product:products (
          id,
          name,
          image_url
        )
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  // 4) Remover item
  async function removeItem(itemId) {
    const { error } = await supabase
      .from("order_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  }

  // 5) Render
  let draftOrder = null;
  let items = [];

  function formatBRLFromCents(cents) {
    const v = (Number(cents ?? 0) / 100).toFixed(2);
    return v.replace(".", ",");
  }

  function render() {
    if (!items.length) {
      listaEl.innerHTML = "<p>Seu carrinho está vazio.</p>";
      totalEl.textContent = "Total: R$ 0,00";
      return;
    }

    listaEl.innerHTML = items.map((it) => {
      const nome = it.product?.name ?? "Produto";
      const imagem = it.product?.image_url ?? "https://via.placeholder.com/60";
      const qtd = Number(it.qty ?? 1);
      const preco = formatBRLFromCents(it.unit_price_cents);
      const totalLinha = formatBRLFromCents(it.line_total_cents);

      return `
        <div style="display:flex; gap:12px; align-items:center; padding:10px; border-bottom:1px solid #ddd;">
          <img src="${imagem}" alt="${nome}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
          <div style="flex:1;">
            <div><strong>${nome}</strong></div>
            <div>Preço: R$ ${preco}</div>
            <div>Qtd: ${qtd}</div>
            <div><strong>Subtotal:</strong> R$ ${totalLinha}</div>
          </div>
          <button class="btn-remover" data-id="${it.id}">Remover</button>
        </div>
      `;
    }).join("");

    // Preferência: usar total do banco (orders.total_cents) se existir
    const totalCents = Number(draftOrder?.total_cents ?? 0);
    totalEl.textContent = `Total: R$ ${formatBRLFromCents(totalCents)}`;
  }

  // 6) Recarregar tudo do banco
  async function refresh() {
    draftOrder = await getOrCreateDraftOrder();
    items = await fetchOrderItems(draftOrder.id);

    // Se seu trigger de totals estiver OK, o total vem pronto no orders.
    // Se ainda estiver 0, podemos recalcular pelo client (fallback):
    if (!draftOrder.total_cents || draftOrder.total_cents === 0) {
      const sum = items.reduce((acc, it) => acc + Number(it.line_total_cents ?? 0), 0);
      totalEl.textContent = `Total: R$ ${formatBRLFromCents(sum)}`;
    }

    render();
  }

  // Remover via clique
  listaEl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-remover");
    if (!btn) return;

    try {
      await removeItem(btn.dataset.id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover item.");
    }
  });

  // Modal pagamento (abrir)
  btnFinalizar.addEventListener("click", () => {
    if (!items.length) {
      alert("Seu carrinho está vazio.");
      return;
    }
    if (!modal) {
      alert("Modal de pagamento não encontrado (modalPagamento).");
      return;
    }
    modal.classList.remove("hidden");
  });

  // Finalizar pedido: muda status para "submitted" e salva notes
  async function finalizarComPagamento(metodo) {
    try {
      modal?.classList.add("hidden");

      const { error } = await supabase
        .from("orders")
        .update({ status: "submitted", notes: `Pagamento: ${metodo}` })
        .eq("id", draftOrder.id);

      if (error) throw error;

      alert(`Pedido finalizado com pagamento: ${metodo} ✅`);

      // cria novo draft automaticamente na próxima visita
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar pedido.");
    }
  }

  btnCartao?.addEventListener("click", () => finalizarComPagamento("Cartão"));
  btnPix?.addEventListener("click", () => finalizarComPagamento("Pix"));
  btnDinheiro?.addEventListener("click", () => finalizarComPagamento("Dinheiro"));

  // Start
  await refresh();
});


