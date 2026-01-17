import './App.css';
import LoginPage from './pages/login/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import PublicRoute from './routes/PublicRoute';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
