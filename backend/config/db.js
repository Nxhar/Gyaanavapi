const mongoose =require("mongoose");

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(
            "mongodb+srv://nihar:nihar@cluster0.rf4r1.mongodb.net/",{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                
            }
        );

        console.log(`MongoDB connected: ${conn.connection.host}`)}
        catch (error){
            console.log(`Error: ${error.message}`);
            process.exit();
        }
    }
module.exports = connectDB;