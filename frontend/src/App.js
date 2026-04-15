import { BrowserRouter, Navigate, Route, Routes,  useParams, useNavigate } from 'react-router-dom';
import Home from './Home';
import ResourceCataloguePage from './ResourceCataloguePage';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import Bookings from './Bookings';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import { CreateTicket, TicketList, TicketDetail } from './components/tickets';

function TicketDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'USER';
  const userName = localStorage.getItem('userName') || 'User';

   return (
    <TicketDetail 
      ticketId={id} 
      userRole={userRole}
      userName={userName}
      onBack={() => navigate('/tickets')}
    />
  );
}
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tickets" element={<TicketList userRole="USER" onSelectTicket={(id) => window.location.href = `/tickets/${id}`} />} />
        <Route path="/tickets/create" element={<CreateTicket onTicketCreated={() => window.location.href = '/tickets'} />} />
        <Route path="/tickets/:id" element={<TicketDetailWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

  
export default App;
