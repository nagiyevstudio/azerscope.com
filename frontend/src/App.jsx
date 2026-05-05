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
      <Header />
      <main>
        <Routes>
          <Route path="/"        element={<Home />}    />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />}   />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
