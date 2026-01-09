/* js/main.js */

const DB_NAME = 'evento_db_participantes';

// Datos de prueba
const datosDefault = [
    { nombre: "Ana García", email: "ana@mail.com", empresa: "TechSolutions", rol: "asistente", nivel: "jr", ciudad: "CDMX" },
    { nombre: "Carlos López", email: "carlos@dev.io", empresa: "Freelance", rol: "asistente", nivel: "sr", ciudad: "Guadalajara" },
    { nombre: "Juan Silva", email: "juan@google.com", empresa: "Google", rol: "ponente", tema: "IA Generativa", link: "https://linkedin.com" },
    { nombre: "María Rodriguez", email: "mrod@banco.com", empresa: "Banco Nacional", rol: "asistente", nivel: "mid", ciudad: "Monterrey" },
    { nombre: "Elena Limón", email: "elena@fintech.com", empresa: "Fintech", rol: "ponente", tema: "Ciberseguridad", link: "https://linkedin.com" },
    { nombre: "Roberto Díaz", email: "rob@startup.com", empresa: "InnovaSoft", rol: "asistente", nivel: "jr", ciudad: "CDMX" },
    { nombre: "Miguel Paz", email: "miguel@cloud.com", empresa: "AWS", rol: "ponente", tema: "Cloud Computing", link: "https://github.com" },
    { nombre: "Lucía Méndez", email: "lucia@design.com", empresa: "Estudio Creativo", rol: "asistente", nivel: "mid", ciudad: "Querétaro" },
    { nombre: "Fernando Torres", email: "fer@torres.com", empresa: "Consultora X", rol: "asistente", nivel: "sr", ciudad: "Remoto" },
    { nombre: "Patricia Vega", email: "paty@web.net", empresa: "Agencia Digital", rol: "asistente", nivel: "mid", ciudad: "Mérida" }
];

function iniciarApp() {
    const datosGuardados = localStorage.getItem(DB_NAME);
    if (!datosGuardados) {
        localStorage.setItem(DB_NAME, JSON.stringify(datosDefault));
    }
}

function traerDatos() {
    const json = localStorage.getItem(DB_NAME);
    return JSON.parse(json) || [];
}

function registrarUsuario(nuevoUser) {
    const listaActual = traerDatos();
    listaActual.push(nuevoUser);
    localStorage.setItem(DB_NAME, JSON.stringify(listaActual));
}

// Función para alternar formularios
function configurarToggleFormulario() {
    const radioAsistente = document.getElementById('radio-asistente');
    const radioPonente = document.getElementById('radio-ponente');
    const boxAsistente = document.getElementById('fieldset-asistente');
    const boxPonente = document.getElementById('fieldset-ponente');

    if (radioAsistente && radioPonente) {
        radioAsistente.addEventListener('change', () => {
            if(radioAsistente.checked) {
                boxAsistente.classList.remove('oculto');
                boxPonente.classList.add('oculto');
            }
        });

        radioPonente.addEventListener('change', () => {
            if(radioPonente.checked) {
                boxPonente.classList.remove('oculto');
                boxAsistente.classList.add('oculto');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
    configurarToggleFormulario();

    // LÓGICA DE REGISTRO
    const miFormulario = document.getElementById('form-registro');
    if (miFormulario) {
        miFormulario.addEventListener('submit', function(e) {
            e.preventDefault();
            const datosForm = new FormData(miFormulario);
            const tipoRol = datosForm.get('tipo');

            const usuarioNuevo = {
                nombre: datosForm.get('nombre'),
                email: datosForm.get('email'),
                empresa: datosForm.get('empresa'),
                ciudad: datosForm.get('ciudad') || 'No especificada',
                rol: tipoRol,
                nivel: tipoRol === 'asistente' ? datosForm.get('experiencia') : '',
                tema: tipoRol === 'ponente' ? datosForm.get('especialidad') : '',
                link: tipoRol === 'ponente' ? datosForm.get('linkedin') : ''
            };

            registrarUsuario(usuarioNuevo);
            alert("¡Registro exitoso! Redirigiendo...");
            window.location.href = 'participantes.html';
        });
    }

    // LÓGICA DE LISTADO Participantes
    const tablaCuerpo = document.getElementById('tabla-body-asistentes');
    const gridCuerpo = document.getElementById('grid-ponentes-container');

    if (tablaCuerpo || gridCuerpo) {
        const todaLaBanda = traerDatos();
        
        if(tablaCuerpo) tablaCuerpo.innerHTML = '';
        if(gridCuerpo) gridCuerpo.innerHTML = '';

        // Inicializamos contadores en 0
        let stats = { jr: 0, mid: 0, sr: 0, total: 0 };

        todaLaBanda.forEach(persona => {
            if (persona.rol === 'asistente') {
                const filaHTML = `
                    <tr>
                        <td>
                            <div class="user-info">
                                <strong>${persona.nombre}</strong>
                                <small>${persona.email}</small>
                            </div>
                        </td>
                        <td>${persona.empresa}</td>
                        <td><span class="tag tag-${persona.nivel}">${persona.nivel.toUpperCase()}</span></td>
                        <td>${persona.ciudad}</td>
                    </tr>
                `;
                if(tablaCuerpo) tablaCuerpo.innerHTML += filaHTML;
                
                
                if (stats.hasOwnProperty(persona.nivel)) {
                    stats[persona.nivel]++;
                }
                stats.total++;
            } 
            else if (persona.rol === 'ponente') {
                const tarjetaHTML = `
                    <div class="ponente-card">
                        <div class="ponente-header">
                            <div class="avatar">${persona.nombre.charAt(0)}</div>
                            <div>
                                <h3>${persona.nombre}</h3>
                                <small>${persona.empresa}</small>
                            </div>
                        </div>
                        <div class="ponente-body">
                            <p><strong>Especialidad:</strong> ${persona.tema}</p>
                            <p class="bio"><a href="${persona.link}" target="_blank">Ver Perfil LinkedIn</a></p>
                        </div>
                    </div>
                `;
                if(gridCuerpo) gridCuerpo.innerHTML += tarjetaHTML;
            }
        });
        
        actualizarGraficas(stats);
    }
});

function actualizarGraficas(data) {
    const barJr = document.getElementById('bar-jr');
    const barMid = document.getElementById('bar-mid');
    const barSr = document.getElementById('bar-sr');

    if (barJr && data.total > 0) {
        // Multiplicamos por 100 y agregamos el símbolo %
        barJr.style.width = (data.jr / data.total * 100) + '%';
        barJr.innerText = Math.round(data.jr / data.total * 100) + '%';
        
        barMid.style.width = (data.mid / data.total * 100) + '%';
        barMid.innerText = Math.round(data.mid / data.total * 100) + '%';

        barSr.style.width = (data.sr / data.total * 100) + '%';
        barSr.innerText = Math.round(data.sr / data.total * 100) + '%';
    }
}