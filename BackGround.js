formularioPersona.addEventListener('submit', function(event) {
    event.preventDefault();
    const person = {
        name: document.getElementById('name').value,
        nickname: document.getElementById('nickname').value,
        email: document.getElementById('email').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    };
    registerPerson(person);
});

formularioRelacion.addEventListener('submit', function(event) {
    event.preventDefault();
    const relationship = {
        person1: document.getElementById('person1').value,
        person2: document.getElementById('person2').value,
        type: document.getElementById('type').value,
        frequency: document.getElementById('frequency').value,
        importance: document.getElementById('importance').value
    };
    registerRelationship(relationship);
});


// Llama a updateRelationshipList cuando se hace clic en el botón "Relaciones Registradas"
botonRelaciones.addEventListener('click', function() {
    updateRelationshipList();
});

