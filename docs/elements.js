let locations = [];
let serviceTypes = [];
let chat_socket = null;
let category;
let customer_location;

const api_url = '//backend.alquilacuida.com';
const chat_url = 'wss://chat.alquilacuida.com/websocket';

// Fetch locations from Google Apps Script
fetch(`${api_url}?op=home`)
    .then(response => response.json())
    .then(data => {
        locations = data.locations;
        serviceTypes = data.serviceTypes;
        // Populate location dropdowns if DOM is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            populateLocationDropdowns();
            populateServiceTypeDropdown();
        }
    })
    .catch(error => {
        console.error('Error fetching locations:', error);
        // Fallback to default locations in case of error
        locations = [
            "Torrevieja", "Orihuela Costa", "La Mata", "Guardamar del Segura",
            "Los Montesinos", "San Miguel de Salinas", "Ciudad Quesada", 
            "Rojales", "Pilar de la Horadada", "Santa Pola"
        ];
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            populateLocationDropdowns();
        }
    });

// Function to populate location dropdowns
function populateLocationDropdowns() {
    const location_selects = document.querySelectorAll('select.location');
    location_selects.forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add the locations as options to the select element
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            select.appendChild(option);
        });
    });
}

// Function to populate service type dropdown
function populateServiceTypeDropdown() {
    const service_selects = document.querySelectorAll('select.category');
    service_selects.forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add the service types as options to the select element
        serviceTypes.forEach(service => {
            const option = document.createElement('option');
            option.value = JSON.stringify(service);
            option.textContent = service[0];
            select.appendChild(option);
        });
    });
}

// Wait for the DOM to be fully loaded before manipulating elements
document.addEventListener('DOMContentLoaded', function() {
    // connect the send button to the chat
    const send_button = document.getElementById('send-button');
    send_button.onclick = function() {
        const input = document.getElementById('chat-input');
        const text = input.value;
        if (text) {
            addMessage(text, 'user');
            input.value = '';
            // remove the answer options
            addAnswerOptions();
        }
    };
    document.getElementById('chat-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          document.getElementById('send-button').click();
        }
      });
    // Populate category dropdown
    // If locations have been fetched, populate them now
    if (locations.length > 0) {
        populateLocationDropdowns();
        populateServiceTypeDropdown();
    }
    // Otherwise, they'll be populated when the fetch completes
    // if the anchor is 'chat', remove it
    if (window.location.hash === '#chat') {
        window.location.hash = '';
    }
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

let first_message = true;

function addMessage(text, role, options) {
    // obtain the chat container
    const chat_container = document.querySelector('.chat-box');
    // create a new message element
    const message = document.createElement('div');
    message.classList.add('chat-item', role);
    message.innerText = text;
    // add the message to the chat container
    chat_container.appendChild(message);
    if (role === 'bot') {
        addAnswerOptions(options);
    }
    else {
        if (first_message) {
            first_message = false;
            chat_socket.send(JSON.stringify({state: "start", category, customer_location, text: text}));
        }
        else {
            chat_socket.send(JSON.stringify({state: "continue", text: text}));
        }
    }
}

function startChat() {
    // obtain the category and location selected by the user
    category = JSON.parse(document.querySelector('select.category').value);
    customer_location = document.querySelector('select.location').value;
    // obtain the description of the category
    const description = category[1];
    // obtain the initial question of the category
    const initial_question = category[2];
    // obtain the answer options of the category
    const answer_options = category[3].split(',');

    // hide all elements that have the class "remove-on-chat"
    const elements_to_remove = document.querySelectorAll('.remove-on-chat');
    elements_to_remove.forEach(element => {
        element.style.display = 'none';
    });

    // show the chat container
    const chat_container = document.querySelector('.chat-container');
    chat_container.style.display = 'block';

    // create the initial message, using category, location, description and initial question
    addMessage(`Hola, entiendo que necesitas ayuda con ${category[0]} en ${customer_location}. Ofrecemos: ${description}`, 'bot');
    addMessage('Para poder ayudarte mejor, necesito hacerte algunas preguntas.', 'bot');
    addMessage(initial_question, 'bot', answer_options);

    // establish a connection to the chat server
    chat_socket = new WebSocket(chat_url);
    // when the connection is established, send a message to the server
    chat_socket.onopen = function() {
    };
    // when a message is received from the server
    chat_socket.onmessage = function(event) {
        // obtain the message from the server
        const message = JSON.parse(event.data);
        // add the message to the chat
        addMessage(message.text, 'bot', message.options);
    };
}
