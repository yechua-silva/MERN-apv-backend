import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRouter from "./routes/veterinarioRoutes.js";
import pacientesRouter from "./routes/pacienteRoutes.js";

const app = express();
// Para leer datos del post
app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function ( origin, callback ) {
        if ( dominiosPermitidos.indexOf(origin) !== -1 ) {
            // El origen del request está permitido
            callback(null, true);
        } else {
            callback( new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRouter)
app.use('/api/pacientes', pacientesRouter)

const PORT = process.env.PORT || 4000;

app.listen( PORT, () => {
    console.log(`Servirdor funcionando en el puerto ${PORT}`);
});