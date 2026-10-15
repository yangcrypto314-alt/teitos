const fs = require('fs');

const datos = JSON.parse(fs.readFileSync('db.original.json', 'utf8'));
datos.solicitudes = [];
fs.writeFileSync('db.json', JSON.stringify(datos, null, 2));

console.log('db.json restaurado: solicitudes vacía');