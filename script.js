document.addEventListener("DOMContentLoaded", function() {
    // 1. Leer parámetros de la URL (Ej: misitio.com/boda/?invitado=Familia+Perez&pases=4)
    const urlParams = new URLSearchParams(window.location.search);
    const invitado = urlParams.get('invitado');
    const pases = urlParams.get('pases') || '2';

    const greetingEl = document.getElementById('guest-greeting');
    const passesEl = document.getElementById('guest-passes');
    const nameInput = document.getElementById('guest-name');
    const passesInput = document.getElementById('guest-assigned-passes');

    if (invitado) {
        // Decodificar espacios y caracteres especiales de la URL
        const nombreLimpio = decodeURIComponent(invitado.replace(/\+/g, ' '));
        greetingEl.innerText = `¡Hola, ${nombreLimpio}!`;
        passesEl.innerText = `Tienes asignados ${pases} pases para este gran día.`;
        
        nameInput.value = nombreLimpio;
        passesInput.value = pases;
    } else {
        greetingEl.innerText = "¡Bienvenidos!";
        passesEl.innerText = "Por favor indícanos tus datos para el registro.";
        nameInput.value = "Invitado General";
        passesInput.value = "1";
    }

    // 2. Manejar el envío del formulario mediante Fetch a Google Apps Script
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const successBox = document.getElementById('success-message');

    // ¡REEMPLAZA ESTA URL CON LA QUE TE GENERE TU GOOGLE APPS SCRIPT!
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID_AQUÍ/exec";

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.innerText = "Registrando asistencia...";

        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            pases_asignados: formData.get('pases_asignados'),
            asistencia: formData.get('asistencia'),
            comentarios: formData.get('comentarios')
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.status === "success") {
                form.style.display = 'none';
                successBox.style.display = 'block';
            } else {
                alert("Hubo un error al registrar. Inténtalo de nuevo.");
                submitBtn.disabled = false;
                submitBtn.innerText = "Confirmar Asistencia";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Fallback visual por restricciones de CORS en algunas peticiones POST de Google
            form.style.display = 'none';
            successBox.style.display = 'block';
        });
    });
});