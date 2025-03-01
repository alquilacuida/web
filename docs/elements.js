const category_list = [
    {"Limpieza y lavandería": {
        "description": "Servicios de limpieza general, limpieza profunda entre huéspedes, lavado de sábanas y toallas."
    }},
    {"Fontanería": {
        "description": "Servicios de reparación y mantenimiento de sistemas de agua, grifos, tuberías y desagües."
    }},
    {"Electricidad": {
        "description": "Reparación y mantenimiento de sistemas eléctricos, iluminación y electrodomésticos."
    }},
    {"Cerrajería y carpintería": {
        "description": "Servicios de reparación de puertas, ventanas, cerraduras y elementos de madera."
    }},
    {"Pintura y albañilería": {
        "description": "Trabajos de pintura, reparación de paredes y pequeñas obras."
    }},
    {"Jardinería y exteriores": {
        "description": "Mantenimiento de jardines, patios y áreas exteriores del alojamiento."
    }},
    {"Internet y domótica": {
        "description": "Configuración y solución de problemas con WiFi, dispositivos inteligentes y sistemas automatizados."
    }},
    {"Control de plagas": {
        "description": "Prevención y eliminación de insectos, roedores y otras plagas."
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
