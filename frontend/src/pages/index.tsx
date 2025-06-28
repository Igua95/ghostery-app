import React, { useState } from 'react';
import { Button } from '../components/index';
import { useGetExample, useGetUsers } from '../hooks';

const HomePage: React.FC = () => {
    const [inputValue, setInputValue] = useState('World');
    const { data, isLoading, error } = useGetExample(inputValue);
    const { data: users, isLoading: usersLoading, error: usersError } = useGetUsers();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Chat App</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Users</h2>
                    {usersLoading && <p>Loading users...</p>}
                    {usersError && <p className="text-red-500">Error: {usersError.message}</p>}
                    {users && (
                        <div className="space-y-2">
                            {users.map((user) => (
                                <div key={user.id} className="p-3 bg-gray-50 rounded border">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{user.username}</span>
                                        <span className="text-sm text-gray-500">ID: {user.id}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Test Backend Connection</h2>
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
                </div>
            </div>
        </div>
    );
};

export default HomePage;