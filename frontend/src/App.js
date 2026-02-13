import React, { useState } from 'react';
import './App.css';
import ValentinePage from './components/ValentinePage';
import RecordingsPage from './components/RecordingsPage';
import AdminPage from './components/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('valentine');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const renderPage = () => {
    switch(currentPage) {
      case 'valentine':
        return <ValentinePage onNavigate={setCurrentPage} />;
      case 'recordings':
        return (
          <RecordingsPage 
            onNavigate={setCurrentPage}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        );
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      default:
        return <ValentinePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
