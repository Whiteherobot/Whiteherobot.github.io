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
function updatePersonList() {
    const session = window.neo4jSession;
    session.run('MATCH (p:Person) RETURN p')
    .then(result => {
        console.log(result);
        const personsTableBody = document.querySelector('#persons-table tbody');
        personsTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas
        result.records.forEach(record => {
            const person = record.get('p').properties;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.name}</td>
                <td>${person.nickname}</td>
                <td>${person.email}</td>
                <td>${person.city}</td>
                <td>${person.country}</td>
            `;
            console.log(person);    
            personsTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al obtener lista de personas:', error);
    });
}

// Llama a updatePersonList cuando se hace clic en el botón "Personas Registradas"
document.getElementById('llamarpersonas').addEventListener('click', function() {
    console.log("ss");
    updatePersonList();
});

function updateRelationshipList() {
    const session = window.neo4jSession;
    session.run('MATCH (a:Person)-[r:RELATIONSHIP]->(b:Person) RETURN a, r, b')
    .then(result => {
        const relationshipsTableBody = document.querySelector('#relationships-table tbody');
        relationshipsTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas
        result.records.forEach(record => {
            const person1 = record.get('a').properties;
            const relationship = record.get('r').properties;
            const person2 = record.get('b').properties;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person1.name}</td>
                <td>${person2.name}</td>
                <td>${relationship.type}</td>
                <td>${relationship.frequency}</td>
                <td>${relationship.importance}</td>
            `;
            relationshipsTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al obtener lista de relaciones:', error);
    });
}

// Llama a updateRelationshipList cuando se hace clic en el botón "Relaciones Registradas"
document.getElementById('llamarrelaciones').addEventListener('click', function() {
    updateRelationshipList();
});

// Cargar opciones en los nuevos selectores
function loadReportPersonOptions() {
    const session = window.neo4jSession;
    session.run('MATCH (p:Person) RETURN p')
    .then(result => {
        const selects = ['personA', 'personB', 'singlePerson'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '';
            result.records.forEach(record => {
                const person = record.get('p').properties;
                const option = document.createElement('option');
                option.value = person.name;
                option.textContent = `${person.name} (${person.nickname})`;
                select.appendChild(option);
            });
        });
    })
    .catch(error => {
        console.error('Error al cargar opciones de personas:', error);
    });
}

// Buscar persona en común
document.getElementById('searchCommonPerson').addEventListener('click', function() {
    const personA = document.getElementById('personA').value;
    const personB = document.getElementById('personB').value;
    const relationshipType = document.getElementById('relationshipType').value;
    
    const session = window.neo4jSession;
    let query = `
        MATCH (a:Person {name: $personA})-[r:RELATIONSHIP]-(common:Person)-[r2:RELATIONSHIP]-(b:Person {name: $personB})
        WHERE $relationshipType = 'todos' OR r.type = $relationshipType
        RETURN DISTINCT common
    `;

    session.run(query, { personA, personB, relationshipType })
    .then(result => {
        const commonPersonResult = document.getElementById('commonPersonName');
        if (result.records.length > 0) {
            commonPersonResult.textContent = result.records.map(record => record.get('common').properties.name).join(', ');
        } else {
            commonPersonResult.textContent = 'No hay personas en común.';
        }
    })
    .catch(error => {
        console.error('Error al buscar persona en común:', error);
    });
});

// Contar relaciones de una persona
document.getElementById('countRelationships').addEventListener('click', function() {
    const singlePerson = document.getElementById('singlePerson').value;
    
    const session = window.neo4jSession;
    session.run(`
        MATCH (:Person {name: $singlePerson})-[r:RELATIONSHIP]-()
        RETURN COUNT(r) AS totalRelaciones
    `, { singlePerson })
    .then(result => {
        const count = result.records[0].get('totalRelaciones').low; // .low para enteros en Neo4j
        document.getElementById('relationshipCount').textContent = count;
    })
    .catch(error => {
        console.error('Error al contar relaciones:', error);
    });
});

// Cargar las opciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadReportPersonOptions();
});


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
