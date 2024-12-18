import React, {useState} from "react";

interface AddWorkEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    fetchEntries: () => void;
}

const AddWorkEntryModal: React.FC<AddWorkEntryModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 fetchEntries
                                                             }) => {
    const [formData, setFormData] = useState({
        date: '',
        location: '',
        teammate: '',
        startTime: '',
        endTime: '',
        breakDuration: 0
    });
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!isOpen) return null;

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/work-entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onClose();
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
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
                                onChange={(e) =>
                                    setFormData({...formData, date: e.target.value})
                                }
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
                                onChange={(e) =>
                                    setFormData({...formData, location: e.target.value})
                                }
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
                                onChange={(e) =>
                                    setFormData({...formData, teammate: e.target.value})
                                }
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
                                onChange={(e) =>
                                    setFormData({...formData, startTime: e.target.value})
                                }
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
                                onChange={(e) =>
                                    setFormData({...formData, endTime: e.target.value})
                                }
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
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        breakDuration: parseInt(e.target.value)
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
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
        </div>
    );
};

export default AddWorkEntryModal;