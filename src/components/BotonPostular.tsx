import React, { useState } from 'react';

interface Props {
  usuarioId: string;
  vacanteId: string;
}

export const BotonPostular: React.FC<Props> = ({ usuarioId, vacanteId }) => {
  const [cargando, setCargando] = useState(false);
  const [postulado, setPostulado] = useState(false);

  const handlePostular = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/api/postulaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, vacanteId }),
      });
      if (res.ok) {
        setPostulado(true);
      }
    } catch (error) {
      console.error('Error al postularse', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <button
      onClick={handlePostular}
      disabled={cargando || postulado}
      style={{
        backgroundColor: postulado ? '#4CAF50' : '#007bff',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: postulado ? 'default' : 'pointer',
      }}
    >
      {postulado ? '✓ Postulado' : cargando ? 'Enviando...' : 'Postularme'}
    </button>
  );
};
