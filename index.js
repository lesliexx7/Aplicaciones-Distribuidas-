const express = require("express");

const app = express();
const port = 3002;

app.use(express.json());

/* ============================= */
/*      Base de datos en memoria */
/* ============================= */

let tareas = [];
let nextId = 1;

/* ============================= */
/*           Heartbeat           */
/* ============================= */

app.get("/", (req, res) => {
    res.json({
        estado: "ok",
        mensaje: "Servicio activado"
    });
});

/* ============================= */
/*         POST /saludo          */
/* ============================= */

app.post("/saludo", (req, res) => {

    const { nombre } = req.body;

    if (!nombre || typeof nombre !== "string") {
        return res.status(400).json({
            estado: "error",
            mensaje: "Nombre inválido"
        });
    }

    res.json({
        estado: "ok",
        mensaje: `Hola, ${nombre}!`
    });
});

/* ============================= */
/*        POST /calcular         */
/* ============================= */

app.post("/calcular", (req, res) => {

    const { a, b, operacion } = req.body;

    if (typeof a !== "number" || typeof b !== "number" || !operacion) {
        return res.status(400).json({
            estado: "error",
            mensaje: "Parámetros inválidos"
        });
    }

    let resultado;

    const operaciones = {
        suma: () => a + b,
        resta: () => a - b,
        multiplicacion: () => a * b,
        division: () => {
            if (b === 0) throw new Error("No se puede dividir entre cero");
            return a / b;
        }
    };

    if (!operaciones[operacion]) {
        return res.status(400).json({
            estado: "error",
            mensaje: "Operación no válida"
        });
    }

    try {
        resultado = operaciones[operacion]();
    } catch (error) {
        return res.status(400).json({
            estado: "error",
            mensaje: error.message
        });
    }

    res.json({
        estado: "ok",
        resultado
    });
});

/* ============================= */
/*         POST /tareas          */
/* ============================= */

app.post("/tareas", (req, res) => {

    const { titulo, completada } = req.body;

    if (typeof titulo !== "string" || typeof completada !== "boolean") {
        return res.status(400).json({
            estado: "error",
            mensaje: "Datos inválidos"
        });
    }

    const nuevaTarea = {
        id: nextId++,
        titulo,
        completada,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    tareas.push(nuevaTarea);

    res.status(201).json({
        estado: "ok",
        tarea: nuevaTarea
    });
});

/* ============================= */
/*          GET /tareas          */
/*    ?completada=true/false     */
/* ============================= */

app.get("/tareas", (req, res) => {

    let resultado = tareas;

    if (req.query.completada !== undefined) {
        const filtro = req.query.completada === "true";
        resultado = tareas.filter(t => t.completada === filtro);
    }

    res.json({
        estado: "ok",
        total: resultado.length,
        tareas: resultado
    });
});

/* ============================= */
/*        PUT /tareas/:id        */
/* ============================= */

app.put("/tareas/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const { titulo, completada } = req.body;

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({
            estado: "error",
            mensaje: "Tarea no encontrada"
        });
    }

    if (titulo !== undefined) {
        if (typeof titulo !== "string") {
            return res.status(400).json({
                estado: "error",
                mensaje: "Titulo debe ser string"
            });
        }
        tarea.titulo = titulo;
    }

    if (completada !== undefined) {
        if (typeof completada !== "boolean") {
            return res.status(400).json({
                estado: "error",
                mensaje: "Completada debe ser boolean"
            });
        }
        tarea.completada = completada;
    }

    tarea.updatedAt = new Date();

    res.json({
        estado: "ok",
        tareaActualizada: tarea
    });
});

/* ============================= */
/*      DELETE /tareas/:id       */
/* ============================= */

app.delete("/tareas/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const index = tareas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            estado: "error",
            mensaje: "Tarea no encontrada"
        });
    }

    const tareaEliminada = tareas.splice(index, 1);

    res.json({
        estado: "ok",
        tareaEliminada: tareaEliminada[0]
    });
});
 /* ============================= */
/* POST /Validarcontraseñas      */
/* ============================= */

app.post("/validarpassword", (req, res) => {
    const { password } = req.body;
    if (typeof password !== "string") {
        return res.status(400).json({
            estado: "error",
            esValida: false,
            mensaje: " La contraseña debe ser un string"
        });

    }
     let errores = [];
    if (password.length < 8) {
        errores.push("La contraseña debe tener al menos 8 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
        errores.push("La contraseña debe contener al menos una letra mayúscula");
    }
    if (!/[a-z]/.test(password)) {
        errores.push("La contraseña debe contener al menos una letra minúscula");
    }   
    if (!/[0-9]/.test(password)) {          
        errores.push("La contraseña debe contener al menos un número");
    }

    const esValida = errores.length === 0;
    res.json({
        estado: "ok",
        esValida,
        errores
    });

})
 /* ============================= */
/* POST /Conversor de temperaturas*/
/* ============================= */
app.post("/conversortemperatura", (req, res) => {
    const { temperatura, desde } = req.body;

    if (typeof temperatura !== "number" || !desde) {
        return res.status(400).json({
            estado: "error",
            mensaje: "Temperatura debe ser un número y desde debe ser una unidad válida"
        });
    }

    let resultado = 0;
    let unidad = "";

    if (desde === "celsius") {
        resultado = (temperatura * 9/5) + 32;
        unidad = "fahrenheit";
    } else if (desde === "fahrenheit") {
        resultado = (temperatura - 32) * 5/9;
        unidad = "celsius";
    } else {
        return res.status(400).json({
            estado: "error",
            mensaje: "Unidad no válida. Use 'celsius' o 'fahrenheit'"
        });
    }

    res.json({
        estado: "ok",
        temperaturaConvertida: resultado,
        unidad
    });

})
 /* ============================= */
/*        Iniciar servidor       */
/* ============================= */




/* ============================= */
/*  POST /convertir-temperatura  */
/* ============================= */

app.post("/convertir-temperatura", (req, res) => {
    const { valor, desde, hacia } = req.body;

    const escalas = ["C", "F", "K"];
    if (typeof valor !== "number" || !escalas.includes(desde) || !escalas.includes(hacia)) {
        return res.status(400).json({
            estado: "error",
            mensaje: "Parámetros inválidos. Use { valor: number, desde: 'C|F|K', hacia: 'C|F|K' }"
        });
    }

    let valorConvertido = valor;
    // Convertir primero a Celsius
    let tempC;
    if (desde === "C") {
        tempC = valor;
    } else if (desde === "F") {
        tempC = (valor - 32) * 5/9;
    } else if (desde === "K") {
        tempC = valor - 273.15;
    }

    // Convertir de Celsius a destino
    if (hacia === "C") {
        valorConvertido = tempC;
    } else if (hacia === "F") {
        valorConvertido = (tempC * 9/5) + 32;
    } else if (hacia === "K") {
        valorConvertido = tempC + 273.15;
    }

    res.json({
        estado: "ok",
        valorOriginal: valor,
        valorConvertido,
        escalaOriginal: desde,
        escalaConvertida: hacia
    });
});
/* ============================= */
/*           POST /buscar        */
/* ============================= */

app.post("/buscar", (req, res) => {

    const { array, elemento } = req.body;

    // Validar que array sea un arreglo
    if (!Array.isArray(array)) {
        return res.status(400).json({
            estado: "error",
            mensaje: "El campo 'array' debe ser un arreglo"
        });
    }

    // Buscar elemento
    const indice = array.indexOf(elemento);
    const encontrado = indice !== -1;

    res.json({
        estado: "ok",
        encontrado,
        indice: encontrado ? indice : -1,
        tipoElemento: typeof elemento
    });

});

/* ============================= */
/*      POST /contar-palabras    */
/* ============================= */

app.post("/contar-palabras", (req, res) => {

    const { texto } = req.body;

    if (typeof texto !== "string") {
        return res.status(400).json({
            estado: "error",
            mensaje: "El texto debe ser un string"
        });
    }

    // Eliminar espacios extra al inicio y final
    const textoLimpio = texto.trim();

    // Si está vacío
    if (textoLimpio.length === 0) {
        return res.json({
            estado: "ok",
            totalPalabras: 0,
            totalCaracteres: 0,
            palabrasUnicas: 0
        });
    }

    // Separar palabras
    const palabras = textoLimpio.split(/\s+/);

    const totalPalabras = palabras.length;
    const totalCaracteres = texto.length;

    // Convertir a minúsculas para contar únicas
    const palabrasNormalizadas = palabras.map(p => p.toLowerCase());
    const palabrasUnicas = new Set(palabrasNormalizadas).size;

    res.json({
        estado: "ok",
        totalPalabras,
        totalCaracteres,
        palabrasUnicas
    });

});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


