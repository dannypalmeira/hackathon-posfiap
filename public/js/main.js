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
