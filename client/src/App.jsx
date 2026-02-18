import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateBatch from './pages/CreateBatch';
import VerifyBatch from './pages/VerifyBatch';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Menu from './pages/Menu';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-primary transition-colors duration-300">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/create-batch" element={<CreateBatch />} />
            <Route path="/verify/:id" element={<VerifyBatch />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
