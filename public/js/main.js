function irParaPagina(rota) {
  window.location.href = rota;
}
function verificaLogado() {
  const id = sessionStorage.getItem("id");
  const nome = sessionStorage.getItem("nome");
  const tipo = sessionStorage.getItem("tipo");
  if (!id || !tipo || !nome) {
    sessionStorage.clear();

    irParaPagina("/login");
  }
}

async function EfetuaLogin(e) {
  e.preventDefault();

  const form = document.getElementById("form");
  const formData = new FormData(form);

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });

    const data = await response.json();

    if (data.err) {
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = data.err;
      divErro.style.display = "flex";
      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
      }, 2000);
      return;
    }

    sessionStorage.setItem("nome", data.nome);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("id", data.id);
    sessionStorage.setItem("tipo", data.tipo);
    irParaPagina("/ongs");
  } catch (ex) {}
}

async function cadastraUser(e) {
  e.preventDefault();
  const form = document.getElementById("form");

  if (form.senha.value !== form.confirmSenha.value) {
    const divErro = document.querySelector(".divErro");
    divErro.innerHTML = "As senhas nao coincidem.";
    divErro.style.display = "flex";
    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2000);

    return;
  }

  if (!validaSenhaForte(form.senha.value)) {
    const divErro = document.querySelector(".divErro");
    divErro.innerHTML =
      "As senhas precisam tem caracteres especiais, 5 caracteres, número, letra maiuscula e minuscula";
    divErro.style.display = "flex";
    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2000);
    return;
  }

  if (!document.querySelector('input[name="tipo"]:checked')) {
    const divErro = document.querySelector(".divErro");
    divErro.innerHTML =
      "As senhas precisam tem caracteres especiais, 5 caracteres, número, letra maiuscula e minuscula";
    divErro.style.display = "flex";
    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2000);
    return; // Impede o envio do formulário
  }
  const formData = new FormData(form);
  try {
    const response = await fetch("/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData).toString(),
    });
    const data = await response.json();
    if (data.err) {
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = data.err;
      divErro.style.display = "flex";
      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
      }, 2000);
      return;
    } else {
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = "Usuário cadastrado!";
      divErro.style.background = "green";
      divErro.style.display = "flex";

      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";

        irParaPagina("/login");
      }, 2000);
    }
  } catch {}
}

function validaSenhaForte(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password.length >= 5 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialCharacters
  ) {
    return true;
  }
  return false;
}

function limpaStorage() {
  sessionStorage.clear();
}

async function redefineSenha(e) {
  e.preventDefault();

  const form = document.getElementById("form");
  const formData = new FormData(form);

  try {
    const res = await fetch("/redefineSenha", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData).toString(),
    });

    const data = await res.json();
    if (data.err) {
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = data.err;
      divErro.style.display = "flex";
      setTimeout(() => {
        (divErro.innerHTML = ""), (divErro.style.display = "none");
      }, 2500);
    }
    const divErro = document.querySelector(".divErro");
    divErro.innerHTML = "Email enviado!";
    divErro.style.background = "green";
    divErro.style.display = "flex";

    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
      irParaPagina("/login");
    }, 2000);

    return;
  } catch (ex) {
    const divErro = document.querySelector(".divErro");
    divErro.innerHTML = "Não foi possível enviar email";
    divErro.style.display = "flex";

    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2000);
    return;
  }
}

//cadastro ONG

let ongIdToDelete = null;
function confirmDelete(id) {
  ongIdToDelete = id;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

function deleteOng() {
  if (!ongIdToDelete) return;

  const url = `/ongs/${ongIdToDelete}`;
  console.log(`Fazendo a solicitação DELETE para: ${url}`);

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro ao excluir a ONG");
      }
    })
    .then((data) => {
      console.log("Redirecionando para /ongs");
      window.location.href = "/ongs";
    })
    .catch((error) => {
      console.error("Erro na exclusão:", error);
    });
}

async function alteraSenha(e) {
  e.preventDefault();
  const form = document.getElementById("form");
  const divErro = document.querySelector(".divErro");
  if (form.senha.value !== form.confirmSenha.value) {
    divErro.innerHTML = "As senhas nao coincidem.";
    divErro.style.display = "flex";

    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2500);
  }

  if (!validaSenhaForte(form.senha.value)) {
    divErro.innerHTML =
      "As senhas precisam tem caracteres especiais, 5 caracteres, número, letra maiuscula e minuscula";
    divErro.style.display = "flex";
    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
    }, 2000);
  }

  const pathParts = window.location.pathname.split("/");
  let token = pathParts[pathParts.length - 1];

  if (!token || token == "alteraSenha") {
    token = sessionStorage.getItem("token");
  }

  const formData = new FormData(form);
  try {
    const response = await fetch("/alteraSenha", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams(formData),
    });
    if (response.status === 401) {
      divErro.innerHTML = "Não Autorizado";
      divErro.style.display = "flex";
      sessionStorage.clear();
      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
        irParaPagina("/login");
        return;
      }, 2300);
    }
    const data = await response.json();
    if (data.err) {
      divErro.innerHTML = data.err;
      divErro.style.display = "flex";
      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
        return;
      }, 2300);
      return;
    }
    divErro.innerHTML = "Senha alterada";
    divErro.style.background = "green";
    divErro.style.display = "flex";
    setTimeout(() => {
      divErro.innerHTML = "";
      divErro.style.display = "none";
      limpaStorage();
      irParaPagina("/login");
    }, 2500);
  } catch (ex) {}
}
