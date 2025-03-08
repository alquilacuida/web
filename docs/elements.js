let locations = [];
let serviceTypes = [];

const api_url = '//backend.alquilacuida.com';

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
            option.value = service;
            option.textContent = service[0];
            select.appendChild(option);
        });
    });
}

// Wait for the DOM to be fully loaded before manipulating elements
document.addEventListener('DOMContentLoaded', function() {
    // Populate category dropdown
    // If locations have been fetched, populate them now
    if (locations.length > 0) {
        populateLocationDropdowns();
        populateServiceTypeDropdown();
    }
    // Otherwise, they'll be populated when the fetch completes
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
