const escenas = [...document.querySelectorAll(".escena")]
const avance = document.querySelector(".progreso span")
const cuerpoTerminal = document.querySelector(".terminal-cuerpo")
const botonCompilar = document.querySelector("#compilar")
const botonSonido = document.querySelector("#sonido")
let escenaActual = 0
let compilando = false
let sonidoActivo = false
let audioContexto

const mostrarEscena = indice => {
  escenas[escenaActual].classList.remove("activa")
  escenaActual = Math.min(indice, escenas.length - 1)
  escenas[escenaActual].classList.add("activa")
  avance.style.width = `${((escenaActual + 1) / escenas.length) * 100}%`
  tono(escenaActual === escenas.length - 1 ? 587 : 440, .08)
}

const tono = (frecuencia, duracion) => {
  if (!sonidoActivo) return
  audioContexto ||= new AudioContext()
  const oscilador = audioContexto.createOscillator()
  const ganancia = audioContexto.createGain()
  oscilador.type = "sine"
  oscilador.frequency.value = frecuencia
  ganancia.gain.setValueAtTime(.025, audioContexto.currentTime)
  ganancia.gain.exponentialRampToValueAtTime(.001, audioContexto.currentTime + duracion)
  oscilador.connect(ganancia).connect(audioContexto.destination)
  oscilador.start()
  oscilador.stop(audioContexto.currentTime + duracion)
}

document.querySelectorAll("[data-siguiente]").forEach(boton => {
  boton.addEventListener("click", () => mostrarEscena(escenaActual + 1))
})

botonSonido.addEventListener("click", () => {
  sonidoActivo = !sonidoActivo
  botonSonido.classList.toggle("activo", sonidoActivo)
  botonSonido.textContent = sonidoActivo ? "♫" : "♪"
  botonSonido.setAttribute("aria-label", sonidoActivo ? "Desactivar sonidos" : "Activar sonidos")
  tono(523, .12)
})

const espera = tiempo => new Promise(resolver => setTimeout(resolver, tiempo))

const lineas = [
  ["Buscando a Perla...", "✓", "estado-ok"],
  ["Recuperando nueve años de recuerdos...", "✓", "estado-ok"],
  ["Calculando la distancia...", "⚠", "estado-aviso"],
  ["Intentando entregar flores...", "✕", "estado-error"],
  ["Ignorando la distancia...", "✓", "estado-ok"],
  ["Compilando flores amarillas...", "✓", "estado-ok"]
]

const agregarLinea = (texto, estado, clase, extra = "") => {
  const linea = document.createElement("div")
  linea.className = `terminal-linea ${extra}`
  const mensaje = document.createElement("span")
  const marca = document.createElement("span")
  mensaje.textContent = texto
  marca.textContent = estado
  marca.className = clase
  linea.append(mensaje, marca)
  cuerpoTerminal.append(linea)
}

botonCompilar.addEventListener("click", async () => {
  if (compilando) return
  compilando = true
  botonCompilar.disabled = true
  botonCompilar.style.opacity = ".55"
  for (const [texto, estado, clase] of lineas) {
    agregarLinea(texto, estado, clase)
    tono(330, .05)
    await espera(560)
  }
  await espera(350)
  agregarLinea("Compilación exitosa 💛", "", "", "exito")
  tono(659, .16)
  await espera(1100)
  mostrarEscena(3)
})

document.addEventListener("keydown", evento => {
  if ((evento.key === "Enter" || evento.key === "ArrowRight") && escenaActual !== 2 && escenaActual < escenas.length - 1) {
    mostrarEscena(escenaActual + 1)
  }
})
