import { useState, useEffect } from 'react';
import {WorkEntry} from "../types/workEntry.ts";
import EmptyState from "../components/EmptyState.tsx";
import AddWorkEntryModal from "../components/AddWorkEntryModal.tsx";

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
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
                    <AddWorkEntryModal setShowForm={setShowForm} fetchEntries={fetchEntries} />
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
                        <EmptyState setShowForm={setShowForm}/>
                    )}
                </div>
            </div>
        </div>
    );
}