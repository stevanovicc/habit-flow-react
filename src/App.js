import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./login/Login"
import Register from "./register/Register"

function App() {
    return (
        <div>
            <BrowserRouter>
            <Routes>
                <Route path="/" Component={Login}/>
                <Route path="/register" Component={Register}/>
            </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;