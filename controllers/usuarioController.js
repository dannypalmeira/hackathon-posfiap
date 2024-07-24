import {usuario} from "../models/Usuario.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// no geral foi dividido a chamada da api para atraves do controller criado utilizar somente as rotas necessaria
class usuarioController {
  static async listaUsuarios(req, res) {
    try {
      const listaUsuarios = await usuario.find({});
      res.status(200).json(listaUsuarios);
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - falha ao consultar usuario`});
    }
  }

  static async listaUsuarioPorId(req, res) {
    try {
      const id = req.params.id;
      const usuarioEncontrado = await usuario.findById(id);
      res.status(200).json(usuarioEncontrado);
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - falha ao consultar usuario por ID`});
    }
  }

  static async cadastrarUsuario(req, res) {
    try {
      const {nome, email, senha, tipo} = req.body;
      if (!nome || !email || !senha || !tipo) {
        return res.render("cadastro", {
          err: "Por favor, preencha todos os campos.",
        });
      }
      const newSenha = bcrypt.hashSync(senha, 5);
      const novousuario = await usuario.create({
        nome,
        email,
        senha: newSenha,
        tipo: tipo,
      });
      if (!("_id" in novousuario)) {
        return res.render("cadastro", {
          err: "Erro ao criar usuario.",
        });
      }
      return res.status(201).json({message: `Usuario ${nome} cadastrado`});
    } catch (erro) {
      return res
        .status(500)
        .json({message: `${erro.message} - falha ao cadastrar usuario`});
    }
  }
  static async atualizaUsuario(req, res) {
    try {
      const id = req.params.id;
      await usuario.findByIdAndUpdate(id, req.body);
      res.status(200).json({message: "usuario Atualziado"});
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - Falha ao atualizar usuario`});
    }
  }

  static async excluiUsuario(req, res) {
    try {
      const id = req.params.id;
      await usuario.findByIdAndDelete(id);
      res.status(200).json({message: "usuario excluido"});
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - Falha ao excluir o usuario`});
    }
  }

  static async redefineSenha(req, res) {
    const {email} = req.body;
    console.log("controller");
    if (!email) {
      return res.status(500).send({err: "Por favor, preencha o email"});
    }

    const token = jwt.sign({id: email}, process.env.TOKEN, {expiresIn: 600});
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Redefinição de senha",
      html: `<h3><a href="http://localhost:3000/alteraSenha/token=${token}">Clique aqui</a> para redefinir sua senha.</h3>`,
    };
    const transporter = await transporterEmail();
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send({err: "Não foi possível enviar email."});
      }
      transporter.close();
    });
    transporter.close();
    return res.status(200).send({message: "Email enviado"});
  }
}

async function transporterEmail() {
  console.log(process.env.HOST_EMAIL, process.env.EMAIL, process.env.SENHA);
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.SENHA,
    },
  });

  return transporter;
}

export default usuarioController;
