import ong from "../models/Ong.js";

// no geral foi dividido a chamada da api para atraves do controller criado utilizar somente as rotas necessaria
class ongController {
  static formularioCadastro(req, res) {
    const locals = {
      title: "Cadastrar ONG",
      description: "Página de Cadastro ONG",
    };
    res.render("cadastroOng", locals);
  }

  static async cadastrarOng(req, res) {
    //console.log("Dados recebidos:", req.body);
    const novaOng = new ong(req.body);
    try {
      await novaOng.save();
      res.status(201).json({ message: "Criado com sucesso", ong: novaOng });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `${erro.message} - falha ao cadastrar ong` });
    }
  }

  static async listarOngs(req, res) {
    let perPage = 4;
    let page = req.query.page || 1;

    const locals = {
      title: "Lista de ONGs",
      description: "Veja a lista das ONGs disponíveis",
    };

    try {
      const listaongs = await ong.aggregate([
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            nome_org: { $substr: ["$nome_org", 0, 30] },
            descricao: { $substr: ["$descricao", 0, 300] },
            logo: { $substr: ["$logo", 0, 2000] },
            area: { $substr: ["$area", 0, 100] },
            contato: { $substr: ["$contato", 0, 9] },
          },
        }
      ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

      const count = await ong.countDocuments();

      res.render("ongs/paginaOngs", {
        locals,
        ongs: listaongs,
        layout: "../views/layout/main",
        current: page,
        pages: Math.ceil(count / perPage)
      });

    } catch (error) {
      console.log(error);
      res.status(500).send("Erro interno do servidor.");
    }
  };

  static async listaOngPorId(req, res) {
    try {
      const ongEncontrado = await ong.findById(req.params.id);
      //console.log(ongEncontrado);
      if (ongEncontrado) {
        res.render("ongs/detalhesOng", {
          layout: "../views/layout/main",
          title: ongEncontrado.nome_org,
          description: ongEncontrado.descricao,
          ong: ongEncontrado,
        });
      } else {
        res.status(404).send("ONG não encontrada.");
      }
    } catch (erro) {
      res.status(500).send("Erro ao consultar ONG: " + erro.message);
    }
  }

  static async listaOngPorNome(req, res) {
    try {
      const nome = decodeURIComponent(req.params.nome);
      const ongEncontrado = await ong.findOne({ nome_org: nome });
      //console.log(ongEncontrado);
      if (ongEncontrado) {
        res.render("ongs/detalhesOng", {
          layout: "../views/layout/main",
          title: ongEncontrado.nome_org,
          description: ongEncontrado.descricao,
          ong: ongEncontrado,
        });
      } else {
        res.status(404).send("ONG não encontrada.");
      }
    } catch (erro) {
      res.status(500).send("Erro ao consultar ONG: " + erro.message);
    }
  }

  static async atualizaOng(req, res) {
    try {
      const id = req.params.id;
      const updatedOng = await ong.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedOng) {
        return res.status(404).json({ message: "ONG não encontrada" });
      }
      res.status(200).json({ message: "ONG Atualizada", ong: updatedOng });
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Falha ao atualizar ONG` });
    }
  }

  static async excluiOng(req, res) {
    try {
      await ong.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "ong excluido" });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `${erro.message} - Falha ao excluir o ong` });
    }
  }

  static async pesquisaOngs(req, res) {
    try {
      res.render("ongs/buscarOng", {
        searchResults: [],
        layout: "../views/layout/main",
        title: "Pesquisar ONGs",
        description: "Busque ONGs por nome ou descrição.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro interno do servidor.");
    }
  }

  static async pesquisaOngsSubmit(req, res) {
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

      const searchResults = await ong.find({
        $or: [
          { nome_org: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { descricao: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      });

      res.render("ongs/buscarOng", {
        searchResults,
        layout: "../views/layout/main",
        title: "Resultados da Pesquisa",
        description: "Veja os resultados da sua pesquisa.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro interno do servidor.");
    }
  }
}

export default ongController;
