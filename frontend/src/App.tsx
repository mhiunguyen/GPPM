import { useEffect } from 'react';
import DermaSafeModern from './components/DermaSafeModern';

function App() {
  // Force scroll to top on mount to prevent auto-scroll issues
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Render the new modern interface by default
  return <DermaSafeModern />;
}

export default App;
