import {usuario} from "../models/Usuario.js";

// no geral foi dividido a chamada da api para atraves do controller criado utilizar somente as rotas necessaria
class usuarioController {
    //static usado para chamar de forma statica
    static async listaUsuarios (req, res){
    try {
        const listaUsuarios = await usuario.find({});
        res.status(200).json(listaUsuarios);
        
    } catch (erro) {
        res.status(500).json({message: `${erro.message} - falha ao consultar usuario`});
        
    }}

    static async listaUsuarioPorId (req, res){
        try {
            const id = req.params.id;
            const usuarioEncontrado = await usuario.findById(id);
            res.status(200).json(usuarioEncontrado);
            
        } catch (erro) {
            res.status(500).json({message: `${erro.message} - falha ao consultar usuario por ID`});
            
        }};

    static async cadastrarUsuario(req, res){
        try {
            const novousuario = await usuario.create(req.body);
            res.status(201).json({message: "Criado com sucesso", usuario: novousuario});
        }catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar usuario`});
        }

    };
    static async atualizaUsuario (req, res){
        try {
            const id = req.params.id;
            await usuario.findByIdAndUpdate(id, req.body);
            res.status(200).json({message:  "usuario Atualziado"});
            
        } catch (erro) {
            res.status(500).json({message: `${erro.message} - Falha ao atualizar usuario`});
            
        }};

        static async excluiUsuario (req, res){
            try {
                const id = req.params.id;
                await usuario.findByIdAndDelete(id);
                res.status(200).json({message: "usuario excluido"});
                
            } catch (erro) {
                res.status(500).json({message: `${erro.message} - Falha ao excluir o usuario`});
                
            }};

};

export default usuarioController;