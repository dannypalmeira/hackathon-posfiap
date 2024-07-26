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
      console.log(usuarioEncontrado);

      if (!usuarioEncontrado) {
        return res.status(404).json({message: "Usuário não encontrado"});
      }

      res.status(200).json(usuarioEncontrado);
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - falha ao consultar usuário por ID`});
    }
  }

  static async login(req, res) {
    const {email, senha} = req.body;

    if (!email || !senha) {
      return res.status(500).json({err: "Preencha todos os campos"});
    }
    try {
      const user = await usuario.findOne({email: email});

      if (!user) {
        return res.status(500).json({err: "Email ou senha invalido."});
      }
      const senhaValida = bcrypt.compareSync(senha, user.senha);

      if (!senhaValida) {
        return res.status(500).json({err: "Email ou senha invalido."});
      }
      let id = {
        nome: user.nome,
        email: user.email,
        logado: true,
        tipo: user.tipo,
        id: user._id.toString(),
      };

      const token = jwt.sign(id, process.env.TOKEN);
      return res.status(200).json({
        token: token,
        id: user._id.toString(),
        nome: user.nome,
        tipo: user.tipo,
        email: user.email,
      });
    } catch (ex) {
      return res.status(500).json({err: "Não foi possível efetuar o login"});
    }
  }

  static async cadastrarUsuario(req, res) {
    try {
      const {nome, email, senha, tipo} = req.body;
      if (!nome || !email || !senha || !tipo) {
        return res.status(500).json({err: "Preencha todos os campos."});
      }

      const existe = await usuario.findOne({email: email});
      if (existe) {
        return res
          .status(500)
          .json({err: "Já existe um usuário com este email"});
      }

      const newSenha = bcrypt.hashSync(senha, 5);
      const novousuario = await usuario.create({
        nome,
        email,
        senha: newSenha,
        tipo: tipo,
      });
      if (!("_id" in novousuario)) {
        return res.status(500).json({
          err: "Erro ao criar usuario.",
        });
      }
      return res.status(201).json({message: `Usuario ${nome} cadastrado`});
    } catch (erro) {
      return res
        .status(500)
        .json({err: `${erro.message} - falha ao cadastrar usuario`});
    }
  }

  static async atualizaUsuario(req, res) {
    try {
      const id = req.params.id;
      const usuarioEncontrado = await usuario.findById(id);
      if (!usuarioEncontrado) {
        return res.status(404).json({message: "Usuário não encontrado"});
      }
      const usuarioAtualizado = await usuario.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(usuarioAtualizado);
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - Falha ao atualizar usuario`});
    }
  }

  static async renderizaPaginaEdicaoUsuario(req, res) {
    try {
      const id = req.params.id;
      const usuarioEncontrado = await usuario.findById(id);

      if (usuarioEncontrado) {
        res.render("usuarios/perfil", {
          layout: "../views/layout/main",
          title: "Editar Usuário",
          usuario: usuarioEncontrado,
        });
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (erro) {
      res
        .status(500)
        .send(
          "Erro ao carregar a página de edição do usuário: " + erro.message
        );
    }
  }

  static async excluiUsuario(req, res) {
    try {
      const id = req.params.id;
      await usuario.findByIdAndDelete(id);
      res.status(204).json({message: "usuario excluido"});
    } catch (erro) {
      res
        .status(500)
        .json({message: `${erro.message} - Falha ao excluir o usuario`});
    }
  }

  static async redefineSenha(req, res) {
    const {email} = req.body;
    if (!email) {
      return res.status(500).json({err: "Por favor, preencha o email"});
    }

    const token = jwt.sign({id: email}, process.env.TOKEN, {expiresIn: 600});
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Redefinição de senha",
      html: `<h3><a href="http://localhost:3000/alteraSenha/${token}">Clique aqui</a> para redefinir sua senha.</h3>`,
    };
    const transporter = await transporterEmail();
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        return res.status(500).json({err: "Não foi possível enviar email."});
      }
      transporter.close();
    });
    transporter.close();
    return res.status(200).json({message: "Email enviado"});
  }

  static async alteraSenha(req, res) {
    const {email, senha, confirmSenha} = req.body;
    if (!email || !senha || !confirmSenha) {
      return res.status(500).json({err: "preencha todos os campos."});
    }

    const newSenha = bcrypt.hashSync(senha, 5);

    const user = await usuario.findOneAndUpdate(
      {email: email},
      {senha: newSenha},
      {
        new: true,
      }
    );

    return res.status(200).json({message: "Senha alterada"});
  }
}

async function transporterEmail() {
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
