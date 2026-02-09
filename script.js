import { supabase } from "./supabaseClient.js";

const lista = document.querySelector(".lista-produtos");

function money(cents, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format((Number(cents || 0)) / 100);
}

async function getSessionOrRedirect() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const session = data?.session;
  if (!session) {
    alert("Faça login para continuar.");
    window.location.href = "login.html";
    return null;
  }
  return session;
}

async function getOrCreateDraftOrder(user_id) {
  const { data: existing, error: selErr } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user_id)
    .eq("status", "draft")
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing?.id) return existing.id;

  const { data: created, error: insErr } = await supabase
    .from("orders")
    .insert([{ user_id, status: "draft" }])
    .select("id")
    .single();

  if (insErr) throw insErr;
  return created.id;
}

async function addToCart(product_id) {
  const session = await getSessionOrRedirect();
  if (!session) return;

  const user_id = session.user.id;

  // 1) pega preço do produto
  const { data: product, error: pErr } = await supabase
    .from("products")
    .select("id, price_cents")
    .eq("id", product_id)
    .single();

  if (pErr) throw pErr;

  // 2) pega/cria order draft
  const order_id = await getOrCreateDraftOrder(user_id);

  // 3) tenta achar item existente
  const { data: existingItem, error: selItemErr } = await supabase
    .from("order_items")
    .select("id, qty")
    .eq("order_id", order_id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (selItemErr) throw selItemErr;

  if (existingItem?.id) {
    // 4a) incrementa qty
    const { error: updErr } = await supabase
      .from("order_items")
      .update({ qty: Number(existingItem.qty) + 1 })
      .eq("id", existingItem.id);

    if (updErr) throw updErr;
  } else {
    // 4b) insere novo item
    const { error: insErr } = await supabase
      .from("order_items")
      .insert([{
        order_id,
        product_id: product.id,
        qty: 1,
        unit_price_cents: product.price_cents
      }]);

    if (insErr) throw insErr;
  }

  alert("Adicionado ao carrinho ✅");
}

async function carregarProdutos() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price_cents, currency, image_url")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);
    lista.innerHTML = `<p>Erro ao carregar produtos.</p>`;
    return;
  }

  lista.innerHTML = (data || []).map(p => `
    <div class="produto-card">
      <img src="${p.image_url || ""}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description || ""}</p>
      <strong>${money(p.price_cents, p.currency || "USD")}</strong>
      <button data-add="${p.id}">Adicionar ao carrinho</button>
    </div>
  `).join("");

  // evita duplicar listener se recarregar a lista
  lista.onclick = async (e) => {
    const btn = e.target.closest("button[data-add]");
    if (!btn) return;

    try {
      await addToCart(btn.dataset.add);
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar ao carrinho.");
    }
  };
}

carregarProdutos();


