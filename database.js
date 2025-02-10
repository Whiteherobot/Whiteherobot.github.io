const neo4j = window.neo4j;

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
const session = driver.session();

function close() {
  session.close();
  driver.close();
}

window.neo4jSession = session;
window.neo4jClose = close;
