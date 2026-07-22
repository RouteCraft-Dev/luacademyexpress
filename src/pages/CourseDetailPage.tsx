import React from 'react';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

interface CourseDetailPageProps {
  selectedCourse: any;
  completed: number[];
  toggleComplete: (courseId: number) => void;
  navigateTo: (view: string) => void;
  setSelectedCourse: (course: any) => void;
  selectedRoute: any;
  courses: any[];
  fromPage?: string;
}

// Función helper para extraer de forma limpia el ID de YouTube de 11 caracteres
const extractYouTubeId = (urlOrId: string | undefined): string | null => {
  if (!urlOrId) return null;
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  // Si ya es un ID de 11 caracteres puro
  return urlOrId.trim().length === 11 ? urlOrId.trim() : null;
};

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  selectedCourse,
  completed,
  toggleComplete,
  navigateTo,
  setSelectedCourse,
  selectedRoute,
  courses,
  fromPage,
}) => {
  if (!selectedCourse) return null;

  // Extraemos y limpiamos el ID del video
  const rawId = selectedCourse.youtube_id || selectedCourse.videoId;
  const videoId = extractYouTubeId(rawId);

  // --- OBTENER LOS VIDEOS DE LA RUTA ACTUAL ---
  const allowedIds = selectedRoute 
    ? (selectedRoute.courseIds || selectedRoute.video_ids || []) 
    : [];
  
  const routeCourses = (Array.isArray(courses) ? courses : []).filter((c: any) =>
    allowedIds.map(String).includes(String(c.id))
  );

  // --- BUSCAR EL SIGUIENTE VIDEO ---
  const currentIndex = routeCourses.findIndex((c: any) => String(c.id) === String(selectedCourse.id));
  const nextCourse = currentIndex !== -1 && currentIndex < routeCourses.length - 1 
    ? routeCourses[currentIndex + 1] 
    : null;

  const handleBackClick = () => {
    if (fromPage) {
      navigateTo(fromPage);
    } else if (selectedRoute) {
      navigateTo('path-detail');
    } else {
      navigateTo('explorer');
    }
  };

  return (
    <div className="container-center mt-40" style={{ padding: '0 20px' }}>
      <div 
        className="job-detail-card" 
        style={{ 
          background: '#1a1a2e', 
          padding: '40px', 
          borderRadius: '20px', 
          border: '1px solid #334155',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {/* Botón Volver Atrás Directo */}
        <button 
          className="white-text" 
          style={{ 
            color: '#4ade80', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            marginBottom: '20px', 
            fontWeight: 'bold',
            fontSize: '1rem' 
          }} 
          onClick={handleBackClick}
        >
          ← Volver atrás
        </button>
        
        {/* Contenedor del Video */}
        <div style={{ marginBottom: '30px' }}>
          {videoId ? (
            <YouTubeEmbed videoId={videoId} />
          ) : (
            <div 
              style={{ 
                width: '100%', 
                aspectRatio: '16/9', 
                background: '#000', 
                borderRadius: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#94a3b8',
                border: '1px dashed #334155' 
              }}
            >
              <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🚫</span>
              <p style={{ fontWeight: 'bold' }}>Este curso no tiene un ID de video válido configurado.</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Verifica que "youtube_id" esté presente en tu archivo de datos.
              </p>
            </div>
          )}
        </div>
        
        {/* Título y Acciones */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <h1 className="white-text" style={{ fontSize: '2rem', margin: 0 }}>{selectedCourse.title}</h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* Botón de Estado */}
            <button 
              onClick={() => toggleComplete(selectedCourse.id)} 
              className="btn-primary-levelup" 
              style={{ 
                padding: '12px 24px',
                backgroundColor: completed.includes(selectedCourse.id) ? '#3b82f6' : '#4ade80',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {completed.includes(selectedCourse.id) ? '✓ COMPLETADO' : 'MARCAR COMO COMPLETADO'}
            </button>

            {/* Botón Siguiente Video */}
            {nextCourse && (
              <button
                onClick={() => {
                  setSelectedCourse(nextCourse);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fbbf24',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Siguiente Video ⏩
              </button>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="white-text" style={{ marginTop: '25px', opacity: 0.8, lineHeight: '1.6', fontSize: '1.1rem' }}>
          {selectedCourse.description}
        </p>
      </div>
    </div>
  );
};