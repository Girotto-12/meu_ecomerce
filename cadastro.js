import { supabase } from "./supabaseClient.js";

document.querySelector("#btnCadastrar").addEventListener("click", async (e) => {
  e.preventDefault();

  const full_name = document.querySelector("#full_name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  if (error) {
    alert("Erro no cadastro: " + error.message);
    console.error(error);
    return;
  }

  alert("Conta criada. Agora faça login.");
  window.location.href = "login.html";
});

