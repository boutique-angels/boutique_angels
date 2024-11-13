const db = require('../config/db');

// Iniciar sesión
const iniciarSesion = (req, res) => {
    const { correo, contrasena } = req.body;

    clientesModelo.autenticarCliente(correo, contrasena, (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (!usuario) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
        // Iniciar sesión correctamente
        req.session.usuario = usuario;
        res.redirect('/cotizar');  // Redirigir a la página principal del usuario
    });
};


// Función para autenticar un cliente
const autenticarCliente = (correo, contrasena, callback) => {
    debugger
    const sql = `SELECT * FROM clientes WHERE correo = ? AND contrasena = ?`;
   
        db.query(sql, [correo, contrasena], (err, result) => {
            debugger
            if (err) {
                return callback(err);
            }
            if (result.length > 0) {
                console.log(result[0])
                callback(null, result[0])  // Usuario encontrado
                  // Redirigir a la página principal del usuario
            } else {
                callback(null, null);  // Usuario no encontrado
            }
        });
    
};

module.exports = {
    autenticarCliente
};