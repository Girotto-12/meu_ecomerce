document.getElementById("cadastroForm").addEventListener("submit", function (e) {e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // recupera usuarios existentes
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // verifica se email ja esta cadastrado
    const existe = usuarios.find(usuario => usuario.email === email);
    if (existe) {
        alert("❌ Este e-mail já está cadastrado.");
        return;
    }

    // Adiciona novo usuario
    usuarios.push({ nome, email, senha});
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Cadastro realizado com sucesso!");
    window.location.href = "login.html";
});