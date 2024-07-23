import mongoose , {mongo} from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


async function conectaNaDatabase(){
    mongoose.connect(process.env.DB_CONNECTION_STRING);
    
    return mongoose.connection;
};



export default conectaNaDatabase;
// informações sendo usuario e passawrod

