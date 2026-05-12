import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { LogIn, UserPlus, Link, Globe, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message.includes('auth/invalid-credential') 
        ? 'E-mail ou senha incorretos.' 
        : 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Erro ao entrar com Google.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem',
      background: 'radial-gradient(circle at top right, #1e293b, #020617)'
    }}>
      <div className="glass animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2.5rem', 
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Entre para gerenciar seus links' : 'Comece a encurtar seus links hoje'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error-color)', 
            color: 'var(--error-color)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ou continue com</span>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-outline" 
          style={{ width: '100%', gap: '0.75rem' }}
        >
          <Globe size={20} />
          Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-color)', 
              fontWeight: 600, 
              marginLeft: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
}
