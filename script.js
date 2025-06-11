// Variables globales
let tablero = ["", "", "", "", "", "", "", "", ""]; // Representa el estado del tablero
let jugadorActual = "cruz"; // El primer jugador es la cruz
let juegoActivo = true; // Indica si el juego está en curso
let victoriasCruz = 0;
let victoriasCirculo = 0;
let turnoActual = "X";

// Funciones Drag & Drop
function permitirSoltar(event) {
    event.preventDefault();
}

function arrastrar(event) {
    if (!juegoActivo) {
        event.preventDefault();
        return;
    }
    
    // Verificar que es el turno correcto
    const elemento = event.target;
    const esCruz = elemento.classList.contains('cruz');
    
    if ((esCruz && jugadorActual !== "cruz") || (!esCruz && jugadorActual !== "circulo")) {
        event.preventDefault();
        return;
    }
    
    event.dataTransfer.setData("text/plain", elemento.className);
}

function soltar(event) {
    event.preventDefault();
    if (!juegoActivo) return;

    const cajaObjetivo = event.target.closest('.caja');
    if (!cajaObjetivo || cajaObjetivo.children.length > 0) return;

    const tipoElemento = event.dataTransfer.getData("text/plain");
    const posicion = cajaObjetivo.dataset.pos;

    // Crear nuevo elemento (para tener infinitos)
    let nuevoElemento;
    if (tipoElemento === "cruz") {
        nuevoElemento = document.createElement('div');
        nuevoElemento.className = "cruz";
    } else if (tipoElemento === "circulo") {
        nuevoElemento = document.createElement('div');
        nuevoElemento.className = "circulo";
    } else {
        return;
    }

    cajaObjetivo.appendChild(nuevoElemento);
    tablero[posicion] = jugadorActual;

    // Verificar si hay un ganador
    const resultado = verificarGanador();
    if (resultado.ganador) {
        mostrarGanador(resultado);
        actualizarMarcador(resultado.ganador);
        juegoActivo = false;
        return;
    }

    // Verificar empate
    if (!tablero.includes("")) {
        mostrarEmpate();
        juegoActivo = false;
        return;
    }

    // Cambiar de jugador
    cambiarJugador();
}

function verificarGanador() {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]  // Diagonales
    ];

    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return {
                ganador: tablero[a],
                combinacion: combinacion
            };
        }
    }

    return { ganador: null };
}

function mostrarGanador(resultado) {
    const mensaje = document.getElementById('texto-ganador');
    mensaje.textContent = `¡${jugadorActual === "cruz" ? "X" : "O"} ha ganado!`;
    
    // Mostrar línea ganadora
    if (resultado.combinacion) {
        const linea = document.getElementById('linea-ganadora');
        linea.style.display = "block";
        
        const [a, b, c] = resultado.combinacion;
        const cajaInicio = document.querySelector(`.caja[data-pos="${a}"]`);
        const cajaFin = document.querySelector(`.caja[data-pos="${c}"]`);
        
        const rectInicio = cajaInicio.getBoundingClientRect();
        const rectFin = cajaFin.getBoundingClientRect();
        
        const x1 = rectInicio.left + rectInicio.width / 2;
        const y1 = rectInicio.top + rectInicio.height / 2;
        const x2 = rectFin.left + rectFin.width / 2;
        const y2 = rectFin.top + rectFin.height / 2;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        linea.style.width = `${length}px`;
        linea.style.transform = `rotate(${angle}deg)`;
        linea.style.position = "absolute";
        linea.style.top = `${y1}px`;
        linea.style.left = `${x1}px`;
        linea.style.transformOrigin = "0 0";
    }
    
    document.getElementById('mensaje-ganador').style.display = "flex";
}

function mostrarEmpate() {
    const mensaje = document.getElementById('texto-ganador');
    mensaje.textContent = "¡Empate!";
    document.getElementById('linea-ganadora').style.display = "none";
    document.getElementById('mensaje-ganador').style.display = "flex";
}

function actualizarMarcador(ganador) {
    if (ganador === "cruz") {
        victoriasCruz++;
        document.getElementById('contador-cruz').textContent = victoriasCruz;
    } else {
        victoriasCirculo++;
        document.getElementById('contador-circulo').textContent = victoriasCirculo;
    }
}

function cambiarJugador() {
    jugadorActual = jugadorActual === "cruz" ? "circulo" : "cruz";
    turnoActual = jugadorActual === "cruz" ? "X" : "O";
    document.getElementById('indicador-turno').textContent = `Turno: ${turnoActual}`;
}

function reiniciarJuego() {
    // Reiniciar el tablero lógico
    tablero = ["", "", "", "", "", "", "", "", ""];
    
    // Reiniciar al jugador inicial
    jugadorActual = "cruz";
    turnoActual = "X";
    document.getElementById('indicador-turno').textContent = `Turno: ${turnoActual}`;
    
    // Reactivar el juego
    juegoActivo = true;
    
    // Limpiar el tablero visualmente
    const cajas = document.querySelectorAll(".tablero .caja");
    cajas.forEach(caja => {
        while (caja.firstChild) {
            caja.removeChild(caja.firstChild);
        }
    });
    
    // Ocultar el mensaje de ganador
    document.getElementById('mensaje-ganador').style.display = "none";
    document.getElementById('linea-ganadora').style.display = "none";
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('indicador-turno').textContent = `Turno: ${turnoActual}`;
});
