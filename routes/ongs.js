import express from "express";
import ongController from "../controllers/ongController.js";

const routes = express.Router();

routes.get("/ongs",ongController.listarOngs);
routes.get("/ongs/:id",ongController.listaOngPorId);
routes.post("/ongs",ongController.cadastrarOng);
routes.put("/ongs/:id",ongController.atualizaOng);
routes.delete("/ongs/:id",ongController.excluiOng);
routes.get("/ongs/buscarOng", ongController.pesquisaOngs);
routes.post("/ongs/buscarOng", ongController.pesquisaOngsSubmit); 

// usar o nome da funcao criada e exportar
export default routes;