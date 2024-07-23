import {Router} from "express";
const router = Router();

router.get("/", (req, res) => {
  const locals = {
    title: "HACKA | GRUPO O",
    description: "Pagina inicial do Hackaton",
  };
  res.render("home", locals);
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

export default router;
