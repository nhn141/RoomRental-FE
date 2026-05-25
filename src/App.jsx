import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RealtimeProvider } from './context/RealtimeContext';
import routes from './routes';
import './App.css';

const AppRoutes = () => useRoutes(routes);

function App() {
  return (
    <Router>
      <AuthProvider>
        <RealtimeProvider>
          <AppRoutes />
        </RealtimeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
