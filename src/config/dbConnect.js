import mongoose , {mongo} from "mongoose";


async function conectaNaDatabase(){
    mongoose.connect("mongodb+srv://postechfiapgrupoo:6LeWd17MQsVOX8Dd@cluster0.ww3kh9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
    return mongoose.connection;
};



export default conectaNaDatabase;
// informações sendo usuario e passawrod

