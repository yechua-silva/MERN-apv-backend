import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => { 
    // Extraer datos desde el post
    const { nombre, email, password } = req.body;

    // Prevenir usuarios registrados
    const existeUsuario = await Veterinario.findOne({ email })

    if ( existeUsuario ) {
        const error = new Error('El usuario ya existe')
        return res.status(400).json({msg: error.message})
    }

    try {
        //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body)
        // .save para guardar en la base de datos
        const veterinarioGuardado = await veterinario.save()

        // Enviar el Email de confirmacion
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

}

const perfil = (req, res) => {
    const { veterinario } = req

    res.send( veterinario );
}

const confirmar = async (req, res) => {
    // Leer datos de la URL, dps de params el nobre dinamico del parametro en el router
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token })

    if (!usuarioConfirmar ) {
        const error = new Error('Token no válido')
        // 404 no encontrado
        return res.status(404).json({msg: error.message})
    }

    try {
        // Eliminar el token y confirmar el usuario
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        // Guardar el usuario
        await usuarioConfirmar.save()
        res.json({ msg: 'Usuario Confirmado Correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email })    
    
    if ( !usuario ) {
        const error = new Error('El usuario no existe')
        return res.status(403).json({ msg: error.message });
    }

    // Revisar si el usuario esta confirmado
    if ( !usuario.confirmado ) {
        const error = new Error('Tu cuenta no ha sido esta confirmada')
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if ( await usuario.comprobarPassword(password) ) {
        console.log(usuario);
        // Autenticar
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT( usuario.id )
        })
    } else {
        const error = new Error('La contraseña es incorrecta')
        return res.status(403).json({ msg: error.message });
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body

    // Verificar si el usuario existe
    const existeVeterinario = await Veterinario.findOne({ email })
    if ( !existeVeterinario ) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }

    
    try {
        // Generar un token
        existeVeterinario.token = generarId()
        // Guardar el usuario
        await existeVeterinario.save()

        // Enviar el Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Hemos enviado un email con las instrucciones. Verifica en Spam' })
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    // Acceder a la URL
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token })

    if ( tokenValido  ) {
        // El Token es valido el usuario existe
        res.json({ msg: 'Token válido y el usuario existe' })
    } else {
        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    // Acceder a la URL
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token })

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: 'Has cambiado tu contraseña' })
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const { email } = req.body

    if (veterinario.email  !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email})
        if (existeEmail) {
            const error = new Error('Ese email ya esta en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        // Leer los datos del usuario
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo  } = req.body

    // Comprobar que exista el veterinario
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual) ) {
        // Almacenar la nueva contraseña
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({ msg: 'Has cambiado tu contraseña' })
    } else {
        const error = new Error('La contraseña actual es incorrecta')
        return res.status(400).json({msg: error.message})
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}