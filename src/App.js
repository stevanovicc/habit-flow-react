import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loginpage from "./login/Loginpage"
import Register from "./register/Register"
import Home from "./home/Home"

function App() {
    return (
        <div>
            <BrowserRouter>
            <Routes>
                <Route path="/" Component={Loginpage}/>
                <Route path="/register" Component={Register}/>
                <Route path="/home" Component={Home}/>
            </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;