const readline = require("node:readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(texto) {
    return new Promise(resolve => {
        rl.question(texto, respuesta => resolve(respuesta));
    });
}

const COLORES_FACIL = ["R", "V", "A", "B"]; 
const COLORES_DIFICIL = ["R", "V", "A", "D", "B", "M", "N"];

const MAX_SECUENCIAS = 15;
const AYUDAS_DEFECTO = 3;

function borrarPantalla() {
    console.clear();
}

function mostrarColorCompleto(letra) {
    switch (letra) {
        case "R": return "Rojo";
        case "V": return "Verde";
        case "A": return "Azul";
        case "D": return "Dorado";
        case "B": return "Blanco";
        case "M": return "Marrón";
        case "N": return "Naranja";
        default: return "?";
    }
}

function generarSecuencia(modo, longitud) {
    const colores = modo === "facil" ? COLORES_FACIL : COLORES_DIFICIL;
    let secuencia = [];

    for (let i = 0; i < longitud; i++) {
        let aleatorio = Math.floor(Math.random() * colores.length);
        secuencia.push(colores[aleatorio]);
    }

    return secuencia;
}

function utilizarAyuda(secuencia, indice, ayudasRestantes) {
    if (ayudasRestantes > 0) {
        console.log(
            `El siguiente color es el ${mostrarColorCompleto(secuencia[indice])}. Te quedan ${ayudasRestantes - 1} ayudas!`
        );
        return true;
    } else {
        console.log("No dispones de más ayudas.");
        return false;
    }
}

async function jugar(modo) {
    let ayudas = AYUDAS_DEFECTO;

    for (let numSecuencia = 1; numSecuencia <= MAX_SECUENCIAS; numSecuencia++) {
        let longitud = numSecuencia;
        let secuencia = generarSecuencia(modo, longitud);

        console.log(`Sequence number ${numSecuencia}:`);
        console.log(secuencia.map(c => mostrarColorCompleto(c)).join(" - "));
        await preguntar("Memoriza la secuencia y pulsa Enter para continuar...");

        borrarPantalla();

        console.log(`Ayudas disponibles: ${ayudas}`);
        console.log(`Introduce la secuencia de ${longitud} colores:`);
        console.log("(R = Rojo, V = Verde, A = Azul, D = Dorado, B = Blanco, M = Marrón, N = Naranja, x = Ayuda)");

        for (let i = 0; i < longitud; i++) {
            let entrada = (await preguntar(`Color ${i + 1}: `)).toUpperCase();

            if (entrada === "X") {
                let usada = utilizarAyuda(secuencia, i, ayudas);
                if (usada) {
                    ayudas--;
                    entrada = (await preguntar(`Color ${i + 1}: `)).toUpperCase();
                } else {
                    entrada = (await preguntar(`Color ${i + 1}: `)).toUpperCase();
                }
            }

            if (entrada !== secuencia[i]) {
                console.log("Has fallado. Fin del juego.");
                return;
            }
        }

        console.log(`Enhorabuena, has acertado la secuencia número ${numSecuencia}.`);
        console.log("");
    }

    console.log("¡Has completado todas las secuencias! ¡Eres un maestro del Simon Dice!");
}

async function menu() {
    console.log("¡Bienvenido a Simon dice!");
    const nombre = await preguntar("¿Cuál es tu nombre? ");
    console.log(`Hola ${nombre}!`);

    let opcion = -1;

    while (opcion !== 0) {
        console.log("Elija una opción para continuar:");
        console.log("0: Salir.");
        console.log("1: Jugar en modo sencillo.");
        console.log("2: Jugar en modo difícil.");

        opcion = Number(await preguntar("Opción: "));

        if (opcion === 1) {
            await jugar("facil");
        }

        if (opcion === 2) {
            await jugar("dificil");
        }

        if (opcion !== 0 && opcion !== 1 && opcion !== 2) {
            console.log("Opción no válida.");
        }
    }

    console.log("Saliendo del juego...");
    rl.close();
}

menu();
