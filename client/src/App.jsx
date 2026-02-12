import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateBatch from './pages/CreateBatch';
import VerifyBatch from './pages/VerifyBatch';
import Login from './pages/Login';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-gray-900">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-batch" element={<CreateBatch />} />
            <Route path="/verify/:id" element={<VerifyBatch />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
