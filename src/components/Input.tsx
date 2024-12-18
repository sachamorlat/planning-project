interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <input
            {...props}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
);