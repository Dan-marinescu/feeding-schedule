import { useState } from 'react';
import { FeedingTracker } from './components/FeedingTracker';
import AccessibilityStatement from './components/AccessibilityStatement';
import './App.css';

function App() {
  const [route, setRoute] = useState<'main' | 'accessibility'>('main');

  // Keyboard accessible skip to content
  const handleSkip = () => {
    const main = document.getElementById('main-content');
    if (main) main.focus();
  };

  return (
    <div className="app" dir="rtl">
      <a
        href="#main-content"
        className="skip-link"
        onClick={e => { e.preventDefault(); handleSkip(); }}
        tabIndex={0}
      >דלג לתוכן</a>
      <header role="banner">
        <span className="header-icon" role="img" aria-label="baby">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f476.png" alt="baby" style={{height: '3.5rem', width: '3.5rem', verticalAlign: 'middle'}} />
        </span>
        <h1>לו"ז תינוקות</h1>
        <div className="subtitle">כל מה שחשוב לדעת על סדר היום של הקטנטנים <span role="img" aria-label="baby">👶</span></div>
      </header>
      <main id="main-content" tabIndex={-1} aria-label="תוכן ראשי">
        {route === 'main' ? <FeedingTracker /> : <AccessibilityStatement />}
      </main>
      <footer role="contentinfo">
        <nav aria-label="קישורים נוספים">
          <button
            className="footer-link"
            onClick={() => setRoute(route === 'accessibility' ? 'main' : 'accessibility')}
            aria-current={route === 'accessibility' ? 'page' : undefined}
          >
            הצהרת נגישות
          </button>
        </nav>
        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: 8 }}>© כל הזכויות שמורות</div>
      </footer>
    </div>
  );
}

export default App; 