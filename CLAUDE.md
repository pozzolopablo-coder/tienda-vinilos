# Onda Azul Records — Tienda online de vinilos

Proyecto escolar: tienda online hecha **solo con HTML, CSS y JavaScript** (sin frameworks ni librerías).
Publicación final en **GitHub Pages**.

## Reglas para trabajar conmigo

- Tengo que poder **entender y explicar todo el código**. Escribí código simple, claro y con **comentarios en español**.
- Trabajamos **por etapas**. Hacé solo la etapa que te pida y **no avances a la siguiente hasta que te lo diga**.
- Al terminar cada etapa, explicame en pocas palabras qué hiciste y qué hace cada función nueva.
- Si hay un error, explicame por qué pasó antes de arreglarlo.
- Nada de frameworks (React, Bootstrap, etc.). JavaScript "vanilla".
- Antes de cambiar algo que ya funciona, avisame.

## Identidad de la tienda

- **Nombre:** Onda Azul Records
- **Qué vende:** discos de vinilo de pop en inglés y en español
- **Logo:** propio, hecho por nosotros (SVG o CSS). Idea: un vinilo azul con ondas.
- **Tipografías (Google Fonts):** títulos en *Righteous*, texto en *Poppins* (se pueden cambiar)

### Paleta de colores

| Uso | Color | Código |
|---|---|---|
| Header y footer | Azul noche | `#0B1D3A` |
| Títulos | Azul marino | `#1E3A8A` |
| Botones | Azul eléctrico | `#2563EB` |
| Hover y detalles | Celeste | `#60A5FA` |
| Fondo de tarjetas | Celeste muy claro | `#DBEAFE` |
| Fondo de página | Blanco azulado | `#F5F9FF` |
| Acento (ofertas, contador del carrito) | Amarillo | `#FACC15` |

Definir los colores como variables CSS en `:root` para usarlas en toda la página y en el modo oscuro.

### Categorías

- Pop en inglés
- Pop en español
- Pop latino
- Clásicos 80s y 90s
- Novedades

### Productos

- Discos y artistas **reales**.
- Las tapas son **imágenes reales** guardadas en `img/` (nombres en minúscula, sin espacios, tildes ni ñ). Si una imagen no carga, se muestra el **degradado de respaldo** (`tapa`), con colores inspirados en el disco.
- Cada producto tiene: id, nombre del disco, artista, categoría, idioma (inglés/español), década, precio en pesos argentinos, `tapa` (degradado de respaldo) e `imagen` (ruta del archivo en `img/`).

### Regla de categorías (cada disco va en una sola)

- **Clásicos 80s y 90s:** discos editados antes del 2000, en cualquier idioma
- **Novedades:** discos de 2025 y 2026
- **Pop en inglés:** discos del 2000 al 2024 en inglés
- **Pop en español:** del 2000 al 2024 en español, más melódico
- **Pop latino:** del 2000 al 2024 en español, más bailable o urbano

## Lo que pide la consigna (obligatorio)

- [ ] Mostrar los productos disponibles
- [ ] Ver imagen, nombre y precio de cada producto
- [ ] Organizar los productos por categorías
- [ ] Buscar productos
- [ ] Filtrar productos (por categoría, idioma, década, precio)
- [ ] Agregar productos a un carrito
- [ ] Modificar cantidades
- [ ] Eliminar productos del carrito
- [ ] Calcular el total de la compra
- [ ] Mostrar mensajes al usuario cuando hace una acción (ej: "Agregado al carrito ✓")
- [ ] Diseño responsive (computadora y celular)

## Funcionalidades opcionales elegidas (mínimo 3)

- [ ] 💾 Guardado del carrito con localStorage
- [ ] 🌙 Modo oscuro
- [ ] ❤️ Lista de favoritos
- [ ] 🏷️ Sistema de descuentos (cupón)

## Estructura de archivos

```
tienda-vinilos/
├── index.html      → estructura
├── styles.css      → diseño
├── script.js       → funcionalidades
├── productos.js    → lista de discos
├── img/            → logo e imágenes
├── NOTAS-IA.md     → registro de cómo usé la IA
└── README.md       → explicación del proyecto
```

## Etapas

1. Estructura HTML y lista de productos (`productos.js`)
2. Diseño CSS: colores, tipografías, tarjetas, botones, responsive
3. Mostrar los productos con JavaScript
4. Búsqueda y filtros
5. Carrito: agregar, cambiar cantidad, eliminar, total
6. Mensajes al usuario
7. Funcionalidades opcionales
8. Logo final y retoques de diseño
9. README.md
10. Subir a GitHub y publicar en GitHub Pages

## Entrega

1. Link al repositorio de GitHub
2. Link a la página funcionando (GitHub Pages)
3. Archivo README.md
4. Breve explicación del proyecto
5. Breve descripción de cómo se usó la IA durante el desarrollo
