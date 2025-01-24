import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./RegisterPage.css";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { setDoc,doc } from 'firebase/firestore';
import Header from "../components/Header";

const RegisterPage = () => {
 const [fname,setFname] = useState('');   
 const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[erorMessage,setErorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErorMessage('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth,email,password);
     console.log(userCred.user);
      setDoc(doc(db,"users",userCred.user.uid),{
      firstName:fname, lastName:lname,email:email
    })
    navigate('/home');
    } catch(error) {
      if (error.code === 'auth/email-already-in-use') {
        setErorMessage('This email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setErorMessage('Password should be at least 6 characters.');
      } else {
        setErorMessage('Failed to register. Please try again.');
      }
      console.error(error);
    }
    
  };

  return (
    <div className='register-page'>
      <Header/>
      <div className='register-container'>
        <h1 className='register-h1'>Create your account</h1>
        <form className='register-form'>
        <div className='register-div'>
        <label className='register-label'>First Name</label>
        <input 
         type="text" 
         placeholder='Enter your first name'
         value={fname} 
         onChange ={(e) => setFname(e.target.value)}
         className='register-input'
        />
        </div>
        <div className='register-div'>
        <label className='register-label'>Last Name</label>
        <input
          type="text"
          value={lname}
          placeholder='Enter your last name'
          onChange={(e) => setLname(e.target.value)}
          className='register-input'
        />
      </div>
      <div className='register-div'>
        <label htmlFor='email' className='register-label'>Email</label>
        <input
          id='email'
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='register-input'
        />
      </div>
      <div className='register-div'>
        <label htmlFor='password' className='register-label'>Password</label>
        <input
          id='password'
          type="password"
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='register-input'
        />
      </div>
      <button type="submit" onClick={handleSubmit} className='register-button'>Sign Up</button>
    </form>
    {erorMessage && <p className="error-message">{erorMessage}</p>}
    </div>
    </div>
  );
};

export default RegisterPage;