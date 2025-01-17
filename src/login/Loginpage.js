import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Header from "../components/Header";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try{
      const userCred = await signInWithEmailAndPassword(auth,email,password);
      navigate('/home');
    } catch (error) {
      setErrorMessage("Invalid email or password.")
      console.error(error);
    }
  };

  return (
    <div className='login-page'>
    <Header/>
    <div className='login-container'>
    <h1 className='login-title'>Welcome to HabitFlow!</h1>
    <p className='login-subtitle'>Log in to your account</p>
    <form className='login-form'>
      <div className='form'>
        <label htmlFor='email' className='login-label'>Email</label>
        <input
          id='email'
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login-input'
        />
      </div>
      <div className='form'>
        <label htmlFor='password' className='login-label'>Password</label>
        <input
          id='password'
          type="password"
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
        />
      </div>
    </form>
    <button type="submit" className='login-button' onClick={handleSubmit}>Sign in</button>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
  );
};

export default LoginPage;