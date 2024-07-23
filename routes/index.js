import express from "express";
import usuario from "./usuarios.js";
import ong from "./ongs.js";
import views from "./views.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/", usuario);
  app.use("/", ong);
  app.use("/", views);
};

export default routes;
