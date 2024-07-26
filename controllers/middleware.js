import jwt from "jsonwebtoken";
import {usuario} from "../models/Usuario.js";
import dotenv from "dotenv";
dotenv.config();
export async function verificaLogado(req, res, next) {
  try {
    const {authorization} = req.headers;
    if (!authorization) {
      return res.redirect("/login");
    }
    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if (parts.length !== 2) {
      return res.status(401).json({err: "Não autorizado"});
    }
    if (schema !== "Bearer") {
      return res.status(401).json({err: "Não autorizado"});
    }
    jwt.verify(token, process.env.TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({err: "Não autorizado"});
      }
      const user = await usuario.findById(decoded.id);
      if (!user || !user._id) {
        return res.status(401).json({err: "Não autorizado"});
      }
      req.userId = user.id;
      return next();
    });
  } catch (err) {
    return res.status(500).send({message: err});
  }
}
