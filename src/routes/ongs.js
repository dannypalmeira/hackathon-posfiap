import express from "express";
import ongController from "../controllers/ongController.js";

const routes = express.Router();

routes.get("/ongs",ongController.listaOngs);
routes.get("/ongs/:id",ongController.listaOngPorId);
routes.post("/ongs",ongController.cadastrarOng);
routes.put("/ongs/:id",ongController.atualizaOng);
routes.delete("/ongs/:id",ongController.excluiOng);

// usar o nome da funcao criada e exportar
export default routes;