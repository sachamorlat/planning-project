import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError('Une erreur est survenue lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Inscription
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nom"
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        label="Mot de passe"
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <Button type="submit" isLoading={isLoading}>
                        S'inscrire
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Déjà un compte ?{' '}
                    <a href="/login" className="text-blue-500 hover:text-blue-600">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    );
}