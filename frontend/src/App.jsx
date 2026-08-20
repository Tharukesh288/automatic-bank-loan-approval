import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ApplyPage } from './pages/ApplyPage';
import { ResultPage } from './pages/ResultPage';
import { ManagerPage } from './pages/ManagerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
