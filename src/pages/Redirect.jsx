import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  increment 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Redirect() {
  const { code } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const q = query(collection(db, 'links'), where('code', '==', code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
          return;
        }

        const linkDoc = querySnapshot.docs[0];
        const linkData = linkDoc.data();

        // Increment clicks
        await updateDoc(doc(db, 'links', linkDoc.id), {
          clicks: increment(1)
        });

        // Redirect
        window.location.href = linkData.originalUrl;
      } catch (err) {
        console.error("Erro no redirecionamento:", err);
        setError(true);
      }
    };

    handleRedirect();
  }, [code]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '1.5rem', maxWidth: '500px' }}>
          <AlertCircle size={64} style={{ color: 'var(--error-color)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Link não encontrado</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            O link que você tentou acessar não existe ou foi removido.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ width: '100%' }}>
            Ir para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Redirecionando...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Aguarde enquanto te levamos ao destino.</p>
      </div>
    </div>
  );
}
