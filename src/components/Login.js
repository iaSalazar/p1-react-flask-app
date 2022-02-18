
import react, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  Link
} from "react-router-dom";
import {login, useAuth, logout} from '../auth/auth_handler'
import validator from 'validator'

export default function Login() {

  
  const singUpFormData = Object.freeze({
    first_name: "",
    second_name: "",
    last_name: "",
    email: "",
    password: "",
    roles: "",

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
      setEmailError('Enter valid Email!')
    }
  }

  const handleUsernameChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      setEmailError('Valid Email :)')
      setUsername(e.target.value)
    } else {
      setEmailError('Enter valid Email!')
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
      setEmailError('Enter valid Email!')
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
        <button onClick={onSubmitClick} type="submit" disabled={emailError==='Enter valid Email!'}>
          Login Now
        </button>
      </form>
      //:<button onClick={() => logout()}>Logout</button>}
      : <Navigate to ="/AdminHome"/>}
      <form action="#">
      <label>
      Nombre Concurso
      <input name="name" onChange={handleChange} />
    </label>
    <br />
    <label>
      Identificador
      <input name="url" onChange={handleChange} />
    </label>
    <label>
      Fecha Inicio
      <input name="date_start" onChange={handleChange} type="date" />
    </label>
    <label>
      Fecha Fin
      <input name="date_end" onChange={handleChange} type="date" />
    </label>
    <label>
      Premio
      <input name="pay" onChange={handleChange} type="number"/>
    </label>
    <label>
      Guión
      <textarea name="script" onChange={handleChange} type="textarea" rows="7" cols="70"/>
    </label>
    <label>
      Tips
      <textarea name="tips" onChange={handleChange} type="textarea" rows="7" cols="70"/>
    </label>
        <button onClick={onSubmitSingUpClick} type="submit" disabled={emailError==='Enter valid Email!'}>
          singUp
        </button>
        </form>
    </div>
  )
}