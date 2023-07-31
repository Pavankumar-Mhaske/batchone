import mongoose  from "mongoose";
import app from "./app";
import config from "./config/index"


//  now i want to imidiatly connect to the db as soon as enters here
// -> self invoked function. ()()

// ( async () => {})()
( async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log("DB connected");

        // event listener
        app.on('error', (err)=>{
            console.log("ERROR: ", err);
            throw err
        })

        const onListening = ()=>{
                console.log(`Listening on ${config.PORT}`)
            }
        
        app.listen(config.PORT, onListening );
        
    } catch (error) {
        console.error(error);
        throw error;
    }
})()