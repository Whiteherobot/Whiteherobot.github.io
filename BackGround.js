var personForm = document.getElementById('person-form');
var relationshipForm = document.getElementById('relationship-form');
var persons = [];
var relationships = [];

// Manejo del formulario de personas
personForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var person = {
        name: document.getElementById('name').value,
        nickname: document.getElementById('nickname').value,
        email: document.getElementById('email').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    };
    persons.push(person);
    updatePersonList();
    console.log('Persona registrada:', person);
});

// Manejo del formulario de relaciones
relationshipForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var relationship = {
        person1: document.getElementById('person1').value,
        person2: document.getElementById('person2').value,
        type: document.getElementById('type').value,
        frequency: document.getElementById('frequency').value,
        importance: document.getElementById('importance').value
    };
    relationships.push(relationship);
    updateRelationshipList();
    console.log('Relación registrada:', relationship);
});

// Actualiza la lista de personas registradas
function updatePersonList() {
    var personsList = document.getElementById('persons-list');
    personsList.innerHTML = '';
    persons.forEach(function (person) {
        var personItem = document.createElement('div');
        personItem.textContent = person.name + " (" + person.nickname + ") - " + person.email + ", " + person.city + ", " + person.country;
        personsList.appendChild(personItem);
    });
}

// Actualiza la lista de relaciones registradas
function updateRelationshipList() {
    var relationshipsList = document.getElementById('relationships-list');
    relationshipsList.innerHTML = '';
    relationships.forEach(function (relationship) {
        var relationshipItem = document.createElement('div');
        relationshipItem.textContent = relationship.person1 + " & " + relationship.person2 + " - " + relationship.type + ", Frecuencia: " + relationship.frequency + ", Importancia: " + relationship.importance;
        relationshipsList.appendChild(relationshipItem);
    });
}

// Funcionalidad de los acordeones
var accordions = document.getElementsByClassName('accordion');
for (var i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', function () {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        }
        else {
            panel.style.display = 'block';
        }
    });
}
