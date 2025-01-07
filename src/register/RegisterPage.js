import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import "./RegisterPage.css";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { setDoc,doc } from 'firebase/firestore';

const RegisterPage = () => {
 const [fname,setFname] = useState('');   
 const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const userCred = await createUserWithEmailAndPassword(auth,email,password);
    console.log(userCred.user);
    setDoc(doc(db,"users",userCred.user.uid),{
      firstName:fname, lastName:lname,email:email
    })
    navigate('/home');
    } catch (error) {
      console.error(error)
    }
    
  };

  return (
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
    </form>
    <Link to="/" className='register-link'>Already have an account? Login Here!</Link>
    </div>
  );
};

export default RegisterPage;