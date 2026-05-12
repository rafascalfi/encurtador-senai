import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Redirect from './pages/Redirect';
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {user && <Header user={user} />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="/r/:code" element={<Redirect />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
