import { Link } from 'react-router';

export default function NoEncontrada() {
  return (
    <section>
      <h2>Página no encontrada</h2>
      <p>La dirección que has escrito no existe o ha cambiado.</p>
      <p>
        <Link to="/">Volver al inicio</Link> ·{' '}
        <Link to="/viviendas">Ver viviendas</Link>
      </p>
    </section>
  );
}