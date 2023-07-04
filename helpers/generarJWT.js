import jwt from 'jsonwebtoken'

const generarJWT = (id) => {
    // De parametros se le pasan los datos, luego el secretKey, y se le agregar opciones, como cuando expira el JWT
    return jwt.sign({id}, process.env.JWT_SECRET, {
        // Tiempo en que exipira la secion
        expiresIn: "30d"
    })

}

export default generarJWT