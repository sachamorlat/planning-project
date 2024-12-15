import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Tableau de bord
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Bienvenue, {user?.name} !
                    </h2>
                    <p className="text-gray-600">
                        Vous êtes connecté avec l'email : {user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
}