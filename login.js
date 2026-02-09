import { supabase } from "./supabaseClient.js";

document.querySelector("#btnLogin").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Erro no login: " + error.message);
    console.error(error);
    return;
  }

  window.location.href = "index.html";
});


