import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ResourceCataloguePage from './ResourceCataloguePage';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import Bookings from './Bookings';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceCataloguePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
