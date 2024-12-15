import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {WorkEntry} from "../types/workEntry.ts";

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        location: '',
        teammate: '',
        startTime: '',
        endTime: '',
        breakDuration: 0
    });
    const [view, setView] = useState('list'); // 'list', 'weekly', 'monthly'

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch('/api/work-entries', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setEntries(data);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/work-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowForm(false);
                setFormData({
                    date: '',
                    location: '',
                    teammate: '',
                    startTime: '',
                    endTime: '',
                    breakDuration: 0
                });
                fetchEntries();
            }
        } catch (error) {
            console.error('Error creating entry:', error);
        }
    };

    const EmptyState = () => (
        <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune période enregistrée
            </h3>
            <p className="text-gray-500 mb-4">
                Commencez par ajouter votre première période de travail.
            </p>
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                Ajouter une période
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tableau de bord
                    </h1>
                    {entries.length > 0 && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Nouvelle période
                            </button>
                            <select
                                className="border rounded-lg px-4 py-2"
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                            >
                                <option value="list">Toutes les périodes</option>
                                <option value="weekly">Vue hebdomadaire</option>
                                <option value="monthly">Vue mensuelle</option>
                            </select>
                        </div>
                    )}
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Nouvelle période de travail</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lieu/Chantier
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Équipier
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.teammate}
                                        onChange={(e) => setFormData({...formData, teammate: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure début
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure fin
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pause (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.breakDuration}
                                        onChange={(e) => setFormData({...formData, breakDuration: parseInt(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    {entries.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Lieu</th>
                                    <th className="px-4 py-2 text-left">Équipier</th>
                                    <th className="px-4 py-2 text-left">Début</th>
                                    <th className="px-4 py-2 text-left">Fin</th>
                                    <th className="px-4 py-2 text-left">Pause</th>
                                    <th className="px-4 py-2 text-left">Heures totales</th>
                                </tr>
                                </thead>
                                <tbody>
                                {entries.map((entry: WorkEntry) => (
                                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{entry.location}</td>
                                        <td className="px-4 py-2">{entry.teammate}</td>
                                        <td className="px-4 py-2">{entry.startTime}</td>
                                        <td className="px-4 py-2">{entry.endTime}</td>
                                        <td className="px-4 py-2">{entry.breakDuration} min</td>
                                        <td className="px-4 py-2">
                                            {(
                                                (new Date(`${entry.date}T${entry.endTime}`).getTime() -
                                                    new Date(`${entry.date}T${entry.startTime}`).getTime()) /
                                                (1000 * 60 * 60) -
                                                (entry.breakDuration / 60)
                                            ).toFixed(2)}h
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState/>
                    )}
                </div>
            </div>
        </div>
    );
}