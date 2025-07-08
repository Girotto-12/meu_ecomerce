document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioLogado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioLogado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        alert("✅ Login realizado com sucesso!");
        window.location.href = "index.html";
    } else {
        alert("❌ E-mail ou senha incorretos.");
    }
});
