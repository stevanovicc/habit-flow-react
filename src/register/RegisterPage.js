import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
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
        <h1 className='register-h1'>Register</h1>
        <form onSubmit={handleSubmit} className='register-form'>
        <div className='register-div'>
        <label className='register-label'>First Name:</label>
        <input 
         type="text" 
         value={fname} 
         onChange ={(e) => setFname(e.target.value)}
         className='register-input'
        />
        </div>
        <div className='register-div'>
        <label className='register-label'>Last Name:</label>
        <input
          type="text"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          className='register-input'
        />
      </div>
      <div className='register-div'>
        <label className='register-label'>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='register-input'
        />
      </div>
      <div className='register-div'>
        <label className='register-label'>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='register-input'
        />
      </div>
      <button type="submit" className='register-button'>Register</button>
      {erorMessage && <p className="error-message">{erorMessage}</p>}
    </form>
    <Link to="/" className='register-link'>Already have an account? Login Here!</Link>
    </div>
    </div>
  );
};

export default RegisterPage;