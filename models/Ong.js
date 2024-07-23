import mongoose, { mongo } from "mongoose";


const ongSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    nome_org: {type: String, required: true},
    descricao: {type: String},
    area: {type: String},
    contato: {type: Number, required: true },
    logo: {type: String},
    //exemplo de ref usuario: usuarioSchema
}, {versionKey:false});

const ong = mongoose.model("ongs", ongSchema);

export default ong;