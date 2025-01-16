import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    return(
        <header>
        <div>
            <p>HabitFlow</p>
        </div>
        </header>
    );
}
export default Header;


/*{location.pathname.includes("home") ? "Home": location.pathname.includes("register") ? "Register": "Login"}*/