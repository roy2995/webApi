import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import logo from './assets/logo.jpg';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    User: username,
                    Password: password,
                }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok && !data.error) {
                console.log('Login exitoso:', data);

                // Identificar el rol del usuario
                const role = data.body.Role;

                // Redirigir dependiendo del rol
                if (role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (role === 'user') {
                    window.location.href = '/user-dashboard';
                } else {
                    window.location.href = '/default-dashboard';
                }
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setLoading(false);
            setError('Error en la conexión. Inténtalo de nuevo.');
            console.error('Error en la conexión:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-24 h-24" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex items-center">
                        <User className="text-gray-700 mr-2" />
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6 flex items-center">
                        <Lock className="text-gray-700 mr-2" />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
