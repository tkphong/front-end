import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Main from './pages/Main/Main';
import NotFound from './pages/Not found/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import Start from './pages/start/Start';
import About from './pages/aboutUs/about';

function App() {
    return (
        <BrowserRouter>
            <div className='app'>
                <Routes>
                    <Route exact path="/" element={< Start />}/>
                    <Route exact path="/main" element={< Main />}/>
                    <Route exact path="/about" element={< About />}/>
                    <Route exact path="/dashboard" element={< Dashboard />}/>
                    <Route path="*" element={< NotFound />}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
