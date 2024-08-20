import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import ChatApp from './components/chat/chat';  // Este es el componente que mostrarás después de la conexión

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<ChatApp />} />
            </Routes>
        </Router>
    );
}

export default App;
