import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
 const [fname,setFname] = useState('');   
 const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('First Name:', fname);
    console.log('Last Name:', lname);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div>
        <h1>Register</h1>
    <form onSubmit={handleSubmit}>
        <div>
        <label>First Name:</label>
        <input 
         type="text" 
         value={fname} 
         onChange ={(e) => setFname(e.target.value)}
        />
        </div>
        <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Register</button>
    </form>
    <Link to="/">Already have an account?Login Here!</Link>
    </div>
  );
};

export default Register;