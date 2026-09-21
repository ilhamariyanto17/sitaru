import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Beranda from './pages/Beranda';
import AnalisisIntensitas from './pages/AnalisisIntensitas';
import UnderConstruction from './pages/UnderConstruction';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/analisis-intensitas" element={<AnalisisIntensitas />} />
        <Route path="*" element={<UnderConstruction />} />
      </Routes>
    </BrowserRouter>
  );
}