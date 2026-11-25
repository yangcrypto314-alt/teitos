// Se ejecuta solo antes de "npm start" (y de "npm run api").
// 1) Comprueba que la versión de Node es suficiente.
// 2) Si db.json no existe o está roto, lo crea a partir de db.original.json.
const fs = require('fs');

const [mayor, menor] = process.versions.node.split('.').map(Number);
if (mayor < 22 || (mayor === 22 && menor < 12)) {
  console.error(
    `\nTeitos necesita Node 22.12 o superior (tienes ${process.versions.node}).` +
      '\nDescarga la versión LTS en https://nodejs.org y vuelve a probar.\n'
  );
  process.exit(1);
}

let valido = false;
try {
  const datos = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  valido = Array.isArray(datos.viviendas) && Array.isArray(datos.convocatorias);
} catch {
  valido = false;
}

if (!valido) {
  const datos = JSON.parse(fs.readFileSync('db.original.json', 'utf8'));
  datos.solicitudes = [];
  fs.writeFileSync('db.json', JSON.stringify(datos, null, 2));
  console.log('db.json no existía o estaba dañado: restaurado desde db.original.json');
}
