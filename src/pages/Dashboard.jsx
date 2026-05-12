import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { nanoid } from 'nanoid';
import { Link, Copy, Trash2, ExternalLink, Plus, BarChart3, Calendar } from 'lucide-react';

export default function Dashboard({ user }) {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'links'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLinks(linksData);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const code = nanoid(6);
      await addDoc(collection(db, 'links'), {
        code,
        originalUrl: url.startsWith('http') ? url : `https://${url}`,
        userId: user.uid,
        clicks: 0,
        createdAt: serverTimestamp()
      });
      setUrl('');
    } catch (err) {
      console.error("Erro ao encurtar link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este link?')) {
      try {
        await deleteDoc(doc(db, 'links', id));
      } catch (err) {
        console.error("Erro ao excluir link:", err);
      }
    }
  };

  const handleCopy = (code) => {
    const shortUrl = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '...';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <main className="container animate-fade-in">
      {/* Shorten Form */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Plus size={24} className="text-primary" />
            Encurtar novo link
          </h2>
          <form onSubmit={handleShorten} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Cole sua URL longa aqui (ex: https://google.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1.125rem' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem 2.5rem' }}>
              {loading ? 'Processando...' : 'Encurtar'}
            </button>
          </form>
        </div>
      </section>

      {/* Links List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Seus Links</h3>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{links.length} links criados</span>
        </div>

        {links.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
            <Link size={48} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum link encurtado ainda. Comece colando uma URL acima!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.map((link) => (
              <div key={link.id} className="card animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.125rem' }}>
                      {window.location.host}/r/{link.code}
                    </span>
                    <button 
                      onClick={() => handleCopy(link.code)}
                      style={{ background: 'none', border: 'none', color: copySuccess === link.code ? 'var(--success-color)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
                      title="Copiar link"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <ExternalLink size={14} />
                    <span style={{ 
                      maxWidth: '300px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {link.originalUrl}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      <BarChart3 size={14} />
                      Cliques
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{link.clicks}</span>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      <Calendar size={14} />
                      Data
                    </div>
                    <span style={{ fontWeight: 600 }}>{formatDate(link.createdAt)}</span>
                  </div>

                  <button 
                    onClick={() => handleDelete(link.id)}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem', color: 'var(--error-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    title="Excluir link"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
