import express from "express";
import conectaNaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";
import expressLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("layout", "./layout/main.ejs");
app.set("views", "./views");

routes(app);

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
  console.error("Erro de conexão", erro);
});

conexao.once("open", () => {
  console.log("conexão feita com sucesso");
});

export default app;
