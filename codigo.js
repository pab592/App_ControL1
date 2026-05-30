// ==============================================
// POMODORO COMPLETO - TODO LO QUE PEDISTE
// ==============================================
let tiempo = 25 * 60;
let tiempoTrabajo = 25;
let tiempoDescanso = 5;
let tiempoLargo = 15;
let modoTrabajo = true;
let modoLargo = false;
let activo = false;
let intervalo;
let ciclosCompletados = 0;
let tiempoTotalAcumulado = 0;

// ELEMENTOS
const tiempoTexto = document.getElementById('tiempoTexto');
const barra = document.getElementById('barraProgreso');
const btnIniciar = document.getElementById('btnIniciar');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnTiempos = document.querySelectorAll('.btn-tiempo');
const btnPersonalizado = document.getElementById('btnPersonalizado');
const estadoTiempo = document.getElementById('estadoTiempo');
const contadorCiclos = document.getElementById('contadorCiclos');
const tiempoTotal = document.getElementById('tiempoTotal');
const nombreSesion = document.getElementById('nombreSesion');
const sonidoAviso = document.getElementById('sonidoAviso');

// MODO ENFOQUE
const btnEnfoque = document.getElementById('btnEnfoque');
const btnSalirEnfoque = document.getElementById('btnSalirEnfoque');
const modoEnfoque = document.getElementById('modoEnfoque');
const tiempoEnfoque = document.getElementById('tiempoEnfoque');
const barraEnfoque = document.getElementById('barraEnfoque');
const estadoEnfoque = document.getElementById('estadoEnfoque');
const nombreEnfoque = document.getElementById('nombreEnfoque');

// ACTUALIZAR RELOJ
function actualizarReloj() {
    let min = Math.floor(tiempo / 60);
    let seg = tiempo % 60;
    let texto = `${min}:${seg.toString().padStart(2,'0')}`;
    
    tiempoTexto.textContent = texto;
    tiempoEnfoque.textContent = texto;

    let tiempoTotalActual = modoTrabajo ? (modoLargo ? tiempoLargo : tiempoTrabajo)*60 : (modoLargo ? tiempoLargo : tiempoDescanso)*60;
    let avance = 282.7 * (1 - (tiempo / tiempoTotalActual));
    
    barra.style.strokeDashoffset = avance;
    barraEnfoque.style.strokeDashoffset = avance;
}

// CAMBIAR MODO AUTOMÁTICO
function cambiarModo() {
    sonidoAviso.play().catch(()=>{}); // Sonido al terminar

    if(modoTrabajo){
        // TERMINÓ TRABAJO
        ciclosCompletados++;
        tiempoTotalAcumulado += tiempoTrabajo;
        contadorCiclos.textContent = ciclosCompletados;
        tiempoTotal.textContent = `${tiempoTotalAcumulado} min`;

        if(ciclosCompletados % 4 === 0){
            // DESCANSO LARGO
            modoLargo = true;
            tiempo = tiempoLargo * 60;
            estadoTiempo.textContent = "Modo: DESCANSO LARGO 🎉";
            estadoEnfoque.textContent = "DESCANSO LARGO 🎉";
            barra.style.stroke = "#a5b4fc";
        } else {
            // DESCANSO CORTO
            modoLargo = false;
            tiempo = tiempoDescanso * 60;
            estadoTiempo.textContent = "Modo: Descanso 😌";
            estadoEnfoque.textContent = "Descanso 😌";
            barra.style.stroke = "#4ade80";
        }
        modoTrabajo = false;
        alert(`✅ ¡Terminaste un ciclo! Llevas ${ciclosCompletados} hoy`);

    } else {
        // TERMINÓ DESCANSO → VOLVER A TRABAJAR
        modoTrabajo = true;
        modoLargo = false;
        tiempo = tiempoTrabajo * 60;
        estadoTiempo.textContent = "Modo: Trabajo 🌱";
        estadoEnfoque.textContent = "Trabajo 🌱";
        barra.style.stroke = "#ff7a59";
    }

    actualizarReloj();
    guardarDatos();
}

// BOTÓN INICIAR / PAUSAR
btnIniciar.addEventListener('click', () => {
    if(!activo){
        activo = true;
        btnIniciar.textContent = 'Pausar';
        intervalo = setInterval(() => {
            tiempo--;
            actualizarReloj();
            if(tiempo <= 0){
                clearInterval(intervalo);
                activo = false;
                btnIniciar.textContent = 'Iniciar';
                cambiarModo();
            }
        },1000);
    } else {
        activo = false;
        clearInterval(intervalo);
        btnIniciar.textContent = 'Iniciar';
    }
});

// REINICIAR
btnReiniciar.addEventListener('click', () => {
    clearInterval(intervalo);
    activo = false;
    btnIniciar.textContent = 'Iniciar';
    modoTrabajo = true;
    modoLargo = false;
    tiempo = tiempoTrabajo * 60;
    estadoTiempo.textContent = "Modo: Trabajo 🌱";
    estadoEnfoque.textContent = "Trabajo 🌱";
    barra.style.stroke = "#ff7a59";
    actualizarReloj();
});

// ELEGIR TIEMPOS RÁPIDOS
btnTiempos.forEach(btn => {
    btn.addEventListener('click', () => {
        btnTiempos.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        
        tiempoTrabajo = parseInt(btn.dataset.trabajo);
        tiempoDescanso = parseInt(btn.dataset.descanso);
        tiempoLargo = parseInt(btn.dataset.largo);
        
        reiniciarTodo();
    });
});

// TIEMPO PERSONALIZADO
btnPersonalizado.addEventListener('click', () => {
    let t = prompt('Minutos de TRABAJO:');
    let d = prompt('Minutos de DESCANSO:');
    let l = prompt('Minutos de DESCANSO LARGO:');
    if(t && d && l){
        btnTiempos.forEach(b => b.classList.remove('activo'));
        tiempoTrabajo = parseInt(t);
        tiempoDescanso = parseInt(d);
        tiempoLargo = parseInt(l);
        reiniciarTodo();
    }
});

// MODO ENFOQUE
btnEnfoque.addEventListener('click', () => {
    nombreEnfoque.textContent = nombreSesion.value || "Sesión de Enfoque";
    modoEnfoque.classList.add('activo');
});
btnSalirEnfoque.addEventListener('click', () => modoEnfoque.classList.remove('activo'));

// GUARDAR / CARGAR DATOS
function guardarDatos(){
    localStorage.setItem('datosPomodoro', JSON.stringify({
        ciclos: ciclosCompletados,
        total: tiempoTotalAcumulado,
        nombre: nombreSesion.value
    }));
}
function cargarDatos(){
    let datos = JSON.parse(localStorage.getItem('datosPomodoro'));
    if(datos){
        ciclosCompletados = datos.ciclos || 0;
        tiempoTotalAcumulado = datos.total || 0;
        nombreSesion.value = datos.nombre || '';
        contadorCiclos.textContent = ciclosCompletados;
        tiempoTotal.textContent = `${tiempoTotalAcumulado} min`;
    }
}

function reiniciarTodo(){
    clearInterval(intervalo); activo = false;
    btnIniciar.textContent = 'Iniciar';
    modoTrabajo = true; modoLargo = false;
    tiempo = tiempoTrabajo * 60;
    estadoTiempo.textContent = "Modo: Trabajo 🌱";
    barra.style.stroke = "#ff7a59";
    actualizarReloj();
}

// ==============================================
// GESTIÓN DE TAREAS (SIGUE IGUAL DE FUNCIONAL)
// ==============================================
let tareas = JSON.parse(localStorage.getItem('misTareas')) || [];

const inputTarea = document.getElementById('inputTarea');
const inputFecha = document.getElementById('inputFecha');
const btnAgregar = document.getElementById('btnAgregar');
const columnas = document.querySelectorAll('.columna');

btnAgregar.addEventListener('click', () => {
    let texto = inputTarea.value.trim();
    let fecha = inputFecha.value.trim();
    if(!texto || !fecha) return alert('Pon tarea y fecha (dd/mm/aa)');

    tareas.push({ id: Date.now(), texto, fecha, estado: 'por-hacer' });
    inputTarea.value = ''; inputFecha.value = '';
    guardarYmostrar();
});

function estaVencida(fechaStr){
    let [d,m,a] = fechaStr.split('/').map(Number);
    let entrega = new Date(2000+a, m-1, d);
    return entrega < new Date();
}

function mostrarTodo(){
    columnas.forEach(col => col.querySelector('.zona-tareas').innerHTML = '');

    tareas.forEach(t => {
        if(t.estado !== 'completado' && estaVencida(t.fecha)) t.estado = 'vencidas';

        let zona = document.getElementById(t.estado).querySelector('.zona-tareas');
        let tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta ${t.estado==='completado'?'completada':''}`;
        tarjeta.draggable = true;
        tarjeta.dataset.id = t.id;

        tarjeta.innerHTML = `
            <div class="fecha">Entrega: ${t.fecha}</div>
            <div>${t.texto}</div>
            <div class="acciones">
                <button class="editar">✏️</button>
                <button class="borrar">🗑️</button>
            </div>
        `;

        tarjeta.querySelector('.editar').addEventListener('click', () => {
            let nuevoTexto = prompt('Editar tarea:', t.texto);
            let nuevaFecha = prompt('Editar fecha:', t.fecha);
            if(nuevoTexto && nuevaFecha){
                t.texto = nuevoTexto.trim(); t.fecha = nuevaFecha.trim();
                guardarYmostrar();
            }
        });

        tarjeta.querySelector('.borrar').addEventListener('click', () => {
            tareas = tareas.filter(x => x.id != t.id);
            guardarYmostrar();
        });

        zona.appendChild(tarjeta);
    });

    habilitarArrastre();
}

function guardarYmostrar(){
    localStorage.setItem('misTareas', JSON.stringify(tareas));
    mostrarTodo();
}

function habilitarArrastre(){
    let arrastrando = null;
    document.querySelectorAll('.tarjeta').forEach(t => t.addEventListener('dragstart', e => arrastrando = t.dataset.id));
    columnas.forEach(col => {
        col.addEventListener('dragover', e => e.preventDefault());
        col.addEventListener('drop', () => {
            if(!arrastrando) return;
            let tarea = tareas.find(x => x.id == arrastrando);
            if(tarea) { tarea.estado = col.id; guardarYmostrar(); }
            arrastrando = null;
        });
    });
}

// INICIAR TODO
cargarDatos();
mostrarTodo();
actualizarReloj();
