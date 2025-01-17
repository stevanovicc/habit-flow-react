import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo} from "./assets/logo.svg";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import "./Header.css";


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = () =>{
        navigate('/');
    };

    const handleSignOut = () => {
            signOut(auth)
            .then(() => {
                alert("You have been logged out successfully!");
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed.", error);
            });
        };
    
    return(
        <header>
        <div className='header'>
            <div className='logo-container'>
            <Logo/>
            <h2>HabitFlow</h2>
            </div>
            <button className='header-button' onClick={location.pathname.includes("register") ? handleLogin : location.pathname.includes("home") ? handleSignOut : handleRegister}>{location.pathname.includes("home") ? "Sign Out": location.pathname.includes("register") ? "Sign In": "Sign Up"}</button>
        </div>
        </header>
    );
}
export default Header;


/*{location.pathname.includes("home") ? "Home": location.pathname.includes("register") ? "Register": "Login"}*/