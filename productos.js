// =====================================================
// productos.js — Lista de discos de Onda Azul Records
// Discos y artistas REALES. Las tapas están en la carpeta img/.
// =====================================================

// Nombres "lindos" de cada categoría.
// En los productos guardamos un código corto (ej: "pop-ingles")
// y con este objeto obtenemos el texto para mostrar (ej: "Pop en inglés").
const categorias = {
    "pop-ingles": "Pop en inglés",
    "pop-espanol": "Pop en español",
    "pop-latino": "Pop latino",
    "clasicos": "Clásicos 80s y 90s",
    "novedades": "Novedades"
};

// Regla de categorías (cada disco va en UNA sola):
//   clasicos    → editados antes del 2000, cualquier idioma
//   novedades   → editados en 2025 o 2026
//   pop-ingles  → del 2000 al 2024, en inglés
//   pop-espanol → del 2000 al 2024, en español, más melódico
//   pop-latino  → del 2000 al 2024, en español, más bailable o urbano

// Lista de productos.
// Cada disco es un objeto con estas propiedades:
//   id        → número único para identificar el disco
//   nombre    → nombre del disco
//   artista   → quién lo canta
//   categoria → código de la categoría (ver el objeto "categorias")
//   idioma    → "Inglés" o "Español"
//   decada    → año de inicio de la década (1980, 1990, 2000, 2010, 2020)
//   precio    → precio en pesos argentinos (sin puntos, para poder hacer cuentas)
//   tapa      → degradado CSS de RESPALDO (se ve si la imagen no carga)
//   imagen    → ruta de la foto de la tapa
const productos = [
    // ---------- Pop en inglés ----------
    {
        id: 1,
        nombre: "Oops!... I Did It Again",
        artista: "Britney Spears",
        categoria: "pop-ingles",
        idioma: "Inglés",
        decada: 2000,
        precio: 58000,
        tapa: "linear-gradient(135deg, #B58F6D, #796355)",
        imagen: "img/britney-spears-oops-i-did-it-again.jpg"
    },
    {
        id: 2,
        nombre: "When We All Fall Asleep, Where Do We Go?",
        artista: "Billie Eilish",
        categoria: "pop-ingles",
        idioma: "Inglés",
        decada: 2010,
        precio: 62000,
        tapa: "linear-gradient(135deg, #1D1C1A, #5A5550)",
        imagen: "img/billie-eilish-when-we-all-fall-asleep.jpg"
    },
    {
        id: 3,
        nombre: "Midnights",
        artista: "Taylor Swift",
        categoria: "pop-ingles",
        idioma: "Inglés",
        decada: 2020,
        precio: 68000,
        tapa: "linear-gradient(135deg, #C4BFBF, #734445)",
        imagen: "img/taylor-swift-midnights.jpg"
    },
    {
        id: 4,
        nombre: "Future Nostalgia",
        artista: "Dua Lipa",
        categoria: "pop-ingles",
        idioma: "Inglés",
        decada: 2020,
        precio: 64000,
        tapa: "linear-gradient(135deg, #3A505A, #7D6569)",
        imagen: "img/dua-lipa-future-nostalgia.jpg"
    },

    // ---------- Pop en español ----------
    {
        id: 5,
        nombre: "Quiero Volver",
        artista: "Tini",
        categoria: "pop-espanol",
        idioma: "Español",
        decada: 2010,
        precio: 52000,
        tapa: "linear-gradient(135deg, #634938, #AA9C73)",
        imagen: "img/tini-quiero-volver.jpg"
    },
    {
        id: 6,
        nombre: "Soy",
        artista: "Lali",
        categoria: "pop-espanol",
        idioma: "Español",
        decada: 2010,
        precio: 50000,
        tapa: "linear-gradient(135deg, #BDA492, #E0C2B7)",
        imagen: "img/lali-soy.jpg"
    },
    {
        id: 7,
        nombre: "11 Razones",
        artista: "Aitana",
        categoria: "pop-espanol",
        idioma: "Español",
        decada: 2020,
        precio: 55000,
        tapa: "linear-gradient(135deg, #B0D8E7, #C3CBD0)",
        imagen: "img/aitana-11-razones.jpg"
    },
    {
        id: 8,
        nombre: "Terral",
        artista: "Pablo Alborán",
        categoria: "pop-espanol",
        idioma: "Español",
        decada: 2010,
        precio: 53000,
        tapa: "linear-gradient(135deg, #D0BAA5, #A88D78)",
        imagen: "img/pablo-alboran-terral.jpg"
    },

    // ---------- Pop latino ----------
    {
        id: 9,
        nombre: "Mañana Será Bonito",
        artista: "Karol G",
        categoria: "pop-latino",
        idioma: "Español",
        decada: 2020,
        precio: 66000,
        tapa: "linear-gradient(135deg, #C3A389, #CA9E8C)",
        imagen: "img/karol-g-manana-sera-bonito.jpg"
    },
    {
        id: 10,
        nombre: "Fijación Oral Vol. 1",
        artista: "Shakira",
        categoria: "pop-latino",
        idioma: "Español",
        decada: 2000,
        precio: 60000,
        tapa: "linear-gradient(135deg, #8C4141, #956C71)",
        imagen: "img/shakira-fijacion-oral-vol-1.jpg"
    },
    {
        id: 11,
        nombre: "Por Primera Vez",
        artista: "Camilo",
        categoria: "pop-latino",
        idioma: "Español",
        decada: 2020,
        precio: 54000,
        tapa: "linear-gradient(135deg, #1B110E, #BAA98A)",
        imagen: "img/camilo-por-primera-vez.jpg"
    },
    {
        id: 12,
        nombre: "Fantasía",
        artista: "Sebastián Yatra",
        categoria: "pop-latino",
        idioma: "Español",
        decada: 2010,
        precio: 52000,
        tapa: "linear-gradient(135deg, #54C8E4, #79A2C7)",
        imagen: "img/sebastian-yatra-fantasia.jpg"
    },

    // ---------- Clásicos 80s y 90s ----------
    {
        id: 13,
        nombre: "Like a Virgin",
        artista: "Madonna",
        categoria: "clasicos",
        idioma: "Inglés",
        decada: 1980,
        precio: 75000,
        tapa: "linear-gradient(135deg, #7B695E, #948478)",
        imagen: "img/madonna-like-a-virgin.jpg"
    },
    {
        id: 14,
        nombre: "Thriller",
        artista: "Michael Jackson",
        categoria: "clasicos",
        idioma: "Inglés",
        decada: 1980,
        precio: 80000,
        tapa: "linear-gradient(135deg, #5A6261, #93938D)",
        imagen: "img/michael-jackson-thriller.jpg"
    },
    {
        id: 15,
        nombre: "Amor a la Mexicana",
        artista: "Thalía",
        categoria: "clasicos",
        idioma: "Español",
        decada: 1990,
        precio: 70000,
        tapa: "linear-gradient(135deg, #C8D4C8, #9FB09F)",
        imagen: "img/thalia-amor-a-la-mexicana.jpg"
    },
    {
        id: 16,
        nombre: "Romance",
        artista: "Luis Miguel",
        categoria: "clasicos",
        idioma: "Español",
        decada: 1990,
        precio: 72000,
        tapa: "linear-gradient(135deg, #D6D0CD, #514139)",
        imagen: "img/luis-miguel-romance.jpg"
    },

    // ---------- Novedades ----------
    {
        id: 17,
        nombre: "Man's Best Friend",
        artista: "Sabrina Carpenter",
        categoria: "novedades",
        idioma: "Inglés",
        decada: 2020,
        precio: 85000,
        tapa: "linear-gradient(135deg, #8F706F, #81605F)",
        imagen: "img/sabrina-carpenter-mans-best-friend.jpg"
    },
    {
        id: 18,
        nombre: "you seem pretty sad for a girl so in love",
        artista: "Olivia Rodrigo",
        categoria: "novedades",
        idioma: "Inglés",
        decada: 2020,
        precio: 90000,
        tapa: "linear-gradient(135deg, #84959E, #879DA6)",
        imagen: "img/olivia-rodrigo-you-seem-pretty-sad.jpg"
    },
    {
        id: 19,
        nombre: "Perfectas",
        artista: "Emilia",
        categoria: "novedades",
        idioma: "Español",
        decada: 2020,
        precio: 78000,
        tapa: "linear-gradient(135deg, #C27989, #D68A97)",
        imagen: "img/emilia-perfectas.jpg"
    },
    {
        id: 20,
        nombre: "Tour_En_Vivo.mp3",
        artista: "Emilia",
        categoria: "novedades",
        idioma: "Español",
        decada: 2020,
        precio: 88000,
        tapa: "linear-gradient(135deg, #A3C3DC, #869FB0)",
        imagen: "img/emilia-tour-en-vivo-mp3.jpg"
    }
];
