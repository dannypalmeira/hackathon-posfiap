import express from "express";
import usuario from "./usuarios.js";
import ong from "./ongs.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send
    ("Curso de Node.js")
);
    app.use(express.json(), usuario , ong);

};

export default routes;