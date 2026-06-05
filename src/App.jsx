import React, { useState, useEffect } from 'react';
import HeartSplash from './components/HeartSplash';
import Envelope from './components/Envelope';
import InvitationDetails from './components/InvitationDetails';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [screen, setScreen] = useState('splash');   // splash | envelope | details
  const [fading, setFading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  /* Check for admin route on mount and hash changes */
  useEffect(() => {
    const check = () => setIsAdmin(window.location.hash === '#admin');
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const goTo = (next) => {
    setFading(true);
    setTimeout(() => { setScreen(next); setFading(false); }, 500);
  };

  if (isAdmin) return <AdminPanel />;

  return (
    <div
      className="w-full min-h-screen bg-[#FAF3F0] antialiased"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.5s ease' }}
    >
      {screen === 'splash'   && <HeartSplash     onComplete={() => goTo('envelope')} />}
      {screen === 'envelope' && <Envelope         onOpen={() => goTo('details')} />}
      {screen === 'details'  && <InvitationDetails />}
    </div>
  );
}

export default App;
