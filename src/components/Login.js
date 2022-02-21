
import react, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  Link
} from "react-router-dom";
import validator from 'validator'
import {login, authFetch, useAuth, logout} from "../auth"

export default function Login() {

  
  const singUpFormData = Object.freeze({
    first_name: "",
    second_name: "",
    last_name: "",
    email: "",
    password: "",
    roles: "Admin",

  });

  const handleChange = (e) => {
    updateForm({
      ...form,
      [e.target.name]: e.target.value.trim()
    })
  }

  const [form, updateForm] = useState(singUpFormData)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [singUpUsername, setSingUsername] = useState('')
  const [singUpPassword, setSingPassword] = useState('')
  const token = sessionStorage.getItem("token")
  //const [useAuth, authFetch, login, logout] = useAuthProvider();
  const [logged] = useAuth();

  const onSubmitClick = (e) => {
    e.preventDefault()
    console.log("You pressed login")
    let opts = {
      'username': username,
      'password': password
    }
    console.log(opts)
    fetch('/api/login', {
      method: 'post',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
        if (token.access_token) {
          login(token.access_token)
          //sessionStorage.setItem("token", token.access_token)
          console.log(token.access_token)
        }
        else {
          console.log("Please type in correct username/password")
        }
      })
  }

  const onSubmitSingUpClick = (e) => {
    e.preventDefault()
    console.log("You pressed singUp")
    let opts = {
      'username': singUpUsername,
      'password': singUpPassword
    }
    console.log(opts)
    fetch('/api/singUp', {
      method: 'post',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
        
          console.log(token.access_token)
        
        
      })
  }
  const [emailError, setEmailError] = useState(false)
  const validateEmail = (e) => {
    var email = e.target.value
  
    if (validator.isEmail(email)) {
      setEmailError('Valid Email :)')
    } else {
      setEmailError('')
    }
  }

  const handleUsernameChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      setEmailError('Valid Email :)')
      setUsername(e.target.value)
    } else {
      setEmailError('')
    }
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleSingUsernameChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      setEmailError('Valid Email :)')
      setUsername(e.target.value)
    } else {
      setEmailError('')
    }
    setSingUsername(e.target.value)
  }

  const handleSingPasswordChange = (e) => {
    setSingPassword(e.target.value)
  }

  return (
    <div>
      <h2>Login</h2>

      {!logged? <form action="#">
        <div>
          
          <input type="email" 
            placeholder="Username" 
            onChange={handleUsernameChange}
            value={username} 
          />
          
        <span style={{
          fontWeight: 'bold',
          color: 'red',
        }}>{emailError}</span>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <button onClick={onSubmitClick} type="submit">
          Login Now
        </button>
      </form>
      //:<button onClick={() => logout()}>Logout</button>}
      : <Navigate to ="/AdminHome"/>}
      
      <form action="#">
      <label>
      First Name
      <input name="name" onChange={handleChange} />
    </label>
    <br />
    <label>
      Second Name
      <input name="url" onChange={handleChange} />
    </label>
    <label>
      Last Name
      <input name="last_name" onChange={handleChange} />
    </label>
    <label>
      Email
      <input name="email" onChange={handleChange}/>
    </label>
    <label>
      Password
      <input name="pay" onChange={handleChange} type="number"/>
    </label>
    
        <button onClick={onSubmitSingUpClick} type="submit" disabled={emailError==='Enter valid Email!'}>
          singUp
        </button>
        </form>
    </div>
  )
}