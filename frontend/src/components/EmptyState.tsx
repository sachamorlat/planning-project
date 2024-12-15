import { Clock } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmptyState: React.FC<EmptyStateProps> = ({ setShowForm }) => (
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

export default EmptyState;