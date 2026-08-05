import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BentoHero from './components/BentoHero';
import AuthPortal from './components/AuthPortal';
import ExecutiveDashboard from './components/ExecutiveDashboard';

export default function App() {
    const [view, setView] = useState('landing');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user_data');
        if (token && storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
                setView('dashboard');
            } catch (err) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_data');
            }
        }
    }, []);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        setCurrentUser(null);
        setView('landing');
    };

    return (
        <div className="app-container">
            {view !== 'dashboard' && (
                <Navbar 
                    currentView={view} 
                    setView={setView} 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                />
            )}

            {view === 'landing' && <BentoHero onOpenAuth={() => setView('auth')} />}
            
            {view === 'auth' && (
                <AuthPortal 
                    onLoginSuccess={handleLoginSuccess} 
                    onReturnHome={() => setView('landing')} 
                />
            )}

            {view === 'dashboard' && (
                <ExecutiveDashboard 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                    onReturnHome={() => setView('landing')} 
                />
            )}
        </div>
    );
}
