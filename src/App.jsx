import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Kundli from './pages/Kundli';
import Matchmaking from './pages/Matchmaking';
import Horoscopes from './pages/Horoscopes';
import Tarot from './pages/Tarot';
import Chat from './pages/Chat';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kundli" element={<Kundli />} />
          <Route path="/matchmaking" element={<Matchmaking />} />
          <Route path="/horoscopes" element={<Horoscopes />} />
          <Route path="/tarot" element={<Tarot />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
