import React, { useEffect, useState } from 'react';

interface PostulacionItem {
  id: string;
  estado: string;
  createdAt: string;
  vacante: {
    titulo: string;
    empresa: string;
    ubicacion?: string;
  };
}

export const TableroPostulaciones: React.FC<{ usuarioId: string }> = ({ usuarioId }) => {
  const [postulaciones, setPostulaciones] = useState<PostulacionItem[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/postulaciones/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => setPostulaciones(data))
      .catch((err) => console.error(err));
  }, [usuarioId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mis Postulaciones</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '300px' }}>
        <h3>Postulado ({postulaciones.length})</h3>
        {postulaciones.map((p) => (
          <div key={p.id} style={{ background: '#f4f4f4', margin: '8px 0', padding: '8px', borderRadius: '4px' }}>
            <strong>{p.vacante.titulo}</strong>
            <p>{p.vacante.empresa}</p>
            <small>{new Date(p.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
