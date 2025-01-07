import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./login/LoginPage"
import RegisterPage from "./register/RegisterPage"
import HomePage from "./home/HomePage"

function App() {
    return (
        <div>
            <BrowserRouter>
            <Routes>
                <Route path="/" Component={LoginPage}/>
                <Route path="/register" Component={RegisterPage}/>
                <Route path="/home" Component={HomePage}/>
            </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;