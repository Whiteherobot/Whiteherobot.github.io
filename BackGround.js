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

botonRelaciones.addEventListener('click', function() {
    updateRelationshipList();
});


// Buscar persona en común
buscarFiltrado.addEventListener('click', function() {
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
contarRelaciones.addEventListener('click', function() {
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
