import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const userCred = await signInWithEmailAndPassword(auth,email,password);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <div className='login-container'>
    <h1 className='login-h1'>Login Page</h1>
    <form onSubmit={handleSubmit} className='login-form'>
      <div>
        <label className='login-label'>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login-input'
        />
      </div>
      <div>
        <label className='login-label'>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
        />
      </div>
      <button type="submit" className='login-button'>Login</button>
    </form>
    <Link to="/register" className='login-link'>Don't have an account? Register now!</Link>
    </div>
  );
};

export default LoginPage;