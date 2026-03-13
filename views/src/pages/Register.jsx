import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import api from '../api/api';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            alert('Conta criada com sucesso! Faça login.');
            navigate('/');
        } catch (err) {
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors)[0][0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || 'Erro ao conectar ao servidor.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <UserPlus className="text-blue-600" size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Criar Nova Conta</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text" required
                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="João Silva"
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email" required
                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="email@exemplo.com"
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password" required
                                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                        Registrar
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Já tem uma conta? <Link to="/" className="text-blue-600 hover:underline font-medium">Faça Login</Link>
                </p>
            </div>
        </div>
    );
}
