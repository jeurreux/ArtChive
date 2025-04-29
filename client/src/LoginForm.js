import React, { useState } from 'react';


function LoginForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
        <div>
          <h2>Login</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit">Login</button>
          </form>
        </div>
      );
    
    }

export default LoginForm;
