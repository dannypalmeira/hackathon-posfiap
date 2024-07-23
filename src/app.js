import express from "express";
import conectaNaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

const app = express();
routes(app);
const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro)
});

conexao.once("open", () => {
    console.log("conexão feita com sucesso")
});


export default app;

