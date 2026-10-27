import type { Dictionary } from "./dictionary";

export const es: Dictionary = {
  meta: {
    title: "Cata — Tu cava, explicada.",
    description:
      "Apunta la cámara a una etiqueta, un plato o una pregunta. Cata te dice qué abrir, incluso una botella que ya tienes. Pronto en iPhone.",
    ogDescription:
      "Apunta la cámara a una etiqueta, un plato o una pregunta. Cata te dice qué abrir, incluso una botella que ya tienes.",
    ogAlt: "Cata — Tu cava, explicada. Una botella de vino tinto y una copa bajo la luz de la ventana.",
  },
  header: {
    home: "Inicio de Cata",
    sections: "Secciones",
    language: "Idioma",
    english: "English",
    spanish: "Español",
    join: "Únete a la lista",
    joinShort: "Únete",
    nav: {
      scan: "Escanear",
      pair: "Maridar",
      ask: "Preguntar",
      cellar: "Cava",
    },
  },
  footer: {
    home: "Inicio de Cata",
    tagline: "Tu cava, explicada.",
    sections: "Pie de página",
    legal: "Legal",
    scan: "Escanear",
    pair: "Maridar",
    ask: "Preguntar",
    cellar: "Cava",
    waitlist: "Lista de espera",
    privacy: "Privacidad",
    terms: "Términos",
    rights: "© 2026 Cata. Disfruta con responsabilidad.",
  },
  form: {
    label: "Correo electrónico",
    placeholder: "tu@correo.com",
    join: "Únete a la lista",
    joinShort: "Únete",
    sending: "Enviando…",
    done: "Listo",
    success: "Ya estás dentro. Te escribiremos cuando Cata esté lista para servir.",
    promise: "Un correo cuando Cata esté lista. Nada de spam.",
    privacy: "Privacidad",
    errors: {
      rate_limited: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
      invalid: "Ese correo no parece válido.",
      failed: "No pudimos guardarlo. Inténtalo de nuevo.",
    },
  },
  hero: {
    soon: "Pronto en iPhone",
    line1: "Tu cava,",
    line2: "explicada.",
    body: "Apunta la cámara a una etiqueta, un plato o una pregunta. Cata te dice qué abrir, incluso una botella que ya tienes.",
    scroll: "Desliza",
    light: "Mueve el cursor para cambiar la luz",
  },
  scan: {
    index: "01 — Escanear",
    title: "Escanea una botella.",
    accent: "Conócela al instante.",
    body: "Apunta la cámara a la etiqueta y verás qué vino es, a qué sabe y con qué maridarlo.",
    points: [
      {
        title: "Encuentra la botella por ti",
        body: "La detección en vivo encuadra la etiqueta antes de que dispares.",
      },
      {
        title: "Una botella o toda la repisa",
        body: "El modo Varias botellas marca todas las botellas de la toma a la vez.",
      },
      {
        title: "Honesta con lo que sabe",
        body: "El perfil de sabor y las notas se marcan siempre que Cata los estima.",
      },
    ],
  },
  features: {
    title: "Marídalo. Pregúntale.",
    accent: "Guárdalo.",
    body: "Escanear es solo el principio. Cata recuerda cada botella que guardas, así que sus respuestas salen de tu propia cava.",
    pair: {
      index: "02 — Maridar",
      title: "El vino ideal para tu comida.",
      body: "Tómale foto al plato y Cata elige una botella de tu propia cava.",
      imageAlt: "Bistec con papas fritas en un plato blanco",
    },
    ask: {
      index: "03 — Preguntar",
      title: "Pregúntale lo que sea.",
      body: "Qué abrir esta noche, qué comprar, qué va con qué.",
    },
    cellar: {
      index: "04 — Cava",
      title: "Guárdalo en tu cava.",
      body: "Cada botella que agregas se guarda, se puede buscar y queda ordenada en carpetas.",
    },
  },
  closing: {
    eyebrow: "La lista de espera está abierta",
    line1: "¿Qué abro",
    line2: "esta noche?",
    body: "Cata llega pronto al iPhone. Deja tu correo y te avisaremos en cuanto puedas preguntarle por tu cuenta.",
  },
  ui: {
    tabs: { home: "Inicio", ask: "Preguntar", pair: "Maridar", cellar: "Cava" },
    camera: {
      found: "Botella encontrada",
      instruction: "Apunta a una etiqueta de vino",
      one: "Una botella",
      many: "Varias botellas",
    },
    result: {
      title: "Vino identificado",
      region: "Valle de Guadalupe, Baja California, México",
      fix: "¿No es correcto? Corrige los datos",
      taste: "Perfil de sabor",
      notesTitle: "Notas de cata",
      notes:
        "De entrada, mora y grosella negra; luego violeta, pimienta negra y un toque de vainilla por sus 12 meses en roble americano.",
      estimate: "Estimación de Cata a partir de la etiqueta, sin verificar con una base de datos de críticos.",
      pairs: "Marida bien con",
      tasteLabels: ["Cuerpo", "Acidez", "Tanino", "Dulzor"],
      chips: ["Carne asada", "Tacos al pastor", "Costillas BBQ"],
    },
    pair: {
      dish: "Steak frites",
      vibe: "A la parrilla · Intenso y mantequilloso",
      open: "Para abrir de tu cava",
      reason:
        "Su mora y pimienta negra van con lo dorado del bistec, y el tanino corta la mantequilla de hierbas y las papas.",
      saw: "Lo que vio Cata",
      chips: ["Bistec a la parrilla", "Mantequilla de hierbas", "Papas fritas", "Cebollín"],
    },
    ask: {
      question: "¿Qué abro esta noche?",
      answer:
        "Abre el {wine} esta noche. Ya está en su punto, y su mora y pimienta negra son ideales para un bistec sellado.",
      follows: ["¿Con qué más marida?", "¿Cuándo abro el Malbec?"],
      continue: "Seguir en el chat",
    },
    cellar: {
      all: "Todos los vinos",
      folders: "Carpetas",
      search: "Busca en tu cava",
      count: "3 vinos",
      sort: "Recién agregados",
    },
  },
  legal: {
    updated: "Última actualización: {date}",
    privacyLink: "aviso de privacidad",
  },
  notFound: {
    title: "Página no encontrada — Cata",
    heading: "Aquí no hay nada que servir.",
    body: "La página que buscas no existe o cambió de lugar.",
    home: "Volver al inicio",
  },
  privacy: {
    title: "Aviso de privacidad — Cata",
    description: "Qué guarda Cata cuando te unes a la lista de espera y cómo pedir que lo borre.",
    heading: "Aviso de privacidad.",
    lede: "Al unirte a la lista nos das tu correo y nada más. Lo usamos para avisarte cuando Cata esté lista, y lo borramos cuando nos lo pidas.",
    sections: [
      {
        title: "Qué recopilamos",
        blocks: [
          { p: "Cuando te unes a la lista de espera, guardamos:" },
          { ul: ["La dirección de correo que escribiste.", "El momento en que te uniste."] },
          {
            p: "No pedimos tu nombre y este sitio no crea ninguna cuenta. Un campo oculto del formulario detecta registros automáticos; lo que contiene se descarta y nunca se guarda.",
          },
          {
            p: "Para que el formulario no se sature, contamos cuántos intentos llegan desde una misma dirección de red y los frenamos después de unos cuantos en un minuto. Ese conteo vive en memoria y no se guarda con tu correo.",
          },
        ],
      },
      {
        title: "Cómo lo usamos",
        blocks: [
          {
            p: "Usamos tu correo para escribirte cuando Cata se pueda descargar. El sitio promete un solo correo, y lo cumplimos: no usamos la lista para un boletín, para ofertas ni para nada más.",
          },
          { p: "Si nos escribes, usamos tu dirección para responderte." },
        ],
      },
      {
        title: "Lo que no hacemos",
        blocks: [
          {
            ul: [
              "No vendemos tu correo ni lo compartimos con fines publicitarios.",
              "No usamos analítica, píxeles publicitarios ni cookies de rastreo en este sitio.",
              "La escena del vino se dibuja en tu dispositivo. Nada de ella se nos envía.",
            ],
          },
        ],
      },
      {
        title: "Quién más lo ve",
        blocks: [
          {
            p: "La lista es privada. Resend la guarda y envía el correo de lanzamiento. Resend recibe solo la dirección de correo que escribiste. Mientras Resend no esté conectado, la dirección se queda en un archivo del servidor donde funciona este sitio.",
          },
          {
            p: "La empresa que aloja el sitio guarda registros normales de acceso, que pueden incluir una dirección de red, para operar el sitio y frenar abusos. Esos registros están separados de la lista.",
          },
          { p: "También compartimos información si la ley lo exige." },
        ],
      },
      {
        title: "Cuánto tiempo lo guardamos",
        blocks: [
          {
            p: "Guardamos tu dirección hasta enviar el correo de lanzamiento y la borramos en los 30 días siguientes. Si lo pides antes, la borramos en ese momento. Para pedirlo, escribe a {email} desde la dirección con la que te registraste.",
          },
          {
            p: "También puedes pedir una copia de lo que tenemos, o una corrección. Si Resend tiene una copia, también la borramos ahí.",
          },
          {
            p: "Al unirte a la lista aceptas este aviso. Puedes retirar tu consentimiento cuando quieras pidiéndonos que borremos tu dirección, y lo haremos.",
          },
        ],
      },
      {
        title: "Cookies",
        blocks: [
          {
            p: "Este sitio no usa cookies. Las tipografías vienen incluidas en el sitio, así que visitarlo no envía ninguna solicitud a un servicio de fuentes.",
          },
        ],
      },
      {
        title: "Menores de edad",
        blocks: [
          {
            p: "Cata trata sobre vino y no es para quien no tenga la edad legal para beber donde vive. No guardamos a sabiendas el correo de nadie menor de esa edad.",
          },
        ],
      },
      {
        title: "Cambios",
        blocks: [
          {
            p: "Si esta página cambia, también cambia la fecha de arriba. Si algún día queremos usar la lista para algo distinto del correo de lanzamiento, te preguntaremos primero.",
          },
        ],
      },
      {
        title: "Contacto",
        blocks: [{ p: "Cata. Escribe a {email} para cualquier duda sobre esta página." }],
      },
    ],
  },
  terms: {
    title: "Términos — Cata",
    description: "Los términos del sitio de Cata y de su lista de espera.",
    heading: "Términos.",
    lede: "Este sitio es un adelanto de Cata, una app para iPhone que todavía no sale. Unirte a la lista significa que quieres enterarte cuando salga.",
    sections: [
      {
        title: "El sitio",
        blocks: [
          {
            p: "Las páginas, los textos, las imágenes y la escena de arriba son de Cata. Puedes verlos y compartir un enlace. No copies el sitio ni intentes extraer la lista de espera.",
          },
        ],
      },
      {
        title: "La lista de espera",
        blocks: [
          {
            p: "Usa una dirección de correo que sea tuya. Unirte no reserva un lugar, un precio ni una fecha de lanzamiento, ni garantiza que todas las funciones descritas en el sitio vayan a salir, o que salgan tal como se describen.",
          },
          {
            p: "Usaremos tu dirección solo como indica el {privacy}: un correo cuando Cata esté lista. Podemos cerrar la lista o quitar direcciones enviadas por un bot o que no correspondan a un buzón real.",
          },
        ],
      },
      {
        title: "La app",
        blocks: [
          {
            p: "Nada de esto es la app. Escanear, maridar, preguntar y la cava son lo que estamos construyendo. Cuando la app esté disponible, tendrá sus propios términos, y esos regirán su uso.",
          },
        ],
      },
      {
        title: "El vino",
        blocks: [
          {
            p: "Cata es para personas con la edad legal para beber donde viven. Este sitio no vende alcohol. Disfrútalo con responsabilidad.",
          },
        ],
      },
      {
        title: "Tal cual",
        blocks: [
          {
            p: "El sitio es un adelanto y se ofrece tal cual. No prometemos que esté disponible sin interrupciones, ni nos hacemos responsables de pérdidas derivadas de usarlo o de confiar en la descripción de una app que todavía no sale.",
          },
        ],
      },
      {
        title: "Contacto",
        blocks: [{ p: "Si tienes preguntas, escribe a {email}." }],
      },
    ],
  },
};
