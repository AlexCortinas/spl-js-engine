let pantalla = "";
let operacion = "";
let valor1 = null;

function agregarNumero(numero) {
    pantalla += numero;
    document.getElementById("pantalla").value = pantalla;
}

function agregarOperacion(op) {
    if (pantalla === "") return;
    if (valor1 === null) {
        valor1 = parseFloat(pantalla);
        operacion = op;
        pantalla = "";
        document.getElementById("pantalla").value = "";
    }
}

function calcular() {
    if (pantalla === "" || valor1 === null) return;
    const valor2 = parseFloat(pantalla);
    let resultado;
    switch (operacion) {
        /*% if (feature.add) { %*/
        case "+":
            resultado = valor1 + valor2;
            break;
        /*% } if (feature.subtract) { %*/
        case "-":
            resultado = valor1 - valor2;
            break;
        /*% } if (feature.multiply) { %*/
        case "*":
            resultado = valor1 * valor2;
            break;
        /*% } if (feature.divide) { %*/
        case "/":
            resultado = valor2 === 0 ? "Error" : valor1 / valor2;
            break;
        /*% } %*/
        default:
            resultado = "Error";
    }
    pantalla = resultado.toString();
    valor1 = null;
    operacion = "";
    document.getElementById("pantalla").value = pantalla;
}

function borrarPantalla() {
    pantalla = "";
    operacion = "";
    valor1 = null;
    document.getElementById("pantalla").value = "";
}

/*% if (feature.complex) { %*/
function calcularRaizCuadrada() {
    if (pantalla === "") return;
    const valor = parseFloat(pantalla);
    pantalla = Math.sqrt(valor).toString();
    document.getElementById("pantalla").value = pantalla;
}

function calcularPotencia() {
    if (pantalla === "") return;
    const valor = parseFloat(pantalla);
    pantalla = Math.pow(valor, 2).toString();
    document.getElementById("pantalla").value = pantalla;
}
/*% } %*/
