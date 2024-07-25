import {Router} from "express";
const router = Router();

router.get("/", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Pagina inicial do Hackaton",
  };
  res.render("home", locals);
});

router.get("/redefineSenha", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Pagina de redefinição de senha",
  };
  res.render("redefineSenha", locals);
});

router.get("/login", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Página de login",
  };
  res.render("login", locals);
});

router.get("/cadastro", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Página de cadastro",
  };
  res.render("cadastro", {locals, erro: null});
});

router.get("/alteraSenha/:token?", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Página de alteração de senha",
  };
  res.render("alteraSenha", {locals, erro: null});
});
export default router;


router.get('/ongs', (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Página ONGs",
  };
  res.render('ongs', {
    user: req.session.user, 
    isAdmin: req.session.user && req.session.user.tipo === "Adm",
    ongs: ongs
  });
});