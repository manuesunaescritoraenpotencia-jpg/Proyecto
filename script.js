let emocionActual = 'triste';
let nombreEmocionActual = 'Triste';
let nivelActual = 1;
let temporizadorAvance = null;
let temporizadorConteoDedos = null;
let temporizadorReinicioMision = null;
let temporizadorSuspenderCtx = null;

const dedosActivosCaminito = new Set();
let maxDedosEnGestoCaminito = 0;
let temporizadorCierreGestoCaminito = null;

let clicsPCEnCaminito = 0;
let temporizadorClicsPC = null;

const RUTA_AUDIOS = 'assets/Audios/';

const TEXTO_GUION_MEDIACION =
  'Para usar esta aplicación necesitas la ayuda de un adulto. Puedes buscar a tu papá, a tu mamá o a alguna de tus profesoras. ¡Los científicos también necesitamos ayudantes!';

const AUDIOS_GENERALES = {
  bienvenida: `${RUTA_AUDIOS}Audio Bienvenida GregorioElefante.wav`,
  mediacion: `${RUTA_AUDIOS}Audio Padres y mediadores.wav`,
  intensidad: `${RUTA_AUDIOS}Audio intensidad de la emoción.wav`,
  recomendaciones: `${RUTA_AUDIOS}Audio recomendaciones experimentosas.wav`,
  retoFotos: `${RUTA_AUDIOS}Audio reto de las fotos .wav`,
  retoFotosFinal: `${RUTA_AUDIOS}Audio reto de las fotos final.wav`
};

const AUDIOS_INSTRUCCIONES_EMOCION = {
  triste:    `${RUTA_AUDIOS}Audio instrucciones tristeza.wav`,
  bravo:     `${RUTA_AUDIOS}Audio instrucciones bravo.wav`,
  alegre:    `${RUTA_AUDIOS}Audio instrucciones alegría.wav`,
  asustado:  `${RUTA_AUDIOS}Audio instrucciones susto.wav`,
  desagrado: `${RUTA_AUDIOS}Audio instrucciones asco.wav`
};

const AUDIOS_MINIJUEGOS = {
  ducha:    `${RUTA_AUDIOS}Audio asco.wav`,
  casita:   `${RUTA_AUDIOS}Audio bravo.wav`,
  burbujas: `${RUTA_AUDIOS}Audio alegría .wav`,
  caricia:  `${RUTA_AUDIOS}Audio triste .wav`,
  ritmo:    `${RUTA_AUDIOS}Audio  susto.wav`
};

const AUDIOS_FOTOS_EMOCION = {
  alegre:    `${RUTA_AUDIOS}Audio reto de las fotos alegría.wav`,
  triste:    `${RUTA_AUDIOS}Audio reto de las fotos tristeza.wav`,
  bravo:     `${RUTA_AUDIOS}Audio reto de las fotos rabia.wav`,
  asustado:  `${RUTA_AUDIOS}Audio reto de las fotos miedo.wav`,
  desagrado: `${RUTA_AUDIOS}Audio reto de las fotos asco.wav`
};

const IMAGENES_JUEGO_GREGORIO = {
  ducha:    'assets/images/Gregorio en la ducha.jpg',
  burbujas: 'assets/images/Gregorio haciendo burbujas.jpg',
  caricia:  'assets/images/Gregorio en el spa.jpg',
  casita:   'assets/images/Gregorio construyendo.jpg',
  ritmo:    'assets/images/Gregorio tocando música.jpg'
};

const CARA_BASE_EMOCION = {
  triste:    'assets/images/Gregorio triste.png',
  bravo:     'assets/images/Gregorio furioso.png',
  alegre:    'assets/images/Gregorio feliz.png',
  asustado:  'assets/images/Gregorio asustado.png',
  desagrado: 'assets/images/Gregorio desagrado.png'
};

const ETIQUETA_NIVEL_DEDO = {
  triste: {
    1: '1 dedito = un poquito triste',
    2: '2 deditos = medianamente triste',
    3: '3 deditos = muy triste'
  },
  bravo: {
    1: '1 dedito = un poquito bravo',
    2: '2 deditos = medianamente bravo',
    3: '3 deditos = muy bravo'
  },
  alegre: {
    1: '1 dedito = un poquito alegre',
    2: '2 deditos = medianamente alegre',
    3: '3 deditos = muy alegre'
  },
  asustado: {
    1: '1 dedito = un poquito asustado',
    2: '2 deditos = medianamente asustado',
    3: '3 deditos = muy asustado'
  },
  desagrado: {
    1: '1 dedito = un poquito asqueado',
    2: '2 deditos = medianamente asqueado',
    3: '3 deditos = muy asqueado'
  }
};

function textoIntensidadPorEmocion(cantidad, claveEmocion = emocionActual) {
  const mapa = ETIQUETA_NIVEL_DEDO[claveEmocion] || ETIQUETA_NIVEL_DEDO.triste;
  return mapa[cantidad] || mapa[1];
}

function guiaResumenIntensidad(claveEmocion = emocionActual) {
  return `${textoIntensidadPorEmocion(1, claveEmocion)} · ${textoIntensidadPorEmocion(2, claveEmocion)} · ${textoIntensidadPorEmocion(3, claveEmocion)}`;
}

const INSTRUCCIONES_JUEGO = {
  ducha:    'Toca para ducharte y cantar o limpiar pompas.',
  casita:   'Toca para apilar bloques y crear tu construcción.',
  burbujas: 'Toca las burbujas para explotarlas con tu dedito.',
  caricia:  'Desliza para hacer un masaje suave con crema.',
  ritmo:    'Toca las 8 notas de Do a Do para crear tu melodía.'
};

const FRASE_EMOCION_JUEGO = {
  ducha:    'Cuando sientes asco puedes tomar una ducha y cantar.',
  casita:   'Cuando estás bravo puedes apilar bloques y construir.',
  burbujas: 'Cuando estás alegre puedes explotar burbujas.',
  caricia:  'Cuando estás triste puedes hacer un masaje con crema.',
  ritmo:    'Cuando estás asustado puedes tocar notas y crear melodía.'
};

const JUEGO_POR_EMOCION = {
  desagrado: 'ducha',
  bravo:     'casita',
  alegre:    'burbujas',
  triste:    'caricia',
  asustado:  'ritmo'
};

const FOTOS_GREGORIO_GALERIA = [
  { id: 'alegre',    nombre: 'Alegre',   guia: 'Sonríe con alegría y tómate una foto', src: 'assets/images/Gregorio feliz.png' },
  { id: 'triste',    nombre: 'Triste',   guia: 'Haz carita de tristeza y tómate una foto', src: 'assets/images/Gregorio triste.png' },
  { id: 'bravo',     nombre: 'Bravo',    guia: 'Haz carita de bravo y tómate una foto', src: 'assets/images/Gregorio furioso.png' },
  { id: 'asustado',  nombre: 'Asustado', guia: 'Haz carita de miedo y tómate una foto', src: 'assets/images/Gregorio asustado.png' },
  { id: 'desagrado', nombre: 'Asco',     guia: 'Haz carita de asco y tómate una foto', src: 'assets/images/Gregorio desagrado.png' }
];

const cacheImagenesJuego = {};

function obtenerImagenJuego(clave) {
  const ruta = IMAGENES_JUEGO_GREGORIO[clave] || FOTOS_GREGORIO_GALERIA[0].src;
  const codificada = encodeURI(ruta);
  if (!cacheImagenesJuego[codificada]) {
    const img = new Image();
    img.decoding = 'async';
    img.src = codificada;
    cacheImagenesJuego[codificada] = img;
  }
  return cacheImagenesJuego[codificada];
}

function precargarAudiosYImagenes() {
  Object.values(IMAGENES_JUEGO_GREGORIO).forEach(ruta => {
    const codificada = encodeURI(ruta);
    if (!cacheImagenesJuego[codificada]) {
      const img = new Image();
      img.decoding = 'async';
      img.src = codificada;
      cacheImagenesJuego[codificada] = img;
    }
  });

  Object.values(CARA_BASE_EMOCION).forEach(ruta => {
    const img = new Image();
    img.decoding = 'async';
    img.src = encodeURI(ruta);
  });

  precargarGaleriaGregorio();
}

let juegoActual = 'caricia';
let animacionJuegoId = null;
let punteroActivo = false;
let progresoMision = 0;
let misionCompletada = false;
let tiempoJuego = 0;

let chorroTrompaFrames = 0;
let pulsoTrompa = 0;
let gotasAgua = [];
let salpicadurasAgua = [];
let pompasJabon = [];
let chispasLimpieza = [];

let burbujasFlotantes = [];
let anillosExplosion = [];
let capasCrema = [];

const CONSTRUCCIONES_DISPONIBLES = [
  { nombre: 'Casita', color: '#fbbf24' },
  { nombre: 'Torre',  color: '#c084fc' },
  { nombre: 'Puente', color: '#f472b6' }
];
let indiceConstruccionActual = 0;
let progresoCasita = 0;

let audioCtx = null;
let audioActualRuta = '';
let audiosActivados = true;
let notasFlotantes = [];
let notaActivaBaqueta = 0;
const ESCALA_DO_OCTAVA = [
  { nota: 'Do',  freq: 261.63 },
  { nota: 'Re',  freq: 293.66 },
  { nota: 'Mi',  freq: 329.63 },
  { nota: 'Fa',  freq: 349.23 },
  { nota: 'Sol', freq: 392.00 },
  { nota: 'La',  freq: 440.00 },
  { nota: 'Si',  freq: 493.88 },
  { nota: 'Do',  freq: 523.25 }
];
let notasTocadasEnMision = new Set();
let pulsoNota = new Array(ESCALA_DO_OCTAVA.length).fill(0);

let simulacionAudioInterval = null;
let tiempoSimuladoActual = 0;
const duracionSimuladaTotal = 30;
let reproduciendoSimulado = false;

let streamCamara = null;
let animacionCamaraId = null;
const imagenesGaleriaCargadas = {};
let fotoGregorioSeleccionadaId = FOTOS_GREGORIO_GALERIA[0].id;
let imagenGregorioCamara = null;
let posGregorioCamaraX = 235;
let posGregorioCamaraY = 215;
let tamanoGregorioCamara = 118;
let arrastrandoGregorio = false;
let ultimaFotoDataUrl = '';
let tiempoCamara = 0;

const RITUALES_POR_EMOCION = {
  triste: {
    1: {
      titulo: "La caricia de Gregorio",
      resumen: "Palma hacia arriba y acaricia tu pulgar despacio desde la base hasta la punta.",
      proposito: "Acompañar un poquito de tristeza con un cariñito suave en la mano.",
      materiales: "Ninguno.",
      pasos: [
        "Coloca tu manito con la palma hacia arriba.",
        "Acaricia suavemente con tu pulgar desde la base hasta la puntita.",
        "Hazlo despacio como dándole un cariñito a tu mano."
      ],
      guion: "Veo que hoy te sientes un poquito triste. Coloca tu palma hacia arriba y acaríciala suavemente con tu pulgar, despacio.",
      acompanamiento: "Acompañar con calidez y sin presionar.",
      imagen: "assets/images/Ritual 1 tristeza.jpg",
      audio: `${RUTA_AUDIOS}Audio tristeza 1.wav`
    },
    2: {
      titulo: "El abrazo de deditos",
      resumen: "Pon tus manos frente a frente y entrelaza tus deditos como un abrazo de manos.",
      proposito: "Sentir acompañamiento cuando la tristeza es mediana.",
      materiales: "Ninguno.",
      pasos: [
        "Pon tus manos frente a frente.",
        "Entrelaza tus deditos suavemente.",
        "Siente el abrazo de tus manos y suéltalas despacio."
      ],
      guion: "Tu tristeza se siente medianamente grande. Pon tus manos frente a frente y entrelaza tus deditos como un abrazo.",
      acompanamiento: "Acompañar con calma y respetar el ritmo del niño.",
      imagen: "assets/images/Ritual 2 tristeza.jpg",
      audio: `${RUTA_AUDIOS}Audio tristeza 2.wav`
    },
    3: {
      titulo: "El nido de Gregorio",
      resumen: "Busca tu peluche favorito, dale un abrazo grande y dile algo lindo.",
      proposito: "Buscar consuelo y acompañamiento cuando estás muy triste.",
      materiales: "Peluche favorito y adulto de confianza.",
      pasos: [
        "Busca tu peluche favorito.",
        "Dale un abrazo grandote.",
        "Dile algo lindo mientras te acompaña."
      ],
      guion: "Estás muy triste. Busca tu peluche favorito, dale un abrazo grandote y dile algo lindo.",
      acompanamiento: "Ofrecer presencia tranquila sin exigir hablar.",
      imagen: "assets/images/Ritual 3 tristeza.jpg",
      audio: `${RUTA_AUDIOS}Audio tristeza 3.wav`
    }
  },
  bravo: {
    1: {
      titulo: "El detective de las manos",
      resumen: "Dibuja una espiral con tu dedito sobre la palma y respira despacio.",
      proposito: "Notar cuando estás un poquito bravo y respirar con calma.",
      materiales: "Ninguno.",
      pasos: [
        "Abre tu palma.",
        "Dibuja una espiral con tu dedito sobre la palma.",
        "Inhala y exhala despacio mientras sientes cosquillitas."
      ],
      guion: "Estás un poquito bravo. Dibuja una espiral con tu dedito en tu palma, inhala y exhala despacio.",
      acompanamiento: "Ayudar a nombrar la emoción con tranquilidad.",
      imagen: "assets/images/Ritual 1 rabia.jpg",
      audio: `${RUTA_AUDIOS}Audio bravo 1.wav`
    },
    2: {
      titulo: "La fábrica de plastilina",
      resumen: "Amasa, aplasta, haz huequitos y estira plastilina con tus manos.",
      proposito: "Canalizar energía cuando estás medianamente bravo.",
      materiales: "Plastilina.",
      pasos: [
        "Toma plastilina y amásala.",
        "Aplástala y hazle huequitos.",
        "Aprieta, estira y crea figuras."
      ],
      guion: "Tu furia creció un poquito. Aplasta plastilina, haz huequitos y estírala con tus manos.",
      acompanamiento: "Facilitar materiales seguros o alternativas agradables.",
      imagen: "assets/images/Ritual 2 rabia.jpg",
      audio: `${RUTA_AUDIOS}Audio bravo 2.wav`
    },
    3: {
      titulo: "El volcán encuentra una salida",
      resumen: "Pon tus manos sobre un cojín y empújalo con fuerza sin lastimarte.",
      proposito: "Liberar energía intensa de forma segura cuando estás muy bravo.",
      materiales: "Cojín y adulto acompañante.",
      pasos: [
        "Busca un cojín seguro.",
        "Pon tus manos encima de él.",
        "Empújalo con fuerza sin lastimarte ni lastimar a nadie."
      ],
      guion: "Estás muy molesto. Pon tus manos sobre un cojín y empújalo con fuerza, sin lastimarte.",
      acompanamiento: "Cuidar la seguridad física y hablar con calma.",
      imagen: "assets/images/Ritual 3 rabia.jpg",
      audio: `${RUTA_AUDIOS}Audio bravo 3.wav`
    }
  },
  alegre: {
    1: {
      titulo: "El saludo de los cinco amigos",
      resumen: "Abre tus cinco deditos y salúdalos uno a uno con tu pulgar.",
      proposito: "Expresar alegría saludando con tus deditos.",
      materiales: "Ninguno.",
      pasos: [
        "Abre tus cinco deditos.",
        "Salúdalos con tu pulgar.",
        "Di «¡Hola!» a cada dedito."
      ],
      guion: "¡Estás contento! Abre tus cinco deditos y salúdalos a todos con tu pulgar.",
      acompanamiento: "Acompañar la alegría compartida.",
      imagen: "assets/images/Ritual alegría 1.jpg",
      audio: `${RUTA_AUDIOS}Audio alegría 1.wav`
    },
    2: {
      titulo: "La orquesta de los dedos",
      resumen: "En una mesa, usa tus deditos para crear un ritmo: tum, tum, tac, tac.",
      proposito: "Crear ritmo y música con los dedos al estar alegre.",
      materiales: "Una mesa.",
      pasos: [
        "Busca una mesa.",
        "Usa tus deditos para tocar un ritmo.",
        "Crea tu canción con tum, tum, tac, tac."
      ],
      guion: "¡Orejitas arriba! Busca una mesa y usa tus deditos para crear un ritmo: tum, tum, tac, tac.",
      acompanamiento: "Acompañar el juego rítmico y cuidar transiciones.",
      imagen: "assets/images/Ritual 2 alegría.jpg",
      audio: `${RUTA_AUDIOS}Audio alegría 2.wav`
    },
    3: {
      titulo: "La misión de los exploradores",
      resumen: "Invita a un amigo o adulto a jugar con sus palmas y crear un ritmo juntos.",
      proposito: "Compartir el juego con las palmas cuando la alegría es alta.",
      materiales: "Un amigo o adulto acompañante.",
      pasos: [
        "Invita a un amigo o adulto.",
        "Jueguen con sus palmas.",
        "Creen un ritmo juntos."
      ],
      guion: "Jugar acompañado es muy divertido. Invita a alguien a jugar con sus palmas y creen un ritmo juntos.",
      acompanamiento: "Acompañar el juego y mantener un espacio seguro.",
      imagen: "assets/images/Ritual 3 alegría.jpg",
      audio: `${RUTA_AUDIOS}Audio alegría 3.wav`
    }
  },
  asustado: {
    1: {
      titulo: "Los dedos amigos",
      resumen: "Respira y cuenta del 1 al 10 con tus deditos para calmar un poquito de miedo.",
      proposito: "Acompañar un susto leve contando con los dedos.",
      materiales: "Ninguno.",
      pasos: [
        "Respira despacio.",
        "Cuenta del 1 al 10 usando tus deditos.",
        "Termina con una pausa tranquila."
      ],
      guion: "Estás un poquito asustado. Respiremos y contemos del uno al diez con tus deditos.",
      acompanamiento: "Validar el miedo y acompañar sin burlas.",
      imagen: "assets/images/Ritual 1 miedo.jpg",
      audio: `${RUTA_AUDIOS}Audio susto 1.wav`
    },
    2: {
      titulo: "La casita protectora",
      resumen: "Respira despacio, junta tus manitos, acarícialas y piensa en algo que te guste.",
      proposito: "Buscar calma y un pensamiento agradable cuando crece el miedo.",
      materiales: "Ninguno.",
      pasos: [
        "Respira despacio y cierra los ojitos si quieres.",
        "Junta tus manitos y acarícialas suavemente.",
        "Piensa en algo que te guste mucho."
      ],
      guion: "Tu miedo está creciendo. Respira despacio, junta y acaricia tus manitos y piensa en algo que te guste.",
      acompanamiento: "Brindar cercanía y explicar con palabras claras.",
      imagen: "assets/images/Ritual 2 miedo.jpg",
      audio: `${RUTA_AUDIOS}Audio susto 2.wav`
    },
    3: {
      titulo: "El camino hacia alguien de confianza",
      resumen: "Busca un adulto de confianza y haz una señal con tu manito para pedir ayuda.",
      proposito: "Pedir ayuda a una persona de confianza cuando estás muy asustado.",
      materiales: "Adulto de confianza.",
      pasos: [
        "Busca un adulto en quien confíes.",
        "Haz una señal con tu manito.",
        "Pide ayuda para sentirte cuidado."
      ],
      guion: "Estás muy asustado. Busca un adulto en quien confíes y haz una señal con tu manito para pedir ayuda.",
      acompanamiento: "Ponerse a su altura, escuchar y proteger.",
      imagen: "assets/images/Ritual 3 miedo.jpg",
      audio: `${RUTA_AUDIOS}Audio susto 3.wav`
    }
  },
  desagrado: {
    1: {
      titulo: "Mi dedo dice «no, gracias»",
      resumen: "Levanta tu dedito índice de lado a lado y di «¡No, gracias! ¡No me gusta!».",
      proposito: "Expresar rechazo cuando algo no te gusta o da asco.",
      materiales: "Ninguno.",
      pasos: [
        "Levanta tu dedito índice.",
        "Muévelo de un lado a otro.",
        "Di «¡No, gracias! ¡No me gusta!»."
      ],
      guion: "¿Sientes asco? Levanta tu dedito índice de un lado a otro y di: ¡No, gracias! ¡No me gusta!",
      acompanamiento: "Respetar el límite y no obligar.",
      imagen: "assets/images/Ritual 1 desagrado.jpg",
      audio: `${RUTA_AUDIOS}Audio asco 1.wav`
    },
    2: {
      titulo: "Los deditos exploradores se alejan",
      resumen: "Convierte tus deditos en piecitos y camina para alejarte de lo que incomoda.",
      proposito: "Tomar distancia de estímulos que producen asco.",
      materiales: "Ninguno.",
      pasos: [
        "Convierte tus deditos en piecitos.",
        "Hazlos caminar: un pasito, dos pasitos.",
        "Aléjate de eso que no te gusta."
      ],
      guion: "Convierte tus deditos en piecitos: un pasito, dos pasitos, y aléjate de lo que no te gusta.",
      acompanamiento: "Retirar el estímulo desagradable si es posible.",
      imagen: "assets/images/Ritual 2 desagrado.jpg",
      audio: `${RUTA_AUDIOS}Audio asco 2.wav`
    },
    3: {
      titulo: "Las manos limpias",
      resumen: "Si sientes asco por manos sucias, lávatelas muy bien con agua y jabón.",
      proposito: "Limpiar las manos cuando el asco se relaciona con suciedad.",
      materiales: "Agua, jabón y toalla.",
      pasos: [
        "Ve donde haya agua y jabón.",
        "Moja tus manitos y lávalas muy bien.",
        "Enjuaga y sécalas."
      ],
      guion: "Si sientes asco por tener las manos sucias, moja tus manitos y lávalas muy bien con agua y jabón.",
      acompanamiento: "Acompañar el lavado cuando exista suciedad real.",
      imagen: "assets/images/Ritual 3 desagrado.jpg",
      audio: `${RUTA_AUDIOS}Audio asco 3.wav`
    }
  }
};

function actualizarEstadoBotonesAudio(estaSonando) {
  document.querySelectorAll('[data-audio-btn]').forEach(btn => {
    const esEste = btn.getAttribute('data-audio-activo') === 'true';
    if (estaSonando && esEste) {
      btn.classList.add('sonando');
      if (btn.dataset.textoPausar) {
        btn.textContent = btn.dataset.textoPausar;
      }
    } else {
      btn.classList.remove('sonando');
      if (btn.dataset.textoNormal) {
        btn.textContent = btn.dataset.textoNormal;
      }
    }
  });
}

function suspenderAudioCtxSiLibre() {
  clearTimeout(temporizadorSuspenderCtx);
  temporizadorSuspenderCtx = setTimeout(() => {
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend().catch(() => {});
    }
  }, 600);
}

function detenerNarracion() {
  const audioNar = document.getElementById('audio-narracion-gregorio');
  if (audioNar) {
    audioNar.pause();
    audioNar.currentTime = 0;
  }
  if (typeof window.speechSynthesis !== 'undefined') {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  audioActualRuta = '';
  document.querySelectorAll('[data-audio-btn]').forEach(btn => {
    btn.setAttribute('data-audio-activo', 'false');
  });
  actualizarEstadoBotonesAudio(false);
  suspenderAudioCtxSiLibre();
}

function hablarRespaldoTexto(texto, botonPresionado = null) {
  if (!audiosActivados || !texto || typeof window.speechSynthesis === 'undefined') {
    actualizarEstadoBotonesAudio(false);
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'es-ES';
    utter.rate = 0.96;
    utter.onstart = () => actualizarEstadoBotonesAudio(true);
    utter.onend = () => actualizarEstadoBotonesAudio(false);
    utter.onerror = () => actualizarEstadoBotonesAudio(false);
    if (botonPresionado) {
      botonPresionado.setAttribute('data-audio-activo', 'true');
    }
    window.speechSynthesis.speak(utter);
  } catch (e) {
    actualizarEstadoBotonesAudio(false);
  }
}

function alternarNarracion(rutaWav, botonPresionado = null, rutasAlternativas = [], textoRespaldo = '') {
  if (!audiosActivados || (!rutaWav && !textoRespaldo)) return;

  const audioNar = document.getElementById('audio-narracion-gregorio');
  if (!audioNar) return;

  detenerReproductorRitual();
  if (typeof window.speechSynthesis !== 'undefined') {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend().catch(() => {});
  }

  const candidatos = [rutaWav, ...(Array.isArray(rutasAlternativas) ? rutasAlternativas : [])]
    .filter(Boolean)
    .map(r => encodeURI(r));

  const esElMismo = candidatos.includes(audioActualRuta);

  document.querySelectorAll('[data-audio-btn]').forEach(btn => {
    btn.setAttribute('data-audio-activo', botonPresionado && btn === botonPresionado ? 'true' : 'false');
  });

  if (esElMismo && !audioNar.paused) {
    audioNar.pause();
    actualizarEstadoBotonesAudio(false);
    return;
  }

  if (!candidatos.length) {
    hablarRespaldoTexto(textoRespaldo, botonPresionado);
    return;
  }

  let indiceCandidato = 0;

  const intentarReproducir = () => {
    const rutaActual = candidatos[indiceCandidato];
    audioNar.pause();
    audioNar.currentTime = 0;
    audioActualRuta = rutaActual;
    audioNar.src = rutaActual;

    audioNar.play().then(() => {
      actualizarEstadoBotonesAudio(true);
    }).catch(() => {
      indiceCandidato++;
      if (indiceCandidato < candidatos.length) {
        intentarReproducir();
      } else if (textoRespaldo) {
        hablarRespaldoTexto(textoRespaldo, botonPresionado);
      } else {
        actualizarEstadoBotonesAudio(false);
      }
    });
  };

  audioNar.onended = () => {
    actualizarEstadoBotonesAudio(false);
  };

  audioNar.onerror = () => {
    indiceCandidato++;
    if (indiceCandidato < candidatos.length) {
      intentarReproducir();
    } else if (textoRespaldo) {
      hablarRespaldoTexto(textoRespaldo, botonPresionado);
    } else {
      actualizarEstadoBotonesAudio(false);
    }
  };

  intentarReproducir();
}

function toggleTodosLosAudios() {
  audiosActivados = !audiosActivados;
  if (!audiosActivados) {
    detenerNarracion();
    detenerReproductorRitual();
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend().catch(() => {});
    }
  }
  return audiosActivados;
}

function toggleSonidoGlobalUI() {
  const activo = toggleTodosLosAudios();
  document.querySelectorAll('[data-toggle-sonido-global]').forEach(btn => {
    btn.textContent = activo ? '🔊 Sonidos activos' : '🔇 Sonidos silenciados';
    btn.classList.toggle('silenciado', !activo);
  });
}

function reproducirAudioInicio(btn = null) {
  alternarNarracion(AUDIOS_GENERALES.bienvenida, btn);
}

function reproducirAudioMediacion(btn = null) {
  alternarNarracion(
    AUDIOS_GENERALES.mediacion,
    btn,
    [
      `${RUTA_AUDIOS}Audio Padres y mediadores .wav`,
      `${RUTA_AUDIOS}Audio padres y mediadores.wav`,
      `${RUTA_AUDIOS}Audio adultos y mediacion.wav`
    ],
    TEXTO_GUION_MEDIACION
  );
}

function reproducirInstruccionDedos(btn = null) {
  const ruta = AUDIOS_INSTRUCCIONES_EMOCION[emocionActual] || AUDIOS_GENERALES.intensidad;
  alternarNarracion(ruta, btn);
}

function reproducirIntroJuegos(btn = null) {
  alternarNarracion(AUDIOS_GENERALES.recomendaciones, btn);
}

function reproducirAudioJuegoActual(btn = null) {
  alternarNarracion(AUDIOS_MINIJUEGOS[juegoActual], btn);
}

function reproducirIntroFotos(btn = null) {
  alternarNarracion(AUDIOS_GENERALES.retoFotos, btn);
}

function reproducirAudioFotoActual(btn = null) {
  alternarNarracion(AUDIOS_FOTOS_EMOCION[fotoGregorioSeleccionadaId], btn);
}

function activarBloqueosMovilYCopia() {
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
  }, { capture: true });

  document.addEventListener('dragstart', e => {
    e.preventDefault();
  }, { capture: true });

  document.addEventListener('selectstart', e => {
    const dentroDeFicha = e.target && e.target.closest && e.target.closest('.tarjeta-ficha');
    if (!dentroDeFicha) {
      e.preventDefault();
    }
  }, { capture: true });

  document.addEventListener('gesturestart', e => {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    const dentroDeFicha = e.target && e.target.closest && e.target.closest('.tarjeta-ficha');
    if (!dentroDeFicha) {
      e.preventDefault();
    }
  }, { passive: false });
}

function detenerReproductorRitual() {
  clearInterval(simulacionAudioInterval);
  simulacionAudioInterval = null;
  reproduciendoSimulado = false;

  const reproductor = document.getElementById('mi-audio-gregorio');
  if (reproductor) {
    reproductor.pause();
    reproductor.currentTime = 0;
  }
  tiempoSimuladoActual = 0;
  actualizarBarraReproductor(0, duracionSimuladaTotal);

  const btnPlay = document.getElementById('btn-play');
  if (btnPlay) btnPlay.textContent = '▶';
  const estadoAudio = document.getElementById('estado-audio-futuro');
  if (estadoAudio) estadoAudio.textContent = 'En pausa';
}

function prepararPantallaRitual() {
  const infoRitual = obtenerRitualActivo();
  const badge = document.getElementById('badge-ritual-emocion');
  const titulo = document.getElementById('titulo-ritual-actual');
  const desc = document.getElementById('descripcion-ritual-fisico');
  const imgRitual = document.getElementById('img-ritual-gregorio');

  if (badge) badge.textContent = nombreEmocionActual.toUpperCase();
  if (titulo) titulo.textContent = infoRitual.titulo;
  if (desc) desc.textContent = infoRitual.resumen;
  if (imgRitual && infoRitual.imagen) {
    imgRitual.src = encodeURI(infoRitual.imagen);
  }
}

function irA(idPantalla) {
  clearTimeout(temporizadorAvance);
  clearTimeout(temporizadorConteoDedos);
  clearTimeout(temporizadorReinicioMision);
  clearTimeout(temporizadorCierreGestoCaminito);
  clearTimeout(temporizadorClicsPC);
  dedosActivosCaminito.clear();
  maxDedosEnGestoCaminito = 0;
  clicsPCEnCaminito = 0;

  cancelAnimationFrame(animacionJuegoId);
  detenerNarracion();
  detenerReproductorRitual();
  if (idPantalla !== 'pantalla-camara') {
    detenerCamaraElefante();
  }

  if (idPantalla === 'pantalla-ritual') {
    prepararPantallaRitual();
  }

  cerrarModalFicha();
  cerrarModalMediacion();
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  const destino = document.getElementById(idPantalla);
  if (destino) destino.classList.add('activa');

  if (idPantalla === 'pantalla-dedos') {
    configurarZonaTactilCaminito();
  }
}

function abrirModalMediacion() {
  const modal = document.getElementById('modal-mediacion-adultos');
  if (modal) modal.classList.remove('oculto');
  const btnAudio = modal ? modal.querySelector('[data-audio-btn]') : null;
  reproducirAudioMediacion(btnAudio);
}

function cerrarModalMediacion(event) {
  if (!event || event.target.id === 'modal-mediacion-adultos') {
    detenerNarracion();
    const modal = document.getElementById('modal-mediacion-adultos');
    if (modal) modal.classList.add('oculto');
  }
}

function tocarGregorioInicio() {
  const imagen = document.getElementById('img-gregorio-inicio');
  if (imagen) {
    imagen.classList.remove('salto-gregorio');
    void imagen.offsetWidth;
    imagen.classList.add('salto-gregorio');
  }
}

function actualizarCaraIntensidad(cantidad, mostrarInicial = false) {
  const imgCara = document.getElementById('img-cara-intensidad');
  const etiqueta = document.getElementById('etiqueta-intensidad-dedos');
  if (!imgCara) return;

  const rutaBase = CARA_BASE_EMOCION[emocionActual] || CARA_BASE_EMOCION.triste;
  imgCara.src = encodeURI(rutaBase);
  imgCara.alt = `Gregorio ${nombreEmocionActual} nivel ${cantidad}`;

  imgCara.classList.remove('nivel-1', 'nivel-2', 'nivel-3', 'salto-gregorio');
  void imgCara.offsetWidth;
  imgCara.classList.add(`nivel-${cantidad}`, 'salto-gregorio');

  if (etiqueta) {
    etiqueta.textContent = mostrarInicial
      ? guiaResumenIntensidad(emocionActual)
      : textoIntensidadPorEmocion(cantidad, emocionActual);
  }
}

function seleccionarEmocion(clave, nombreBonito) {
  emocionActual = clave;
  nombreEmocionActual = nombreBonito;
  nivelActual = 1;
  dedosActivosCaminito.clear();
  maxDedosEnGestoCaminito = 0;
  clicsPCEnCaminito = 0;

  document.getElementById('badge-emocion').textContent = nombreBonito.toUpperCase();
  document.getElementById('numero-dedos').textContent = '?';
  const subguia = document.getElementById('subguia-como-poner-dedos');
  if (subguia) subguia.textContent = 'Pon 1, 2 o 3 deditos en la pantalla';

  actualizarCaraIntensidad(1, true);
  limpiarHuellasCamino();

  irA('pantalla-dedos');
}

function crearHuellaElefanteSVG(indice) {
  const huella = document.createElement('div');
  huella.className = 'huella-caminito';

  const posicionesCamino = [
    { x: 68,  y: 132 },
    { x: 162, y: 82  },
    { x: 256, y: 132 }
  ];

  const pos = posicionesCamino[indice] || { x: 162, y: 108 };
  huella.style.left = pos.x + 'px';
  huella.style.top = pos.y + 'px';

  huella.innerHTML = `
    <svg viewBox="0 0 110 110" width="64" height="64">
      <path d="M24 88 C18 72, 22 44, 34 34 C44 26, 66 26, 76 34 C88 44, 92 72, 86 88 C74 96, 36 96, 24 88 Z"
            fill="#fbcfe8" stroke="#db2777" stroke-width="4.5" stroke-linejoin="round"/>
      <ellipse cx="55" cy="67" rx="20" ry="14" fill="#fdf2f8" stroke="#db2777" stroke-width="2.5"/>
      <path d="M31 36 C33 27, 42 27, 44 35 Z" fill="#fffdf9" stroke="#db2777" stroke-width="3" stroke-linejoin="round"/>
      <path d="M49 32 C51 23, 59 23, 61 32 Z" fill="#fffdf9" stroke="#db2777" stroke-width="3" stroke-linejoin="round"/>
      <path d="M66 35 C68 27, 77 27, 79 36 Z" fill="#fffdf9" stroke="#db2777" stroke-width="3" stroke-linejoin="round"/>
    </svg>
  `;
  return huella;
}

function limpiarHuellasCamino() {
  const contenedor = document.getElementById('huellas-camino');
  if (contenedor) contenedor.innerHTML = '';
}

function obtenerRitualActivo() {
  const grupo = RITUALES_POR_EMOCION[emocionActual] || RITUALES_POR_EMOCION['triste'];
  return grupo[nivelActual] || grupo[1];
}

function aplicarPasoConteoDedos(paso, nivelFinal, contenedorHuellas) {
  const numEl = document.getElementById('numero-dedos');
  const orbeEl = document.getElementById('orbe-contador-dedos');
  const subguia = document.getElementById('subguia-como-poner-dedos');

  if (numEl) numEl.textContent = paso;
  if (orbeEl) {
    orbeEl.classList.remove('conteo-pulso');
    void orbeEl.offsetWidth;
    orbeEl.classList.add('conteo-pulso');
  }
  if (subguia) {
    subguia.textContent = textoIntensidadPorEmocion(paso, emocionActual);
  }

  actualizarCaraIntensidad(paso, false);

  if (contenedorHuellas) {
    contenedorHuellas.appendChild(crearHuellaElefanteSVG(paso - 1));
  }
  reproducirSonidoHuellita(paso - 1, nivelFinal);

  if (paso === nivelFinal) {
    prepararPantallaRitual();
    clearTimeout(temporizadorAvance);
    temporizadorAvance = setTimeout(() => {
      irA('pantalla-ritual');
    }, 1500);
  }
}

function registrarCaminoDedos(cantidad) {
  if (navigator.vibrate) {
    try { navigator.vibrate(40); } catch (e) {}
  }

  clearTimeout(temporizadorConteoDedos);
  clearTimeout(temporizadorAvance);

  nivelActual = Math.min(Math.max(cantidad, 1), 3);

  const contenedor = document.getElementById('huellas-camino');
  if (contenedor) contenedor.innerHTML = '';

  for (let paso = 1; paso <= nivelActual; paso++) {
    const retraso = (paso - 1) * 160;
    temporizadorConteoDedos = setTimeout(() => {
      aplicarPasoConteoDedos(paso, nivelActual, contenedor);
    }, retraso);
  }
}

function sincronizarConteoDedosCaminito() {
  const cantidadActual = Math.min(dedosActivosCaminito.size, 3);
  if (cantidadActual <= 0) return;

  if (cantidadActual > maxDedosEnGestoCaminito) {
    maxDedosEnGestoCaminito = cantidadActual;
    registrarCaminoDedos(maxDedosEnGestoCaminito);
  }
}

function configurarZonaTactilCaminito() {
  const zonaTactil = document.getElementById('zona-tactil');
  if (!zonaTactil || zonaTactil.dataset.listo) return;
  zonaTactil.dataset.listo = '1';

  zonaTactil.addEventListener('pointerdown', function (e) {
    e.preventDefault();

    if (e.pointerType === 'mouse') {
      clicsPCEnCaminito = (clicsPCEnCaminito % 3) + 1;
      maxDedosEnGestoCaminito = clicsPCEnCaminito;
      registrarCaminoDedos(clicsPCEnCaminito);

      clearTimeout(temporizadorClicsPC);
      temporizadorClicsPC = setTimeout(() => {
        clicsPCEnCaminito = 0;
      }, 1500);
      return;
    }

    clearTimeout(temporizadorCierreGestoCaminito);
    if (dedosActivosCaminito.size === 0) {
      maxDedosEnGestoCaminito = 0;
    }

    dedosActivosCaminito.add(e.pointerId);
    sincronizarConteoDedosCaminito();
  }, { passive: false });

  const liberarDedo = e => {
    if (e.pointerType === 'mouse') return;
    dedosActivosCaminito.delete(e.pointerId);
    if (dedosActivosCaminito.size === 0) {
      clearTimeout(temporizadorCierreGestoCaminito);
      temporizadorCierreGestoCaminito = setTimeout(() => {
        maxDedosEnGestoCaminito = 0;
      }, 220);
    }
  };

  zonaTactil.addEventListener('pointerup', liberarDedo, { passive: true });
  zonaTactil.addEventListener('pointercancel', liberarDedo, { passive: true });
}

function formatearSegundos(seg) {
  const s = Math.max(0, Math.floor(seg));
  const min = Math.floor(s / 60);
  const resto = s % 60;
  return `${min}:${resto < 10 ? '0' : ''}${resto}`;
}

function actualizarBarraReproductor(actual, total) {
  const dur = total && isFinite(total) && total > 0 ? total : duracionSimuladaTotal;
  const pct = Math.min(100, Math.max(0, (actual / dur) * 100));
  const barra = document.getElementById('barra-tiempo-audio');
  const tActual = document.getElementById('tiempo-actual-audio');
  const tTotal = document.getElementById('tiempo-total-audio');

  if (barra) barra.style.width = `${pct}%`;
  if (tActual) tActual.textContent = formatearSegundos(actual);
  if (tTotal) tTotal.textContent = formatearSegundos(dur);
}

function iniciarRelojSimulado() {
  clearInterval(simulacionAudioInterval);
  reproduciendoSimulado = true;
  const btnPlay = document.getElementById('btn-play');
  if (btnPlay) btnPlay.textContent = '⏸';

  simulacionAudioInterval = setInterval(() => {
    tiempoSimuladoActual += 0.25;
    if (tiempoSimuladoActual >= duracionSimuladaTotal) {
      tiempoSimuladoActual = 0;
      reproduciendoSimulado = false;
      clearInterval(simulacionAudioInterval);
      if (btnPlay) btnPlay.textContent = '▶';
      const estadoAudio = document.getElementById('estado-audio-futuro');
      if (estadoAudio) estadoAudio.textContent = 'En pausa';
    }
    actualizarBarraReproductor(tiempoSimuladoActual, duracionSimuladaTotal);
  }, 250);
}

function toggleAudioPropio() {
  if (!audiosActivados) return;
  detenerNarracion();
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend().catch(() => {});
  }

  const reproductor = document.getElementById('mi-audio-gregorio');
  const boton = document.getElementById('btn-play');
  const estadoAudio = document.getElementById('estado-audio-futuro');
  const infoRitual = obtenerRitualActivo();

  if (!reproductor) return;

  const rutaCodificada = infoRitual.audio ? encodeURI(infoRitual.audio) : '';

  if (reproductor.getAttribute('data-track') !== rutaCodificada) {
    reproductor.src = rutaCodificada;
    reproductor.setAttribute('data-track', rutaCodificada);
    reproductor.onloadedmetadata = () => {
      actualizarBarraReproductor(reproductor.currentTime, reproductor.duration);
    };
    reproductor.ontimeupdate = () => {
      actualizarBarraReproductor(reproductor.currentTime, reproductor.duration);
    };
    reproductor.onended = () => {
      if (boton) boton.textContent = '▶';
      if (estadoAudio) estadoAudio.textContent = 'En pausa';
      actualizarBarraReproductor(0, reproductor.duration);
    };
  }

  if (!reproductor.paused) {
    reproductor.pause();
    if (boton) boton.textContent = '▶';
    if (estadoAudio) estadoAudio.textContent = 'En pausa';
    return;
  }

  if (reproduciendoSimulado) {
    reproduciendoSimulado = false;
    clearInterval(simulacionAudioInterval);
    if (boton) boton.textContent = '▶';
    if (estadoAudio) estadoAudio.textContent = 'En pausa';
    return;
  }

  reproductor.play().then(() => {
    if (boton) boton.textContent = '⏸';
    if (estadoAudio) estadoAudio.textContent = 'Reproduciendo';
  }).catch(() => {
    if (estadoAudio) estadoAudio.textContent = 'Reproduciendo';
    iniciarRelojSimulado();
  });
}

function retrocederAudio() {
  const reproductor = document.getElementById('mi-audio-gregorio');
  if (reproductor && reproductor.duration) {
    reproductor.currentTime = Math.max(0, reproductor.currentTime - 5);
    actualizarBarraReproductor(reproductor.currentTime, reproductor.duration);
  } else {
    tiempoSimuladoActual = Math.max(0, tiempoSimuladoActual - 5);
    actualizarBarraReproductor(tiempoSimuladoActual, duracionSimuladaTotal);
  }
}

function adelantarAudio() {
  const reproductor = document.getElementById('mi-audio-gregorio');
  if (reproductor && reproductor.duration) {
    reproductor.currentTime = Math.min(reproductor.duration, reproductor.currentTime + 5);
    actualizarBarraReproductor(reproductor.currentTime, reproductor.duration);
  } else {
    tiempoSimuladoActual = Math.min(duracionSimuladaTotal, tiempoSimuladoActual + 5);
    actualizarBarraReproductor(tiempoSimuladoActual, duracionSimuladaTotal);
  }
}

function buscarPosicionAudio(event) {
  const barraFondo = event.currentTarget.querySelector('.barra-tiempo-fondo');
  if (!barraFondo) return;
  const rect = barraFondo.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));

  const reproductor = document.getElementById('mi-audio-gregorio');
  if (reproductor && reproductor.duration) {
    reproductor.currentTime = ratio * reproductor.duration;
    actualizarBarraReproductor(reproductor.currentTime, reproductor.duration);
  } else {
    tiempoSimuladoActual = ratio * duracionSimuladaTotal;
    actualizarBarraReproductor(tiempoSimuladoActual, duracionSimuladaTotal);
  }
}

function rellenarYMostrarFicha(info) {
  document.getElementById('ficha-titulo').textContent = info.titulo;
  document.getElementById('ficha-proposito').textContent = info.proposito;
  document.getElementById('ficha-materiales').textContent = info.materiales;
  document.getElementById('ficha-guion').textContent = info.guion;
  document.getElementById('ficha-acompanamiento').textContent = info.acompanamiento;

  const listaPasos = document.getElementById('ficha-pasos');
  listaPasos.innerHTML = '';
  info.pasos.forEach(paso => {
    const li = document.createElement('li');
    li.textContent = paso;
    listaPasos.appendChild(li);
  });

  document.getElementById('modal-ficha-ritual').classList.remove('oculto');
}

function mostrarAyudaPantalla(tipo) {
  if (tipo === 'juegos') {
    rellenarYMostrarFicha({
      titulo: "Juegos para las emociones",
      proposito: "Explorar actividades según la emoción y llenar la barra.",
      materiales: "Ninguno.",
      pasos: [
        "Lee o toca la bocina para escuchar la instrucción del juego.",
        "Realiza la actividad en la pantalla hasta llenar la barra al 100%.",
        "Cambia de emoción o juego cuando quieras."
      ],
      guion: "¡Juguemos juntos y llenemos la barra!",
      acompanamiento: "Acompañar al niño y conversar sobre cómo se siente."
    });
  }
}

function abrirModalFicha() {
  rellenarYMostrarFicha(obtenerRitualActivo());
}

function cerrarModalFicha(event) {
  if (!event || event.target.id === 'modal-ficha-ritual') {
    document.getElementById('modal-ficha-ritual').classList.add('oculto');
  }
}

function asegurarAudioCtx() {
  if (!audiosActivados) return null;
  clearTimeout(temporizadorSuspenderCtx);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function desbloquearAudioEnPrimerToque() {
  const desbloquear = () => {
    const audioNar = document.getElementById('audio-narracion-gregorio');
    if (audioNar && !audioNar.dataset.desbloqueado) {
      audioNar.dataset.desbloqueado = '1';
      audioNar.muted = true;
      audioNar.play().then(() => {
        audioNar.pause();
        audioNar.currentTime = 0;
        audioNar.muted = false;
      }).catch(() => {
        audioNar.muted = false;
      });
    }
  };
  document.addEventListener('pointerdown', desbloquear, { passive: true });
}

function reproducirSonidoClick(tipo = 'suave') {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;

    const ahora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (tipo === 'volver') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ahora);
      osc.frequency.exponentialRampToValueAtTime(290, ahora + 0.07);
    } else if (tipo === 'accion') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, ahora);
      osc.frequency.exponentialRampToValueAtTime(640, ahora + 0.065);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ahora);
      osc.frequency.exponentialRampToValueAtTime(700, ahora + 0.055);
    }

    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.exponentialRampToValueAtTime(0.075, ahora + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.09);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function activarSonidoEnBotones() {
  document.addEventListener('pointerdown', function (e) {
    const objetivo = e.target.closest('button, .tarjeta-emocion-magica, .tarjeta-menu-opcion');
    if (!objetivo || objetivo.disabled) return;

    if (
      objetivo.classList.contains('btn-audio-inicio') ||
      objetivo.classList.contains('btn-audio-mini') ||
      objetivo.hasAttribute('data-audio-btn') ||
      objetivo.hasAttribute('data-toggle-sonido-global') ||
      objetivo.id === 'btn-play'
    ) {
      return;
    }

    if (objetivo.classList.contains('btn-volver-unico') || objetivo.classList.contains('btn-cerrar-ficha')) {
      reproducirSonidoClick('volver');
    } else if (objetivo.classList.contains('btn-empezar-estilo') || objetivo.classList.contains('btn-disparar-foto')) {
      reproducirSonidoClick('accion');
    } else {
      reproducirSonidoClick('suave');
    }
  }, { capture: true, passive: true });
}

function reproducirSonidoHuellita(indiceHuella = 0, nivel = 1) {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;

    const notasNivel = [392.00, 440.00, 523.25];
    const freqBase = notasNivel[Math.min(indiceHuella, 2)] || 392.00;
    const inicio = ctx.currentTime + indiceHuella * 0.11;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqBase * (0.95 + nivel * 0.03), inicio);
    osc.frequency.exponentialRampToValueAtTime(freqBase * 1.25, inicio + 0.11);

    gain.gain.setValueAtTime(0.001, inicio);
    gain.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.17);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + 0.18);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoMisionCompleta() {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const acordes = [523.25, 659.25, 783.99, 1046.5];
    acordes.forEach((freq, idx) => {
      const inicio = ctx.currentTime + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, inicio);
      gain.gain.setValueAtTime(0.001, inicio);
      gain.gain.exponentialRampToValueAtTime(0.24, inicio + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.38);
    });
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirNotaEscala(indice) {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const item = ESCALA_DO_OCTAVA[indice] || ESCALA_DO_OCTAVA[0];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.48);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoBurbuja(dorada = false) {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const ahora = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const base = dorada ? 420 : 280 + Math.random() * 120;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, ahora);
    osc.frequency.exponentialRampToValueAtTime(base * 2.8, ahora + 0.11);

    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.exponentialRampToValueAtTime(0.32, ahora + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.14);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoAgua(esPompa = false) {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const ahora = ctx.currentTime;

    const duracion = esPompa ? 0.14 : 0.24;
    const bufferSize = Math.floor(ctx.sampleRate * duracion);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(esPompa ? 1500 : 1100 + Math.random() * 450, ahora);
    filter.Q.setValueAtTime(esPompa ? 2.4 : 1.3, ahora);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, ahora);
    noiseGain.gain.exponentialRampToValueAtTime(esPompa ? 0.24 : 0.34, ahora + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(ahora);
    noise.stop(ahora + duracion + 0.01);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    const f0 = esPompa ? 540 : 380 + Math.random() * 140;
    osc.frequency.setValueAtTime(f0, ahora);
    osc.frequency.exponentialRampToValueAtTime(f0 * (esPompa ? 1.7 : 0.68), ahora + 0.12);

    oscGain.gain.setValueAtTime(0.001, ahora);
    oscGain.gain.exponentialRampToValueAtTime(0.2, ahora + 0.015);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.15);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoMasaje() {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const ahora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, ahora);
    osc.frequency.exponentialRampToValueAtTime(460, ahora + 0.16);

    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.exponentialRampToValueAtTime(0.16, ahora + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.21);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoConstruir(progreso = 50) {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const ahora = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = 220 + (progreso / 100) * 180;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.45, ahora);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, ahora + 0.11);

    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.exponentialRampToValueAtTime(0.34, ahora + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.14);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function reproducirSonidoCamara() {
  if (!audiosActivados) return;
  try {
    const ctx = asegurarAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
    suspenderAudioCtxSiLibre();
  } catch (e) {}
}

function mostrarIntroJuegos() {
  const tarjeta = document.getElementById('tarjeta-intro-juegos');
  if (tarjeta) tarjeta.classList.remove('oculto');
}

function ocultarIntroJuegos() {
  const tarjeta = document.getElementById('tarjeta-intro-juegos');
  if (tarjeta) tarjeta.classList.add('oculto');
  detenerNarracion();
}

function reiniciarMision() {
  clearTimeout(temporizadorReinicioMision);
  progresoMision = 0;
  misionCompletada = false;
  notasTocadasEnMision.clear();
  pintarBarraMision();
}

function pintarBarraMision() {
  const barra = document.getElementById('barra-animo-gregorio');
  const textoPorcentaje = document.getElementById('texto-porcentaje-mision');
  const redondeado = Math.min(100, Math.round(progresoMision));

  if (barra) {
    barra.style.width = `${redondeado}%`;
  }
  if (textoPorcentaje) {
    textoPorcentaje.textContent = `${redondeado}%`;
  }
}

function setMensajePou(texto) {
  const el = document.getElementById('mensaje-pou-gregorio');
  if (el) el.textContent = texto;
}

function avanzarMision(delta, instruccionBase) {
  if (misionCompletada) return;
  progresoMision = Math.min(100, progresoMision + delta);
  pintarBarraMision();

  const guia = document.getElementById('guia-juego-dedos');
  if (progresoMision >= 100) {
    misionCompletada = true;
    reproducirSonidoMisionCompleta();
    if (guia) {
      guia.textContent = '¡Listo! Puedes seguir o elegir otra emoción.';
    }
    clearTimeout(temporizadorReinicioMision);
    temporizadorReinicioMision = setTimeout(() => {
      if (misionCompletada) {
        reiniciarMision();
        if (guia) {
          guia.textContent = instruccionBase || INSTRUCCIONES_JUEGO[juegoActual] || '';
        }
      }
    }, 1800);
  }
}

function abrirPantallaVideojuegos() {
  const juegoInicial = JUEGO_POR_EMOCION[emocionActual] || 'caricia';
  irA('pantalla-videojuegos');
  const btn = document.querySelector(`.selector-emociones-juego .arcade-btn[data-juego="${juegoInicial}"]`);
  seleccionarMinijuego(juegoInicial, btn);
  mostrarIntroJuegos();
}

function generarBurbujasPou(cantidad = 7) {
  burbujasFlotantes = [];
  for (let i = 0; i < cantidad; i++) {
    burbujasFlotantes.push({
      x: 45 + Math.random() * 235,
      y: 65 + Math.random() * 200,
      r: 18 + Math.random() * 10,
      vy: -0.45 - Math.random() * 0.45,
      fase: Math.random() * Math.PI * 2,
      dorada: i === 0
    });
  }
}

function seleccionarMinijuego(tipo, elementoBoton = null) {
  detenerNarracion();

  juegoActual = tipo;
  document.querySelectorAll('.selector-emociones-juego .arcade-btn').forEach(b => b.classList.remove('activo'));
  if (elementoBoton) elementoBoton.classList.add('activo');

  reiniciarMision();
  obtenerImagenJuego(tipo);

  const guia = document.getElementById('guia-juego-dedos');
  gotasAgua = [];
  salpicadurasAgua = [];
  pompasJabon = [];
  chispasLimpieza = [];
  anillosExplosion = [];
  capasCrema = [];
  notasFlotantes = [];
  notaActivaBaqueta = 0;
  pulsoNota.fill(0);
  progresoCasita = 0;
  chorroTrompaFrames = 0;
  pulsoTrompa = 0;

  if (tipo === 'ducha') {
    pompasJabon = [
      { x: 145, y: 195, r: 12 },
      { x: 178, y: 215, r: 14 },
      { x: 160, y: 175, r: 10 }
    ];
  } else if (tipo === 'burbujas') {
    generarBurbujasPou(7);
  }

  if (guia) {
    guia.textContent = INSTRUCCIONES_JUEGO[tipo] || '';
  }
  setMensajePou(FRASE_EMOCION_JUEGO[tipo] || '');

  iniciarLoopJuego();
}

function obtenerZonaTrompa(canvas) {
  return {
    x: canvas.width * 0.75,
    y: canvas.height * 0.25,
    radio: 24
  };
}

function activarChorroTrompa(canvas, intensidad = 1) {
  chorroTrompaFrames = 26;
  pulsoTrompa = 10;
  const trompa = obtenerZonaTrompa(canvas);

  for (let i = 0; i < 8 * intensidad; i++) {
    gotasAgua.push({
      x: trompa.x + (Math.random() * 8 - 4),
      y: trompa.y + 3,
      vx: 0.2 + Math.random() * 1.0,
      vy: 1.5 + Math.random() * 1.9,
      vida: 46
    });
  }
}

function trazarRectanguloRedondeado(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function dibujarGregorioImagen(ctx, canvas, claveJuego, opciones = {}) {
  const { respira = 0 } = opciones;
  const img = obtenerImagenJuego(claveJuego);
  const escala = 1 + Math.sin(respira) * 0.015 - pulsoTrompa * 0.003;

  ctx.save();
  trazarRectanguloRedondeado(ctx, 0, 0, canvas.width, canvas.height, 18);
  ctx.clip();

  if (img && img.complete && img.naturalWidth > 0) {
    const ratio = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const drawW = img.naturalWidth * ratio * escala;
    const drawH = img.naturalHeight * ratio * escala;
    ctx.drawImage(
      img,
      (canvas.width - drawW) / 2,
      (canvas.height - drawH) / 2,
      drawW,
      drawH
    );
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(1, '#dcfce7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.restore();

  if (claveJuego === 'ducha') {
    const trompa = obtenerZonaTrompa(canvas);
    ctx.save();
    ctx.strokeStyle = chorroTrompaFrames > 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(trompa.x, trompa.y, trompa.radio * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function obtenerPuntosEscala() {
  return [
    { x: 34,  y: 90, idx: 0 },
    { x: 64,  y: 66, idx: 1 },
    { x: 96,  y: 48, idx: 2 },
    { x: 132, y: 38, idx: 3 },
    { x: 182, y: 38, idx: 4 },
    { x: 218, y: 48, idx: 5 },
    { x: 250, y: 66, idx: 6 },
    { x: 284, y: 90, idx: 7 }
  ];
}

function manejarToqueJuego(clientX, clientY, esArrastre = false) {
  const canvas = document.getElementById('canvas-juego-dedos');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  const instruccionBase = INSTRUCCIONES_JUEGO[juegoActual] || '';
  const fraseEmocion = FRASE_EMOCION_JUEGO[juegoActual] || '';

  if (juegoActual === 'ducha') {
    const trompa = obtenerZonaTrompa(canvas);
    const tocoTrompa = Math.hypot(x - trompa.x, y - trompa.y) <= trompa.radio + 14;

    if (tocoTrompa || !esArrastre) {
      activarChorroTrompa(canvas, tocoTrompa ? 1.4 : 1);
      reproducirSonidoAgua(false);
      avanzarMision(12, instruccionBase);
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch (e) {}
      }
    } else if (chorroTrompaFrames > 0) {
      activarChorroTrompa(canvas, 0.7);
    }

    pompasJabon = pompasJabon.filter(p => {
      const lejos = Math.hypot(x - p.x, y - p.y) > p.r + 18;
      if (!lejos) {
        reproducirSonidoAgua(true);
        avanzarMision(10, instruccionBase);
        for (let k = 0; k < 6; k++) {
          chispasLimpieza.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            vida: 22
          });
        }
      }
      return lejos;
    });
  } else if (juegoActual === 'burbujas') {
    burbujasFlotantes.forEach(b => {
      if (Math.hypot(x - b.x, y - b.y) <= b.r + 14) {
        anillosExplosion.push({
          x: b.x,
          y: b.y,
          r: b.r * 0.6,
          color: b.dorada ? '#f59e0b' : '#0284c7',
          vida: 20
        });
        reproducirSonidoBurbuja(b.dorada);
        b.y = canvas.height + 25;
        b.x = 45 + Math.random() * 235;
        avanzarMision(14, instruccionBase);
        if (navigator.vibrate) {
          try { navigator.vibrate(20); } catch (e) {}
        }
      }
    });
  } else if (juegoActual === 'caricia') {
    capasCrema.push({
      x,
      y,
      r: 18,
      alpha: 0.72
    });
    if (capasCrema.length > 55) capasCrema.shift();
    if (!esArrastre || Math.random() < 0.25) {
      reproducirSonidoMasaje();
    }
    avanzarMision(esArrastre ? 4 : 8, instruccionBase);
  } else if (juegoActual === 'casita') {
    const actual = CONSTRUCCIONES_DISPONIBLES[indiceConstruccionActual];
    if (!esArrastre) {
      progresoCasita = Math.min(100, progresoCasita + 20);
      reproducirSonidoConstruir(progresoCasita);
      avanzarMision(20, instruccionBase);

      if (progresoCasita >= 100) {
        indiceConstruccionActual = (indiceConstruccionActual + 1) % CONSTRUCCIONES_DISPONIBLES.length;
        const siguiente = CONSTRUCCIONES_DISPONIBLES[indiceConstruccionActual];
        progresoCasita = 0;
        setMensajePou(`${fraseEmocion} (${siguiente.nombre})`);
      } else {
        setMensajePou(`${fraseEmocion} (${actual.nombre} ${progresoCasita}%)`);
      }
      if (navigator.vibrate) {
        try { navigator.vibrate(18); } catch (e) {}
      }
    }
  } else if (juegoActual === 'ritmo' && !esArrastre) {
    const puntos = obtenerPuntosEscala();
    puntos.forEach((pt, idx) => {
      if (Math.hypot(x - pt.x, y - pt.y) <= 21) {
        notaActivaBaqueta = idx;
        pulsoNota[idx] = 18;
        reproducirNotaEscala(idx);
        notasTocadasEnMision.add(idx);

        const avancePorNota = 100 / ESCALA_DO_OCTAVA.length;
        avanzarMision(avancePorNota, instruccionBase);

        const infoNota = ESCALA_DO_OCTAVA[idx];
        notasFlotantes.push({
          x: pt.x,
          y: Math.max(18, pt.y - 16),
          vy: -0.9,
          texto: `♪ ${infoNota.nota}`,
          vida: 34
        });
        if (navigator.vibrate) {
          try { navigator.vibrate(18); } catch (e) {}
        }
      }
    });
  }
}

function configurarEventosCanvasJuego() {
  const canvas = document.getElementById('canvas-juego-dedos');
  if (!canvas || canvas.dataset.listo) return;
  canvas.dataset.listo = '1';

  canvas.addEventListener('pointerdown', e => {
    punteroActivo = true;
    manejarToqueJuego(e.clientX, e.clientY, false);
  });

  canvas.addEventListener('pointermove', e => {
    if (!punteroActivo && e.pointerType === 'mouse') return;
    manejarToqueJuego(e.clientX, e.clientY, true);
  });

  window.addEventListener('pointerup', () => {
    punteroActivo = false;
  });
}

function iniciarLoopJuego() {
  configurarEventosCanvasJuego();
  cancelAnimationFrame(animacionJuegoId);

  const canvas = document.getElementById('canvas-juego-dedos');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function frame() {
    tiempoJuego += 0.04;
    if (chorroTrompaFrames > 0) chorroTrompaFrames--;
    if (pulsoTrompa > 0) pulsoTrompa--;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarGregorioImagen(ctx, canvas, juegoActual, {
      respira: tiempoJuego
    });

    if (juegoActual === 'ducha') {
      if (chorroTrompaFrames > 0 && chorroTrompaFrames % 2 === 0) {
        const trompa = obtenerZonaTrompa(canvas);
        gotasAgua.push({
          x: trompa.x + (Math.random() * 8 - 4),
          y: trompa.y + 3,
          vx: 0.2 + Math.random() * 1.0,
          vy: 1.5 + Math.random() * 1.6,
          vida: 44
        });
      }

      const pisoAgua = canvas.height - 18;
      gotasAgua.forEach(g => {
        g.x += g.vx;
        g.y += g.vy;
        g.vy += 0.14;
        g.vida--;

        if (g.y >= pisoAgua) {
          salpicadurasAgua.push({ x: g.x, y: pisoAgua, r: 2, vida: 14 });
          g.vida = 0;
        }

        ctx.fillStyle = `rgba(2, 132, 199, ${Math.max(0, g.vida / 44)})`;
        ctx.beginPath();
        ctx.arc(g.x, g.y, 4.3, 0, Math.PI * 2);
        ctx.fill();
      });
      gotasAgua = gotasAgua.filter(g => g.vida > 0);

      salpicadurasAgua.forEach(s => {
        s.r += 1.1;
        s.vida--;
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, s.vida / 14)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 1.5, s.r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      salpicadurasAgua = salpicadurasAgua.filter(s => s.vida > 0);

      pompasJabon.forEach((p, idx) => {
        const wob = Math.sin(tiempoJuego * 2 + idx) * 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x + wob, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      chispasLimpieza.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vida--;
        ctx.fillStyle = `rgba(244, 114, 182, ${Math.max(0, c.vida / 22)})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      chispasLimpieza = chispasLimpieza.filter(c => c.vida > 0);
    } else if (juegoActual === 'burbujas') {
      burbujasFlotantes.forEach(b => {
        b.y += b.vy;
        b.x += Math.sin(tiempoJuego * 1.4 + b.fase) * 0.7;
        if (b.y < -25) {
          b.y = canvas.height + 20;
          b.x = 45 + Math.random() * 235;
        }

        ctx.fillStyle = b.dorada ? 'rgba(253, 230, 138, 0.72)' : 'rgba(252, 231, 243, 0.78)';
        ctx.strokeStyle = b.dorada ? '#f59e0b' : '#f472b6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      });

      anillosExplosion.forEach(a => {
        a.r += 1.6;
        a.vida--;
        ctx.strokeStyle = a.color;
        ctx.globalAlpha = Math.max(0, a.vida / 20);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      anillosExplosion = anillosExplosion.filter(a => a.vida > 0);
    } else if (juegoActual === 'caricia') {
      capasCrema.forEach(c => {
        c.alpha -= 0.008;
        c.r += 0.12;
        if (c.alpha > 0) {
          ctx.fillStyle = `rgba(255, 251, 240, ${c.alpha})`;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(249, 168, 212, ${c.alpha * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
      capasCrema = capasCrema.filter(c => c.alpha > 0);
    } else if (juegoActual === 'casita') {
      const p = progresoCasita / 100;
      const actual = CONSTRUCCIONES_DISPONIBLES[indiceConstruccionActual];
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = `${actual.color}88`;
      ctx.lineWidth = 3.5;

      if (indiceConstruccionActual === 0) {
        if (p > 0.05) {
          const hPared = 90 * Math.min(1, p / 0.5);
          ctx.beginPath();
          ctx.rect(75, 240 - hPared, 175, hPared);
          ctx.fill();
          ctx.stroke();
        }
        if (p > 0.5) {
          const t = (p - 0.5) / 0.5;
          ctx.beginPath();
          ctx.moveTo(62, 150);
          ctx.lineTo(162, 150 - 70 * t);
          ctx.lineTo(262, 150);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (indiceConstruccionActual === 1) {
        const pisos = Math.floor(p * 4);
        for (let i = 0; i < pisos; i++) {
          ctx.beginPath();
          ctx.rect(102, 205 - i * 35, 120, 29);
          ctx.fill();
          ctx.stroke();
        }
      } else {
        if (p > 0.05) {
          ctx.beginPath();
          ctx.arc(162, 235, 90 * Math.min(1, p), Math.PI, 0);
          ctx.lineWidth = 14;
          ctx.stroke();
        }
      }
    } else if (juegoActual === 'ritmo') {
      const puntos = obtenerPuntosEscala();
      puntos.forEach((pt, idx) => {
        if (pulsoNota[idx] > 0) pulsoNota[idx]--;
        const radio = pulsoNota[idx] > 0 ? 18 : 14.5;
        const infoNota = ESCALA_DO_OCTAVA[idx];
        const yaTocada = notasTocadasEnMision.has(idx);

        ctx.fillStyle = pulsoNota[idx] > 0 ? '#fde68a' : (yaTocada ? '#fbcfe8' : '#ffffff');
        ctx.strokeStyle = '#332742';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#332742';
        ctx.font = 'bold 9.5px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(infoNota.nota, pt.x, pt.y);
      });

      notasFlotantes.forEach(n => {
        n.y += n.vy;
        n.vida--;
        ctx.globalAlpha = Math.max(0, n.vida / 34);
        ctx.fillStyle = '#332742';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.texto, n.x, n.y);
        ctx.globalAlpha = 1;
      });
      notasFlotantes = notasFlotantes.filter(n => n.vida > 0);

      const puntoBaqueta = obtenerPuntosEscala()[notaActivaBaqueta] || obtenerPuntosEscala()[0];
      const golpe = pulsoNota[notaActivaBaqueta] > 0 ? -4 : 0;

      ctx.save();
      ctx.translate(puntoBaqueta.x + 8, puntoBaqueta.y - 6 + golpe);
      ctx.rotate(-0.55);
      ctx.strokeStyle = '#8c6239';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-22, 24);
      ctx.lineTo(0, 0);
      ctx.stroke();

      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#332742';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    animacionJuegoId = requestAnimationFrame(frame);
  }

  frame();
}

function mostrarIntroFotos() {
  const tarjeta = document.getElementById('tarjeta-intro-fotos');
  if (tarjeta) tarjeta.classList.remove('oculto');
}

function ocultarIntroFotos() {
  const tarjeta = document.getElementById('tarjeta-intro-fotos');
  if (tarjeta) tarjeta.classList.add('oculto');
  detenerNarracion();
}

function obtenerEmocionCamaraActiva() {
  return (
    FOTOS_GREGORIO_GALERIA.find(f => f.id === fotoGregorioSeleccionadaId) ||
    FOTOS_GREGORIO_GALERIA[0]
  );
}

function precargarGaleriaGregorio() {
  FOTOS_GREGORIO_GALERIA.forEach(item => {
    if (!imagenesGaleriaCargadas[item.id]) {
      const img = new Image();
      img.decoding = 'async';
      img.src = encodeURI(item.src);
      imagenesGaleriaCargadas[item.id] = img;
    }
  });
  if (!imagenGregorioCamara) {
    imagenGregorioCamara = imagenesGaleriaCargadas[fotoGregorioSeleccionadaId];
  }
}

function actualizarCirculoGuiaGregorio() {
  const activa = obtenerEmocionCamaraActiva();
  const imgCirculo = document.getElementById('img-guia-gregorio-circulo');
  const labelCirculo = document.getElementById('etiqueta-guia-gregorio');
  const circulo = document.getElementById('circulo-guia-gregorio');

  const imgFotoLogo = document.getElementById('img-logo-foto-capturada');
  const labelFotoLogo = document.getElementById('etiqueta-logo-foto-capturada');

  if (imgCirculo) {
    imgCirculo.src = encodeURI(activa.src);
    imgCirculo.alt = `Gregorio ${activa.nombre}`;
  }
  if (labelCirculo) {
    labelCirculo.textContent = activa.nombre.toUpperCase();
  }
  if (imgFotoLogo) {
    imgFotoLogo.src = encodeURI(activa.src);
    imgFotoLogo.alt = `Gregorio ${activa.nombre}`;
  }
  if (labelFotoLogo) {
    labelFotoLogo.textContent = activa.nombre.toUpperCase();
  }

  if (circulo) {
    circulo.classList.add('salto-gregorio');
    setTimeout(() => circulo.classList.remove('salto-gregorio'), 420);
  }
}

function alternarTamanoGuiaGregorio() {
  const circulo = document.getElementById('circulo-guia-gregorio');
  if (!circulo) return;
  circulo.classList.toggle('grande');
  tamanoGregorioCamara = circulo.classList.contains('grande') ? 128 : 108;
  reproducirSonidoBurbuja(false);
}

function actualizarGuiaImitacionCamara() {
  const estado = document.getElementById('estado-camara-texto');
  const panel = document.getElementById('panel-foto-capturada');
  if (!estado) return;
  if (panel && !panel.classList.contains('oculto')) {
    estado.textContent = '¡Foto lista! Toca Descargar';
    return;
  }
  const activa = obtenerEmocionCamaraActiva();
  estado.textContent = activa.guia;
  actualizarCirculoGuiaGregorio();
}

function renderizarGaleriaGregorio() {
  precargarGaleriaGregorio();
  const galeria = document.getElementById('galeria-gregorio-subidas');
  if (!galeria) return;
  galeria.innerHTML = '';

  FOTOS_GREGORIO_GALERIA.forEach(item => {
    const tarjeta = document.createElement('button');
    tarjeta.type = 'button';
    tarjeta.className = 'tarjeta-foto-gregorio' + (item.id === fotoGregorioSeleccionadaId ? ' activa' : '');
    tarjeta.onclick = () => {
      seleccionarFotoGregorioGaleria(item.id);
    };

    const img = document.createElement('img');
    img.src = encodeURI(item.src);
    img.alt = item.nombre;

    const label = document.createElement('small');
    label.textContent = item.nombre;

    tarjeta.appendChild(img);
    tarjeta.appendChild(label);
    galeria.appendChild(tarjeta);
  });

  actualizarGuiaImitacionCamara();
}

function seleccionarFotoGregorioGaleria(id) {
  const encontrada = FOTOS_GREGORIO_GALERIA.find(f => f.id === id);
  if (!encontrada) return;
  detenerNarracion();
  fotoGregorioSeleccionadaId = encontrada.id;
  imagenGregorioCamara = imagenesGaleriaCargadas[encontrada.id];
  reproducirSonidoBurbuja(false);
  renderizarGaleriaGregorio();
}

function abrirPantallaCamara() {
  irA('pantalla-camara');
  volverCamaraEnVivo();
  renderizarGaleriaGregorio();
  iniciarCamaraElefante();
  mostrarIntroFotos();
}

function detenerCamaraElefante() {
  cancelAnimationFrame(animacionCamaraId);
  if (streamCamara) {
    streamCamara.getTracks().forEach(track => track.stop());
    streamCamara = null;
  }
  const video = document.getElementById('video-camara-elefante');
  if (video && video.srcObject) {
    video.srcObject = null;
  }
}

async function iniciarCamaraElefante() {
  const video = document.getElementById('video-camara-elefante');
  detenerCamaraElefante();

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        streamCamara = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' }, width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false
        });
      } catch (e1) {
        streamCamara = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (video && streamCamara) {
        video.srcObject = streamCamara;
        await video.play().catch(() => {});
      }
    }
  } catch (err) {
    streamCamara = null;
  }

  actualizarGuiaImitacionCamara();
  configurarEventosCanvasCamara();
  iniciarLoopCamara();
}

function configurarEventosCanvasCamara() {
  const canvas = document.getElementById('canvas-camara-elefante');
  if (!canvas || canvas.dataset.listo) return;
  canvas.dataset.listo = '1';

  const actualizarPos = e => {
    const rect = canvas.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const rawY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    posGregorioCamaraX = Math.min(canvas.width - 42, Math.max(42, rawX));
    posGregorioCamaraY = Math.min(canvas.height - 42, Math.max(42, rawY));
  };

  canvas.addEventListener('pointerdown', e => {
    actualizarPos(e);
    arrastrandoGregorio = true;
  });

  canvas.addEventListener('pointermove', e => {
    if (!arrastrandoGregorio) return;
    actualizarPos(e);
  });

  window.addEventListener('pointerup', () => {
    arrastrandoGregorio = false;
  });
}

function dibujarGregorioEnCanvas(ctx, x, y, t, conMovimiento = true) {
  precargarGaleriaGregorio();
  const imgActual = imagenGregorioCamara || imagenesGaleriaCargadas[fotoGregorioSeleccionadaId];
  if (!imgActual || !imgActual.complete || imgActual.naturalWidth <= 0) return;

  const reboteY = conMovimiento ? Math.sin(t * 2.5) * 3 : 0;
  const ratio = imgActual.naturalHeight / imgActual.naturalWidth;
  const w = tamanoGregorioCamara;
  const h = w * ratio;

  ctx.save();
  ctx.translate(x, y + reboteY);
  try {
    ctx.drawImage(imgActual, -w / 2, -h / 2, w, h);
  } catch (e) {}
  ctx.restore();
}

function dibujarFondoCamaraOEscenario(ctx, width, height, video, permitirVideo = true) {
  let videoDibujado = false;
  if (permitirVideo && video && video.readyState >= 2 && video.videoWidth > 0 && streamCamara) {
    try {
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      const ratio = Math.max(width / video.videoWidth, height / video.videoHeight);
      const drawW = video.videoWidth * ratio;
      const drawH = video.videoHeight * ratio;
      ctx.drawImage(video, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      ctx.restore();
      videoDibujado = true;
    } catch (e) {
      videoDibujado = false;
    }
  }

  if (!videoDibujado) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.68, '#fef3c7');
    grad.addColorStop(0.68, '#dcfce7');
    grad.addColorStop(1, '#86efac');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(252, 211, 77, 0.9)';
    ctx.beginPath();
    ctx.arc(54, 52, 24, 0, Math.PI * 2);
    ctx.fill();

    const activa = obtenerEmocionCamaraActiva();
    ctx.fillStyle = '#332742';
    ctx.font = 'bold 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(activa.guia, width / 2, 26);
  }
}

function iniciarLoopCamara() {
  cancelAnimationFrame(animacionCamaraId);
  const canvas = document.getElementById('canvas-camara-elefante');
  const video = document.getElementById('video-camara-elefante');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function frame() {
    tiempoCamara += 0.04;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarFondoCamaraOEscenario(ctx, canvas.width, canvas.height, video, true);
    dibujarGregorioEnCanvas(ctx, posGregorioCamaraX, posGregorioCamaraY, tiempoCamara, true);
    animacionCamaraId = requestAnimationFrame(frame);
  }

  frame();
}

function tomarFotoElefante() {
  const video = document.getElementById('video-camara-elefante');
  const canvasVivo = document.getElementById('canvas-camara-elefante');
  const panel = document.getElementById('panel-foto-capturada');
  const img = document.getElementById('img-foto-tomada');
  const enlace = document.getElementById('enlace-descarga-foto');
  const estado = document.getElementById('estado-camara-texto');

  reproducirSonidoCamara();
  actualizarCirculoGuiaGregorio();

  const fotoCanvas = document.createElement('canvas');
  fotoCanvas.width = 325;
  fotoCanvas.height = 295;
  const fctx = fotoCanvas.getContext('2d');

  dibujarFondoCamaraOEscenario(fctx, fotoCanvas.width, fotoCanvas.height, video, true);
  dibujarGregorioEnCanvas(fctx, posGregorioCamaraX, posGregorioCamaraY, tiempoCamara, false);

  let dataUrl = '';
  try {
    dataUrl = fotoCanvas.toDataURL('image/png');
  } catch (e) {
    try {
      const respaldoCanvas = document.createElement('canvas');
      respaldoCanvas.width = 325;
      respaldoCanvas.height = 295;
      const rctx = respaldoCanvas.getContext('2d');
      dibujarFondoCamaraOEscenario(rctx, 325, 295, video, false);
      if (canvasVivo) {
        rctx.drawImage(canvasVivo, 0, 0, 325, 295);
      }
      dataUrl = respaldoCanvas.toDataURL('image/png');
    } catch (e2) {
      dataUrl = '';
    }
  }

  if (!dataUrl) return;

  ultimaFotoDataUrl = dataUrl;

  if (img) img.src = dataUrl;
  if (enlace) {
    enlace.href = dataUrl;
    enlace.download = 'gregorio-foto.png';
  }
  if (panel) panel.classList.remove('oculto');
  if (estado) estado.textContent = '¡Foto lista! Toca Descargar';
}

function volverCamaraEnVivo() {
  const panel = document.getElementById('panel-foto-capturada');
  if (panel) panel.classList.add('oculto');
  actualizarGuiaImitacionCamara();
}

function descargarFotoElefante() {
  if (!ultimaFotoDataUrl) {
    tomarFotoElefante();
  }

  const enlace = document.getElementById('enlace-descarga-foto');
  const estado = document.getElementById('estado-camara-texto');

  if (enlace && ultimaFotoDataUrl) {
    enlace.href = ultimaFotoDataUrl;
    enlace.download = 'gregorio-foto.png';
    enlace.click();
  }

  if (estado) {
    estado.textContent = '¡Foto guardada!';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const btnComenzar = document.getElementById('btn-comenzar');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', function (e) {
      e.stopPropagation();
      irA('pantalla-menu');
    });
  }
  precargarAudiosYImagenes();
  desbloquearAudioEnPrimerToque();
  configurarZonaTactilCaminito();
  activarSonidoEnBotones();
  activarBloqueosMovilYCopia();
});