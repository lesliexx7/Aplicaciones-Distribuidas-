 // importar librerías
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.json());

/* =============================
   FUNCIONES AUXILIARES
============================= */

function applySHA256(texto) {
    return crypto.createHash('sha256')
        .update(texto)
        .digest('hex');
}

function validarCadenas(cadena1, cadena2) {
    if (cadena1 === undefined || cadena2 === undefined) {
        return "Faltan parámetros.";
    }
    if (typeof cadena1 !== "string" || typeof cadena2 !== "string") {
        return "Ambos parámetros deben ser cadenas.";
    }
    return null;
}

/* =============================
   RUTAS
============================= */

// i. mascaracteres
app.post('/mascaracteres', (req, res) => {
    try {
        const { cadena1, cadena2 } = req.body;

        const error = validarCadenas(cadena1, cadena2);
        if (error) {
            return res.status(400).json({ success: false, error });
        }

        const resultado = cadena1.length >= cadena2.length ? cadena1 : cadena2;

        res.json({ success: true, resultado });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// ii. menoscaracteres
app.post('/menoscaracteres', (req, res) => {
    try {
        const { cadena1, cadena2 } = req.body;

        const error = validarCadenas(cadena1, cadena2);
        if (error) {
            return res.status(400).json({ success: false, error });
        }

        const resultado = cadena1.length <= cadena2.length ? cadena1 : cadena2;

        res.json({ success: true, resultado });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// iii. numcaracteres
app.post('/numcaracteres', (req, res) => {
    try {
        const { cadena } = req.body;

        if (cadena === undefined || typeof cadena !== "string") {
            return res.status(400).json({
                success: false,
                error: "Debe enviar una cadena válida."
            });
        }

        res.json({
            success: true,
            caracteres: cadena.length
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// iv. palindroma
app.post('/palindroma', (req, res) => {
    try {
        const { cadena } = req.body;

        if (cadena === undefined || typeof cadena !== "string") {
            return res.status(400).json({
                success: false,
                error: "Debe enviar una cadena válida."
            });
        }

        const normalizada = cadena.toLowerCase().replace(/\s/g, '');
        const invertida = normalizada.split('').reverse().join('');

        res.json({
            success: true,
            palindroma: normalizada === invertida
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// v. concat
app.post('/concat', (req, res) => {
    try {
        const { cadena1, cadena2 } = req.body;

        const error = validarCadenas(cadena1, cadena2);
        if (error) {
            return res.status(400).json({ success: false, error });
        }

        res.json({
            success: true,
            resultado: cadena1 + cadena2
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// vi. applysha256
app.post('/applysha256', (req, res) => {
    try {
        const { cadena } = req.body;

        if (cadena === undefined || typeof cadena !== "string") {
            return res.status(400).json({
                success: false,
                error: "Debe enviar una cadena válida."
            });
        }

        const hash = applySHA256(cadena);

        res.json({
            success: true,
            original: cadena,
            encriptada: hash
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

// vii. verifysha256
app.post('/verifysha256', (req, res) => {
    try {
        const { cadenaNormal, cadenaEncriptada } = req.body;

        if (!cadenaNormal || !cadenaEncriptada) {
            return res.status(400).json({
                success: false,
                error: "Debe enviar cadenaNormal y cadenaEncriptada."
            });
        }

        const hashGenerado = applySHA256(cadenaNormal);

        res.json({
            success: true,
            coincide: hashGenerado === cadenaEncriptada
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error interno del servidor." });
    }
});

/* =============================
   INICIAR SERVIDOR
============================= */

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
