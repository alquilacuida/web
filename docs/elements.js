const category_list = [
    {"Limpieza y lavandería": {
        "description": "Servicios de limpieza general, limpieza profunda entre huéspedes, lavado de sábanas y toallas.",
        "initial_question": "¿Cuántas habitaciones tiene el alojamiento?",
        "aswer_options": ["1", "2", "3", "4", "5 o más"]
    }},
    {"Fontanería": {
        "description": "Servicios de reparación y mantenimiento de sistemas de agua, grifos, tuberías y desagües.",
        "initial_question": "¿Cuál es el problema con la fontanería?",
        "aswer_options": ["Fuga de agua", "Atasco", "Problema con el grifo", "Problema con el inodoro", "Otro"]
    }},
    {"Electricidad": {
        "description": "Reparación y mantenimiento de sistemas eléctricos, iluminación y electrodomésticos.",
        "initial_question": "¿Cuál es el problema con la electricidad?",
        "aswer_options": ["Falta de electricidad", "Problema con la iluminación", "Problema con los electrodomésticos", "Otro"]
    }},
    {"Cerrajería y carpintería": {
        "description": "Servicios de reparación de puertas, ventanas, cerraduras y elementos de madera.",
        "initial_question": "¿Cuál es el problema con la cerrajería o la carpintería?",
        "aswer_options": ["Problema con la cerradura", "Problema con la puerta", "Problema con la ventana", "Problema con muebles de madera", "Otro"]
    }},
    {"Pintura y albañilería": {
        "description": "Trabajos de pintura, reparación de paredes y pequeñas obras.",
        "initial_question": "¿Qué tipo de trabajo necesita?",
        "aswer_options": ["Pintura", "Reparación de paredes", "Obras menores", "Otro"]
    }},
    {"Jardinería y exteriores": {
        "description": "Mantenimiento de jardines, patios y áreas exteriores del alojamiento.",
        "initial_question": "¿Qué tipo de trabajo necesita?",
        "aswer_options": ["Podar plantas", "Cortar césped", "Limpieza de jardín", "Otro"]
    }},
    {"Internet y domótica": {
        "description": "Configuración y solución de problemas con WiFi, dispositivos inteligentes y sistemas automatizados.",
        "initial_question": "¿Cuál es el problema con Internet o la domótica?",
        "aswer_options": ["Instalar nuevos dispositivos", "Problema con WiFi", "Problema con dispositivos inteligentes", "Problema con sistemas automatizados", "Otro"]
    }},
    {"Control de plagas": {
        "description": "Prevención y eliminación de insectos, roedores y otras plagas.",
        "initial_question": "¿Qué tipo de plaga tiene?",
        "aswer_options": ["Insectos", "Roedores", "Otras plagas", "No estoy seguro"]
    }}
];

const locations = [
    "Torrevieja",
    "Orihuela Costa",
    "La Mata",
    "Guardamar del Segura",
    "Los Montesinos",
    "San Miguel de Salinas",
    "Ciudad Quesada",
    "Rojales",
    "Pilar de la Horadada",
    "Santa Pola"
];

// Wait for the DOM to be fully loaded before manipulating elements
document.addEventListener('DOMContentLoaded', function() {
    // obtain all select elements with the class 'category'
    const category_selects = document.querySelectorAll('select.category');
    category_selects.forEach(select => {
        // add the categories as options to the select element
        category_list.forEach(category => {
            const option = document.createElement('option');
            option.value = Object.keys(category)[0];
            option.textContent = Object.keys(category)[0];
            select.appendChild(option);
        });
    });

    // obtain all select elements with the class 'location'
    const location_selects = document.querySelectorAll('select.location');
    location_selects.forEach(select => {
        // add the locations as options to the select element
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            select.appendChild(option);
        });
    });
});

// hook on to changing the anchor on the page
window.addEventListener('hashchange', function() {
    // obtain the anchor from the URL
    const anchor = window.location.hash;
    // if the anchor is 'chat', start the chat
    if (anchor === '#chat') {
        startChat();
    }
});

function addAnswerOptions(options) {
    const div_options = document.getElementById('answer-options');
    div_options.innerHTML = '';
    if (!options) {
        return;
    }
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-option');
        button.onclick = function() {
            addMessage(option, 'user');
            div_options.innerHTML = '';
        };
        div_options.appendChild(button);
    });
}

function addMessage(text, role, options) {
    // obtain the chat container
    const chat_container = document.querySelector('.chat-box');
    // create a new message element
    const message = document.createElement('div');
    message.classList.add('chat-item', role);
    message.innerText = text;
    // add the message to the chat container
    chat_container.appendChild(message);
    addAnswerOptions(options);
}

function startChat() {
    // obtain the category and location selected by the user
    const category = document.querySelector('select.category').value;
    const location = document.querySelector('select.location').value;
    // obtain the description of the category
    const description = category_list.find(c => Object.keys(c)[0] === category)[category].description;
    // obtain the initial question of the category
    const initial_question = category_list.find(c => Object.keys(c)[0] === category)[category].initial_question;
    // obtain the answer options of the category
    const answer_options = category_list.find(c => Object.keys(c)[0] === category)[category].aswer_options;

    // hide all elements that have the class "remove-on-chat"
    const elements_to_remove = document.querySelectorAll('.remove-on-chat');
    elements_to_remove.forEach(element => {
        element.style.display = 'none';
    });

    // show the chat container
    const chat_container = document.querySelector('.chat-container');
    chat_container.style.display = 'block';

    // create the initial message, using category, location, description and initial question
    addMessage(`Hola, entiendo que necesitas ayuda con ${category} en ${location}. Ofrecemos: ${description}`, 'bot');
    addMessage('Para poder ayudarte mejor, necesito hacerte algunas preguntas.', 'bot');
    addMessage(initial_question, 'bot', answer_options);
}
