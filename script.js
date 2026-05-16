// Función para cargar cualquier sección
async function cargarSeccion(archivoJson, elementoBoton) {
    const contenedor = document.getElementById('galeria-dinamica');
    
    // 1. Efecto visual: Cambiar el botón activo
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if(elementoBoton) elementoBoton.classList.add('active');

    // 2. Limpiar la galería antes de cargar lo nuevo
    contenedor.innerHTML = '<p style="text-align:center; width:100%;">Cargando arte...</p>';

    try {
        const respuesta = await fetch(archivoJson);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ''; // Borramos el mensaje de cargando

        datos.forEach(item => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    
    // ESTO ES LO NUEVO: Al hacer click abre el modal
    div.onclick = () => abrirModal(item); 

    if (item.tipo === 'imagen') {
        div.innerHTML = `
            <img src="${item.url}" alt="${item.titulo}">
            <p class="titulo-tatuaje">${item.titulo}</p>
        `;
    } else if (item.tipo === 'video') {
        div.innerHTML = `
            <blockquote class="tiktok-embed" data-video-id="${item.url}" style="width: 100%; margin: 0;">
                <section></section>
            </blockquote>
            <p class="titulo-tatuaje">${item.titulo}</p>
        `;
    }
    contenedor.appendChild(div);
});

        // IMPORTANTE: Decirle a TikTok que procese los nuevos videos cargados
        if (typeof window.twttr !== 'undefined') {
            // Recargar scripts de redes si es necesario
        }
        // TikTok recarga automáticamente si el script está al final, 
        // pero si no, forzamos la carga del widget:
        const scriptTiktok = document.createElement('script');
        scriptTiktok.src = "https://www.tiktok.com/embed.js";
        document.body.appendChild(scriptTiktok);

    } catch (error) {
        console.error("Error cargando el JSON:", error);
        contenedor.innerHTML = '<p style="text-align:center; width:100%;">Próximamente...</p>';
    }
}

// Cargar la primera sección por defecto al entrar a la web
window.onload = () => {
    cargarSeccion('realizados.json');
};

function abrirModal(item) {
    const modal = document.getElementById('modal-galeria');
    const modalBody = document.getElementById('modal-body');
    const modalTitulo = document.getElementById('modal-titulo');

    modal.style.display = "block";
    modalTitulo.innerText = item.titulo;

    if (item.tipo === 'imagen') {
        modalBody.innerHTML = `<img src="${item.url}" style="width:100%">`;
    } else if (item.tipo === 'video') {
        modalBody.innerHTML = `
            <blockquote class="tiktok-embed" data-video-id="${item.url}" style="width: 100%; margin: 0;">
                <section></section>
            </blockquote>
        `;
        // Forzamos a TikTok a cargar el video dentro del modal
        const s = document.createElement('script');
        s.src = "https://www.tiktok.com/embed.js";
        document.body.appendChild(s);
    }
}

function cerrarModal() {
    document.getElementById('modal-galeria').style.display = "none";
    document.getElementById('modal-body').innerHTML = ""; // Limpiamos para detener videos
}
function toggleFab() {
    const container = document.querySelector('.fab-container');
    const icon = document.getElementById('fab-icon');
    
    container.classList.toggle('active');
    
    // Cambiar el texto opcionalmente si no quieres usar la rotación CSS
    if (container.classList.contains('active')) {
        icon.innerText = '💖'; // La rotación en CSS lo hará parecer una X
    } else {
        icon.innerText = '💖';
    }
}
// Función para abrir y cerrar el menú de hamburguesa
function toggleMenu() {
    const tabsMenu = document.getElementById('tabsMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    tabsMenu.classList.toggle('mobile-open');
    menuToggle.classList.toggle('active');
}

// Función intermedia para que el menú se cierre al dar click en una opción
function seleccionarTab(archivoJson, elementoBoton) {
    cargarSeccion(archivoJson, elementoBoton);
    
    // Si estamos en móvil, cerramos el menú después de hacer click
    const tabsMenu = document.getElementById('tabsMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (tabsMenu.classList.contains('mobile-open')) {
        tabsMenu.classList.remove('mobile-open');
        menuToggle.classList.remove('active');
    }
}