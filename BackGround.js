document.getElementById('person-form').addEventListener('submit', function(event) {
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

document.getElementById('relationship-form').addEventListener('submit', function(event) {
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

function registerPerson(person) {
    const session = window.neo4jSession;
    session.run(
        'CREATE (p:Person {name: $name, nickname: $nickname, email: $email, city: $city, country: $country}) RETURN p',
        {
            name: person.name,
            nickname: person.nickname,
            email: person.email,
            city: person.city,
            country: person.country
        }
    )
    .then(result => {
        console.log('Persona registrada:', result.records[0].get('p'));
        updatePersonList();
    })
    .catch(error => {
        console.error('Error al registrar persona:', error);
    });
}

function registerRelationship(relationship) {
    const session = window.neo4jSession;
    session.run(
        'MATCH (a:Person {name: $person1}), (b:Person {name: $person2}) ' +
        'CREATE (a)-[r:RELATIONSHIP {type: $type, frequency: $frequency, importance: $importance}]->(b) ' +
        'RETURN r',
        {
            person1: relationship.person1,
            person2: relationship.person2,
            type: relationship.type,
            frequency: relationship.frequency,
            importance: relationship.importance
        }
    )
    .then(result => {
        console.log('Relación registrada:', result.records[0].get('r'));
        updateRelationshipList();
    })
    .catch(error => {
        console.error('Error al registrar relación:', error);
    });
}

function updatePersonList() {
    const session = window.neo4jSession;
    session.run('MATCH (p:Person) RETURN p')
    .then(result => {
        const personsList = document.getElementById('persons-list');
        personsList.innerHTML = '';
        result.records.forEach(record => {
            const person = record.get('p').properties;
            const personItem = document.createElement('div');
            personItem.textContent = `${person.name} (${person.nickname}) - ${person.email}, ${person.city}, ${person.country}`;
            personsList.appendChild(personItem);
        });
    })
    .catch(error => {
        console.error('Error al obtener lista de personas:', error);
    });
}

function updateRelationshipList() {
    const session = window.neo4jSession;
    session.run('MATCH (a:Person)-[r:RELATIONSHIP]->(b:Person) RETURN a, r, b')
    .then(result => {
        const relationshipsList = document.getElementById('relationships-list');
        relationshipsList.innerHTML = '';
        result.records.forEach(record => {
            const person1 = record.get('a').properties;
            const relationship = record.get('r').properties;
            const person2 = record.get('b').properties;
            const relationshipItem = document.createElement('div');
            relationshipItem.textContent = `${person1.name} & ${person2.name} - ${relationship.type}, Frecuencia: ${relationship.frequency}, Importancia: ${relationship.importance}`;
            relationshipsList.appendChild(relationshipItem);
        });
    })
    .catch(error => {
        console.error('Error al obtener lista de relaciones:', error);
    });
}

// Agregar esta función para cargar las opciones en los selectores de "Persona 1" y "Persona 2"
function loadPersonOptions() {
    const session = window.neo4jSession;
    session.run('MATCH (p:Person) RETURN p')
    .then(result => {
        const person1Select = document.getElementById('person1');
        const person2Select = document.getElementById('person2');
        person1Select.innerHTML = '';
        person2Select.innerHTML = '';
        result.records.forEach(record => {
            const person = record.get('p').properties;
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = person.name;
            option1.textContent = `${person.name} (${person.nickname})`;
            option2.value = person.name;
            option2.textContent = `${person.name} (${person.nickname})`;
            person1Select.appendChild(option1);
            person2Select.appendChild(option2);
        });
    })
    .catch(error => {
        console.error('Error al cargar opciones de personas:', error);
    });
}

// Llamar a esta función al cargar la página para asegurar que los selectores estén actualizados
document.addEventListener('DOMContentLoaded', function() {
    loadPersonOptions();
});

// Llamar a esta función después de registrar una persona para actualizar los selectores
function registerPerson(person) {
    const session = window.neo4jSession;
    session.run(
        'CREATE (p:Person {name: $name, nickname: $nickname, email: $email, city: $city, country: $country}) RETURN p',
        {
            name: person.name,
            nickname: person.nickname,
            email: person.email,
            city: person.city,
            country: person.country
        }
    )
    .then(result => {
        console.log('Persona registrada:', result.records[0].get('p'));
        updatePersonList();
        loadPersonOptions(); // Cargar opciones después de registrar una persona
    })
    .catch(error => {
        console.error('Error al registrar persona:', error);
    });
}


// Funcionalidad de los acordeones
const accordions = document.getElementsByClassName('accordion');
for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', function() {
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
}
