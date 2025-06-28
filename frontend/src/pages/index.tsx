import React, { useState } from 'react';
import { Button } from '../components/index';
import { useGetExample } from '../hooks';

const HomePage: React.FC = () => {
    const [inputValue, setInputValue] = useState('World');
    const { data, isLoading, error } = useGetExample(inputValue);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Welcome to the Full Stack Application</h1>
            <p className="text-lg text-gray-700 mb-8">This app demonstrates type-safe communication between React and Node.js</p>
            
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Test Backend Connection</h2>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter your name"
                    />
                    {isLoading && <p>Loading...</p>}
                    {error && <p className="text-red-500">Error: {error.message}</p>}
                    {data && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                            <p className="text-sm text-gray-700">{data}</p>
                        </div>
                    )}
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                        <p>Debug: Loading: {isLoading.toString()}, Error: {error?.message || 'none'}, Data: {data || 'none'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;