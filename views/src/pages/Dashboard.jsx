import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, LogOut, DollarSign, Clock } from 'lucide-react';
import api from '../api/api';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({ product_name: '', amount: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data || []);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                setError('Erro ao carregar as encomendas.');
            }
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/orders', formData);
            setFormData({ product_name: '', amount: '' });
            fetchOrders();
            alert('Encomenda criada com sucesso! (Verifica os logs/emails no back-end)');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar a encomenda. Verifica os dados.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Package size={24} />
                        <h1 className="text-xl font-bold">Gestão de Encomendas</h1>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                    >
                        <LogOut size={18} />
                        Terminar Sessão
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Coluna Esquerda: Formulário */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-blue-600" />
                            Nova Encomenda
                        </h2>

                        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                                <input 
                                    type="text" required
                                    value={formData.product_name}
                                    className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Teclado Mecânico"
                                    onChange={e => setFormData({...formData, product_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Montante (€/R$)</label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="number" step="0.01" required
                                        value={formData.amount}
                                        className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="99.90"
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition"
                            >
                                {loading ? 'A processar...' : 'Criar Encomenda'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coluna Direita: Lista de Encomendas */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-md min-h-[400px]">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">As Minhas Encomendas</h2>
                        
                        {orders.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <Package size={48} className="mx-auto mb-2 text-gray-300" />
                                <p>Ainda não tens encomendas criadas.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map(order => (
                                    <div key={order.id} className="border border-gray-100 bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:shadow-sm transition">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{order.product_name}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock size={14} /> 
                                                Estado: <span className="font-medium text-blue-600 capitalize">{order.status}</span>
                                            </p>
                                        </div>
                                        <div className="text-lg font-bold text-gray-800">
                                            ${parseFloat(order.amount).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
