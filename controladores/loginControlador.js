const clientesModelo = require('../modelos/clientesModelo');
const db = require('../config/db');

// Autenticar Cliente
const autenticarCliente = (correo, contrasena, callback) => {
    const sql = `SELECT * FROM clientes WHERE correo = ? AND contrasena = ?`;

    db.query(sql, [correo, contrasena], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);  // Asegúrate de que esto se imprima
            return callback(err);
        }
        if (result.length > 0) {
            callback(null, result[0]);  // Usuario encontrado
        } else {
            callback(null, null);  // Usuario no encontrado
        }
    });
};

// Iniciar sesión
const iniciarSesion = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    clientesModelo.autenticarCliente(correo, contrasena, (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (!usuario) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Guardar información del cliente en la sesión
        req.session.usuario = {
            clienteId: usuario.clienteId,
            nombres: usuario.nombres,
            correo: usuario.correo
        };

        // Redirigir directamente a la página de cotización después de iniciar sesión
        res.redirect('/cotizar');
    });
};

// Cerrar sesión
const cerrarSesion = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.redirect('/login.html');  // Redirigir a la página de inicio de sesión
    });
};

module.exports = {
    iniciarSesion,
    autenticarCliente,
    cerrarSesion
};
