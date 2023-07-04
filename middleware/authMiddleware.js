import  jwt  from "jsonwebtoken";
import Veterinaio from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;

    if ( 
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer') 
        ) {
            try {
                // Eliminar el Bearer y seleccionar el token  
                token = req.headers.authorization.split(' ')[1];
                
                // Toma el token a comprobar
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                req.veterinario = await Veterinaio.findById(decoded.id).select('-password -token -confirmado');

                return next();
            } catch (err) {
                const error = new Error('Token no válido');
                return res.status(403).json({ msg: error.message });
            }
        } 

    if ( !token) {
        const error = new Error('Token no válido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    // Se va a la siguiente funcion de perifl
    next();
}

export default checkAuth;