import mongoose from 'mongoose';

const pacientesSchema = new mongoose.Schema({
        nombre: {
            type: String,
            required: true
        },
        propietario: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: true,
            default: Date.now()
        },
        sintomas: {
            type: String,
            required: true
        },
        // Añadir relacion entre Veterinario y Paciente
        veterinario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Veterinario',
        },
    },    // Crear columna de editado y creado
        {
            timestamps: true
        }
);

const Paciente = mongoose.model('Paciente', pacientesSchema);

export default Paciente;