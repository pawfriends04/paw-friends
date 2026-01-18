/**
 * PAW FRIENDS - Lógica de Negocio v1.5
 * Gestiona: Base de datos, Buscador, Likes, Modal y Adopción.
 */

// 1. BASE DE DATOS DE ANIMALES
const animales = [
    { 
        id: 1, 
        nombre: "Napoleon", 
        tipo: "perro", 
        edad: "1 año", 
        lugar: "Zona Norte", 
        foto: "images/napoleon.jpeg", 
        bio: "Napoleon es un experto en seguridad del hogar, leal y muy cariñoso. Ideal para casas pequeñas." 
    },
    { 
        id: 2, 
        nombre: "Luna", 
        tipo: "gato", 
        edad: "2 años", 
        lugar: "Centro", 
        foto: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=500&q=80", 
        bio: "Luna prefiere el modo silencioso y las siestas al sol. Es una gata muy independiente y elegante." 
    },
    { 
        id: 3, 
        nombre: "Max", 
        tipo: "perro", 
        edad: "3 meses", 
        lugar: "Parque Sur", 
        foto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80", 
        bio: "Un cachorro con energía ilimitada. Busca una familia activa que quiera jugar y entrenar con él." 
    },
    { 
        id: 4, 
        nombre: "Simba", 
        tipo: "gato", 
        edad: "5 meses", 
        lugar: "Zona Este", 
        foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=500&q=80", 
        bio: "Un pequeño explorador curioso. Le encanta trepar y es muy sociable con otros animales." 
    }
];

// 2. REFERENCIAS AL DOM
const grid = document.getElementById('gridAnimales');
const modal = document.getElementById('modalPerfil');
const inputBusqueda = document.getElementById('inputBusqueda');
const filtroTipo = document.getElementById('filtroTipo');

// 3. FUNCIÓN DE RENDERIZADO (Generar las tarjetas en el HTML)
function cargarAnimales(lista) {
    grid.innerHTML = '';
    
    if(lista.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No encontramos resultados para tu búsqueda... 🐾</p>';
        return;
    }

    lista.forEach(animal => {
        grid.innerHTML += `
            <div class="card-perfil">
                <div class="card-header-img"><img src="${animal.foto}" alt="${animal.nombre}"></div>
                <div class="card-info-social">
                    <div class="nombre-verificado">
                        <h3>${animal.nombre}</h3>
                        <i class="fas fa-check-circle verified"></i>
                    </div>
                    <div class="muro-info">
                        <p><i class="fas fa-map-marker-alt"></i> ${animal.lugar}</p>
                        <p><i class="fas fa-birthday-cake"></i> ${animal.edad}</p>
                    </div>
                    <div class="interacciones-sociales">
                        <button class="btn-perfil" onclick="verDetalles(${animal.id})">Ver Perfil</button>
                        <button class="btn-like" onclick="toggleLike(this)">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// 4. LÓGICA DE FILTRADO Y BÚSQUEDA (Por escritura y tipo)
function filtrar() {
    const texto = inputBusqueda.value.toLowerCase();
    const tipo = filtroTipo.value;

    const filtrados = animales.filter(animal => {
        const coincideNombre = animal.nombre.toLowerCase().includes(texto);
        const coincideTipo = tipo === 'todos' || animal.tipo === tipo;
        return coincideNombre && coincideTipo;
    });

    cargarAnimales(filtrados);
}

// Eventos para el buscador
inputBusqueda.addEventListener('input', filtrar);
filtroTipo.addEventListener('change', filtrar);

// 5. SISTEMA DE LIKES
function toggleLike(btn) {
    btn.classList.toggle('liked');
}

// 6. LÓGICA DEL MODAL (Ver detalles y preparar Adopción)
function verDetalles(id) {
    const animal = animales.find(a => a.id === id);
    if(animal) {
        // Llenar datos visuales
        document.getElementById('nombreModal').innerText = animal.nombre;
        document.getElementById('biografiaTexto').innerText = animal.bio;
        document.getElementById('imgModal').src = animal.foto;
        
        // Configurar datos ocultos para el envío del correo de adopción
        document.getElementById('animalInteres').value = animal.nombre;
        document.getElementById('asuntoAdopcion').value = `SOLICITUD DE ADOPCIÓN PARA: ${animal.nombre}`;
        
        // Mostrar modal
        modal.style.display = 'block';
    }
}

// Cerrar Modal al hacer clic en la (X) o fuera del cuadro
document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
window.onclick = (e) => { 
    if(e.target == modal) modal.style.display = 'none'; 
}

// 7. ALERTAS DE ENVÍO (Simulación y Feedback)
document.getElementById('formAdopcion').onsubmit = function() {
    alert("¡Solicitud enviada! Paw Friends revisará tu mensaje y se pondrá en contacto contigo pronto.");
};

document.getElementById('formReporte').onsubmit = function() {
    alert("Procesando reporte... Serás redirigido para la validación final. ¡Gracias por ayudar!");
};

// 8. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    cargarAnimales(animales);
});

// Función para detectar el estado del formulario en la URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status) {
        let mensaje = "";
        
        if (status === 'reporte') {
            mensaje = "✅ Tu reporte se ha enviado correctamente al correo de la página. ¡Gracias por ayudar!";
        } else if (status === 'newsletter') {
            mensaje = "✉️ ¡Suscripción exitosa! Pronto recibirás noticias nuestras.";
        } else if (status === 'adopcion') {
            mensaje = "🐾 Solicitud de adopción enviada. Nos pondremos en contacto contigo pronto.";
        }

        // Crear una notificación visual flotante
        const alerta = document.createElement('div');
        alerta.className = 'alerta-flotante';
        alerta.textContent = mensaje;
        document.body.appendChild(alerta);

        // Desaparecer después de 5 segundos
        setTimeout(() => {
            alerta.classList.add('desvanecer');
            setTimeout(() => alerta.remove(), 500);
            // Limpiar la URL para que el mensaje no salga de nuevo al refrescar
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }
});

