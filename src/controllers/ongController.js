import ong from "../models/Ong.js";

// no geral foi dividido a chamada da api para atraves do controller criado utilizar somente as rotas necessaria
class ongController {
    //static usado para chamar de forma statica
    static async listaOngs (req, res){
    try {
        const listaongs = await ong.find({});
        res.status(200).json(listaongs);
        
    } catch (erro) {
        res.status(500).json({message: `${erro.message} - falha ao consultar ong`});
        
    }}

    static async listaOngPorId (req, res){
        try {
            const id = req.params.id;
            const ongEncontrado = await ong.findById(id);
            res.status(200).json(ongEncontrado);
            
        } catch (erro) {
            res.status(500).json({message: `${erro.message} - falha ao consultar ong por ID`});
            
        }};

    static async cadastrarOng(req, res){
        try {
            const novoong = await ong.create(req.body);
            res.status(201).json({message: "Criado com sucesso", ong: novoong});
        }catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar ong`});
        }

    };
    static async atualizaOng (req, res){
        try {
            const id = req.params.id;
            await ong.findByIdAndUpdate(id, req.body);
            res.status(200).json({message:  "ong Atualziado"});
            
        } catch (erro) {
            res.status(500).json({message: `${erro.message} - Falha ao atualizar ong`});
            
        }};

        static async excluiOng (req, res){
            try {
                const id = req.params.id;
                await ong.findByIdAndDelete(id);
                res.status(200).json({message: "ong excluido"});
                
            } catch (erro) {
                res.status(500).json({message: `${erro.message} - Falha ao excluir o ong`});
                
            }};

};

export default ongController;