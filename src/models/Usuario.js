import mongoose, { mongo } from "mongoose";

const usuarioSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    nome: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
}, {versionKey:false});

const usuario = mongoose.model("usuarios", usuarioSchema);

// exportando os dois para poder referenciar nas ongs somente se necessario
export {usuario, usuarioSchema};