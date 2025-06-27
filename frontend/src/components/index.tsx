import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <h1 className="text-xl">My Ghostery App</h1>
        </header>
    );
};

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <p>&copy; {new Date().getFullYear()} My Ghostery App</p>
        </footer>
    );
};

export const Button: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => {
    return (
        <button onClick={onClick} className="bg-blue-500 text-white p-2 rounded">
            {label}
        </button>
    );
};