import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LearningAssistant from "./LearningAssistant";
import Login from "./components/Login";
import { isAuthenticated } from "./services/auth";
import { ThemeProvider } from './contexts/ThemeContext';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="App w-full min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <LearningAssistant />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
