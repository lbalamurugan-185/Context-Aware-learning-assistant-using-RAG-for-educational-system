import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Brain, AlertCircle, Sun, Moon } from 'lucide-react';
import { loginUser, registerUser, loginAsGuest } from '../services/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const { darkMode, toggleTheme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        await registerUser(username, password);
        // Automatically login after successful registration
        await loginUser(username, password);
        navigate('/');
      } else {
        await loginUser(username, password);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response && err.response.status === 401) {
        setError('Incorrect username or password');
      } else {
        setError('An error occurred. Make sure the backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${darkMode ? 'opacity-20' : 'opacity-30'}`}>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all shadow-lg z-20 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className={`w-full max-w-md backdrop-blur-xl border shadow-2xl rounded-3xl p-8 relative z-10 transition-colors duration-300 ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/80 border-white text-slate-800'}`}>
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${!darkMode && 'shadow-blue-500/30'}`}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className={`mt-2 text-sm text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isRegistering 
              ? 'Join Context-Aware Learning Assistant'
              : 'Sign in to access your learning dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans ${
                  darkMode 
                    ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                }`}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans ${
                  darkMode 
                    ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                }`}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse"></div>
            )}
            <div className="relative flex items-center justify-center space-x-2">
              <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </div>
          </button>
        </form>

        <div className={`mt-8 text-center border-t pt-6 space-y-4 ${darkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className={`text-sm transition-colors block w-full ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
          
          <button 
             type="button"
             onClick={() => {
                 loginAsGuest();
                 navigate('/');
             }}
             className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors block w-full"
          >
             Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
