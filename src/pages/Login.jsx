import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login(username, password);
      
      // Redirect berdasarkan level user dari response backend
      if (response.redirect) {
        navigate(response.redirect);
      } else {
        // Fallback redirect berdasarkan level
        switch (response.level) {
          case '1': // ADMIN
            navigate('/admin/dashboard');
            break;
          case '2': // SISWA
            navigate('/siswa/dashboard');
            break;
          case '3': // GURU
            navigate('/guru/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type) => {
    switch (type) {
      case 'siswa':
        setUsername('2018310');
        setPassword('2018310');
        break;
      case 'guru':
        setUsername('willypengajar');
        setPassword('willypengajars4p');
        break;
      case 'admin':
        setUsername('meric');
        setPassword('merics4p');
        break;
      default:
        break;
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img 
            className="w-8 h-8 mr-2" 
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" 
            alt="logo"
          />
          Bimbingan Indonesia
        </div>
        
        <div className="w-full bg-gray-800 rounded-lg shadow border border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Login ke Sistem
            </h1>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900 border border-red-700 text-red-100 rounded-lg">
                {error}
              </div>
            )}
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                  placeholder="masukkan username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-3 focus:ring-blue-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-300">
                      Ingat saya
                    </label>
                  </div>
                </div>
                
                <a href="#" className="text-sm text-blue-500 hover:text-blue-400 hover:underline">
                  Lupa password?
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Demo Login Buttons */}
            <div className="flex space-x-2">
              {['siswa', 'guru', 'admin'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleDemoLogin(type)}
                  className="flex-1 py-2 text-xs text-blue-400 hover:text-blue-300 border border-blue-600 rounded hover:bg-blue-900 transition-colors"
                >
                  Demo {type}
                </button>
              ))}
            </div>

            {/* Demo Credentials Hint */}
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Demo credentials:</p>
              <div className="text-xs text-gray-300 space-y-1">
                <p><span className="text-blue-400">Siswa:</span> 2018310 / 2018310</p>
                <p><span className="text-blue-400">Guru:</span> willypengajar / willypengajars4p</p>
                <p><span className="text-blue-400">Admin:</span> meric / merics4p</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;