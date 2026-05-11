import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Header from './components/Header';
import Footer from './components/Footer';
import './i18n/config';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="cosmic-bg" aria-hidden="true">
        <div className="cosmic-orb cosmic-orb--1" />
        <div className="cosmic-orb cosmic-orb--2" />
        <div className="cosmic-orb cosmic-orb--3" />
      </div>
      <div className="content-layer">
      <Header />
      <main>
        <Routes>
          <Route path="/"        element={<Home />}    />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />}   />
        </Routes>
      </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
