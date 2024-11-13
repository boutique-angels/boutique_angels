// contador.js

const reservaModelo = require('../modelos/reservaModelo');

const contadorControlador = {
    crearReserva: async (req) => {
        const clienteId = req.session.usuario.clienteId;
        if (!clienteId) {
            throw new Error('Cliente no autenticado o clienteId no encontrado en la sesión.');
        }

        const nuevaReserva = {
            personas: req.body.personas,
            evento: req.body.evento,
            fecha: req.body.fecha,
            hora: req.body.hora,
            buffet: req.body.buffet,
            carne: req.body.carne,
            arroz: req.body.arroz,
            bebida: req.body.bebida,
            postre: req.body.postre,
            mesa_dulces: req.body.mesa_dulces,
            decoracion: req.body.decoracion,
            alquiler: req.body.alquiler,
            musica: req.body.musica,
            total: req.body.total,
            clienteId: clienteId,
            editable: true  // Marcar como editable la reserva recién creada
        };

        try {
            // Deshabilitar la edición en todas las reservas anteriores del cliente
            await reservaModelo.desactivarEdicionReservas(clienteId);

            // Crear la nueva reserva en la base de datos
            const resultado = await reservaModelo.crearReserva(nuevaReserva);

            return resultado;
        } catch (err) {
            console.error('Error al crear la reserva:', err);
            throw err;
        }
    },

    // Función para obtener todas las reservas con el estado de edición correcto
    obtenerReservas: async (req) => {
        const clienteId = req.session.usuario.clienteId;
        if (!clienteId) {
            throw new Error('Cliente no autenticado.');
        }

        try {
            const reservas = await reservaModelo.obtenerReservasPorCliente(clienteId);
            return reservas;
        } catch (err) {
            console.error('Error al obtener las reservas:', err);
            throw err;
        }
    }
};

module.exports = contadorControlador;
