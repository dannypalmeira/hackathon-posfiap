import ong from "../models/Ong.js";

// no geral foi dividido a chamada da api para atraves do controller criado utilizar somente as rotas necessaria
class ongController {

    static async listarOngs(req, res) {
        try {
            const listaongs = await ong.find({});
            res.render("ongs/paginaOngs", {
                layout: "../views/layout/main",
                title: "Lista de ONGs",
                description: "Veja a lista das ONGs disponíveis.",
                ongs: listaongs
            });
        } catch (erro) {
            res.status(500).send("Erro ao listar ONGs: " + erro.message);
        }
    }

    static async listaOngPorId(req, res) {
        try {
            const ongEncontrado = await ong.findById(req.params.id);
            console.log(ongEncontrado);
            if (ongEncontrado) {
                res.render("ongs/detalhesOng", {
                    layout: "../views/layout/main",
                    title: ongEncontrado.nome_org,
                    description: ongEncontrado.descricao,
                    ong: ongEncontrado
                });
            } else {
                res.status(404).send("ONG não encontrada.");
            }
        } catch (erro) {
            res.status(500).send("Erro ao consultar ONG: " + erro.message);
        }
    }

    static async cadastrarOng(req, res) {
        try {
            const novoong = await ong.create(req.body);
            res.status(201).json({ message: "Criado com sucesso", ong: novoong });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao cadastrar ong` });
        }

    };
    static async atualizaOng(req, res) {
        try {
            const id = req.params.id;
            await ong.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "ong Atualziado" });

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao atualizar ong` });

        }
    };

    static async excluiOng(req, res) {
        try {
            const id = req.params.id;
            await ong.findByIdAndDelete(id);
            res.status(200).json({ message: "ong excluido" });

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha ao excluir o ong` });

        }
    };

    static async renderizarListaOngs(req, res) {
        try {
            const listaongs = await ong.find({});
            res.render("ongs/paginaOngs", {
                layout: "./layout/main.ejs",
                title: "Lista de ONGs",
                description: "Veja a lista das ONGs disponíveis.",
                ongs: listaongs
            });
        } catch (erro) {
            res.status(500).send("Erro ao listar ONGs: " + erro.message);
        }
    };

};

export default ongController;