import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/asset';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-gray-200 shadow-lg py-5 px-10 flex justify-between items-center">
                <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
                <div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-50 to-gray-50">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5">
                        Welcome to Our Platform
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8">
                        Join us to access exclusive features and content. Sign up or log in to get started!
                    </p>
                    <div>
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </button>
                        <button
                            className="ml-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-300 transition"
                            onClick={() => navigate('/login')}
                        >
                            Already Have an Account?
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 py-4 text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
