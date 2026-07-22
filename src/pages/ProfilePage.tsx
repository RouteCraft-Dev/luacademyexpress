import React, { useEffect, useState } from 'react';

interface ProfilePageProps {
  token: string | null;
  handleLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ token, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Carga el perfil simulado directamente desde localStorage
  const fetchProfile = () => {
    const localUser = localStorage.getItem('levelup_user_profile');
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      // Datos por defecto iniciales si no existen
      const defaultUser = {
        name: 'Emmanuel',
        email: 'emmanuel@example.com',
        birthdate: '1998-05-15',
        city: 'Buenos Aires, Argentina',
        phone: '+54 11 1234-5678',
        bio: 'Estudiante de programación enfocado en JavaScript, Python y Rust. Apasionado por el desarrollo de software y la tecnología.',
        linkedin_url: 'https://linkedin.com/in/emmanuel',
        github_url: 'https://github.com/emmanuel',
        portfolio_url: '',
        avatar_base64: ''
      };
      localStorage.setItem('levelup_user_profile', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
  };

  useEffect(() => { 
    fetchProfile(); 
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar_base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanData = {
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
        city: user.city,
        phone: user.phone,
        bio: user.bio,
        linkedin_url: user.linkedin_url,
        github_url: user.github_url,
        portfolio_url: user.portfolio_url,
        avatar_base64: user.avatar_base64
      };
      
      localStorage.setItem('levelup_user_profile', JSON.stringify(cleanData));
      setUser(cleanData);
      setIsEditing(false);
      alert("✨ ¡Perfil actualizado localmente!");
    } catch (err) {
      alert("❌ Error al guardar.");
    }
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("⚠️ ¿ESTÁS SEGURO? Esta acción reseteará los datos de tu cuenta local.");
    if (confirm) {
      localStorage.removeItem('levelup_user_profile');
      alert("Cuenta reseteada de la sesión.");
      handleLogout();
    }
  };

  if (!user) return <div className="white-text" style={{textAlign:'center', marginTop:'50px'}}>Cargando...</div>;

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '20px', background: '#0f172a',
    border: '1px solid #334155', color: 'white', borderRadius: '8px', display: 'block',
    fontFamily: 'inherit'
  };

  const labelStyle = { color: '#4ade80', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', textTransform: 'uppercase' as 'uppercase' };

  return (
    <div className="container-center" style={{ padding: '40px 20px' }}>
      <div style={{ 
        maxWidth: '550px', margin: '0 auto', background: '#1e293b', 
        padding: '35px', borderRadius: '24px', border: '1px solid #334155',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        
        {!isEditing ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '130px', height: '130px', borderRadius: '50%', margin: '0 auto 20px', 
              border: '4px solid #4ade80', overflow: 'hidden', background: '#0f172a',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user.avatar_base64 ? (
                <img src={user.avatar_base64} alt="Avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
              ) : (
                <div style={{fontSize: '4rem'}}>👤</div>
              )}
            </div>
            <h2 className="white-text" style={{ fontSize: '2.2rem', margin: '0 0 5px 0' }}>{user.name || 'Sin nombre'}</h2>
            <p style={{ color: '#4ade80', marginBottom: '20px', marginTop: 0 }}>{user.city || 'Ubicación no cargada'}</p>
            
            <div style={{ textAlign: 'left', background: '#0f172a', padding: '25px', borderRadius: '15px', color: 'white' }}>
              <p style={{ color: '#94a3b8', fontStyle: 'italic', marginBottom: '15px', marginTop: 0 }}>{user.bio || 'Sin biografía.'}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div><strong>📧 Email:</strong> {user.email}</div>
                <div><strong>📅 Nacimiento:</strong> {user.birthdate || 'N/A'}</div>
                <div><strong>📞 Teléfono:</strong> {user.phone || 'N/A'}</div>
                <div><strong>🔗 LinkedIn:</strong> {user.linkedin_url || 'N/A'}</div>
                <div><strong>💻 GitHub:</strong> {user.github_url || 'N/A'}</div>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} className="btn-primary-levelup" style={{ width: '100%', marginTop: '25px', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Editar Perfil
            </button>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Cerrar Sesión</button>
                <button onClick={handleDeleteAccount} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar mi cuenta</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <h3 className="white-text" style={{ marginBottom: '25px', textAlign: 'center', marginTop: 0 }}>Editar Mi Información</h3>
            
            <label style={labelStyle}>Cambiar Foto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{...inputStyle, padding: '8px'}} />

            <label style={labelStyle}>Nombre Completo</label>
            <input style={inputStyle} value={user.name || ''} onChange={e => setUser({...user, name: e.target.value})} />

            <label style={labelStyle}>Ciudad</label>
            <input style={inputStyle} value={user.city || ''} onChange={e => setUser({...user, city: e.target.value})} />

            <label style={labelStyle}>Teléfono</label>
            <input style={inputStyle} value={user.phone || ''} onChange={e => setUser({...user, phone: e.target.value})} />

            <label style={labelStyle}>LinkedIn URL</label>
            <input style={inputStyle} value={user.linkedin_url || ''} onChange={e => setUser({...user, linkedin_url: e.target.value})} />

            <label style={labelStyle}>GitHub URL</label>
            <input style={inputStyle} value={user.github_url || ''} onChange={e => setUser({...user, github_url: e.target.value})} />

            <label style={labelStyle}>Biografía</label>
            <textarea style={{ ...inputStyle, height: '100px', resize: 'none' }} value={user.bio || ''} onChange={e => setUser({...user, bio: e.target.value})} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn-primary-levelup" style={{ flex: 1, padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;