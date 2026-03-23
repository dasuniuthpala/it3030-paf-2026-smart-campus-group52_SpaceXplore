import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ResourceCataloguePage from './ResourceCataloguePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceCataloguePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
