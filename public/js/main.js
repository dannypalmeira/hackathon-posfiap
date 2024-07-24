function irParaPagina(rota) {
  window.location.href = rota;
}
function verificaLogado() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    sessionStorage.clear();
    irParaPagina("/login");
  }
}

async function cadastraUser(e) {
  e.preventDefault();
  console.log("oiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
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
    console.log("response", response);
    if (!response.ok) {
      const responseData = await response.json();
      const errMsg = responseData.err;
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = errMsg;
      divErro.style.display = "flex";

      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
      }, 2000);
    } else {
      const divErro = document.querySelector(".divErro");
      divErro.innerHTML = "Usuário cadastrado!";
      divErro.style.background = "green";
      divErro.style.display = "flex";

      setTimeout(() => {
        divErro.innerHTML = "";
        divErro.style.display = "none";
      }, 2000);
    }

    irParaPagina("/login");
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

    console.log("response", res);
    return;
  } catch (ex) {
    console.log("ex", ex);
    return;
  }
}
