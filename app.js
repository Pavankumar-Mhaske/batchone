import  express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

// morgan logger
app.use(morgan('tiny'));
 


export default app ;

