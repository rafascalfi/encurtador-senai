import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Link2 } from 'lucide-react';

export default function Header({ user }) {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary-color)', borderRadius: '0.5rem', display: 'flex' }}>
            <Link2 size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Encurta Link Senai
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'none' }}>
            {user.email}
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
