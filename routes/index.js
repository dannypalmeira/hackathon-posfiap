import express from "express";
import usuario from "./usuarios.js";
import ong from "./ongs.js";
import views from "./views.js";

const routes = (app) => {
  app.use(express.json());
  
  app.use((req, res, next) => {
    if (req.session && req.session.user) {
      res.locals.user = req.session.user;
      res.locals.isAdmin = req.session.user.tipo === "Adm";
    } else {
      res.locals.user = null;
      res.locals.isAdmin = false;
    }
    next();
  });
  
  app.use("/", usuario);
  app.use("/", ong);
  app.use("/", views);
};

export default routes;
