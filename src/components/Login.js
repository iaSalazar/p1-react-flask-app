
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

  const navToLogin= `/contests/user/${userId}`

  const handleChange = (e) => {
    updateForm({
      ...form,
      [e.target.name]: e.target.value.trim()
    })
  }

  const [form, updateForm] = useState(singUpFormData)
  const [firstName, setFirst] = useState('')
  const [secondName, setSecond] = useState('')
  const [lastName, setLast] = useState('')
  const [Email, setEmail] = useState('')
  const [userMail, setUserMail] = useState('')
  const [password, setPassword] = useState('')
  const [singUpUserMail, setSingUserMail] = useState('')
  const [singUpPassword, setSingPassword] = useState('')
  const token = sessionStorage.getItem("token")
  const [userId, setUserId] = useState('')
  //const [useAuth, authFetch, login, logout] = useAuthProvider();
  const [logged] = useAuth();

  const onSubmitClick = (e) => {
    e.preventDefault()
    console.log("You pressed login")
    let opts = {
      'username': userMail,
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
          console.log(token.id)
          setUserId(token.id)
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
      'first_name':firstName,
      'second_name': secondName,
      'last_name': lastName,
      'email': singUpUserMail,
      'password': singUpPassword,
      'roles':  'admin'
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

  const handleUserMailChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      setEmailError('Valid Email :)')
      setUserMail(e.target.value)
    } else {
      setEmailError('')
    }
    setUserMail(e.target.value)
  }

  const handleFirstNameChange = (e) => {
    setFirst(e.target.value)
  }
  const handleSecondNameChange = (e) => {
    setSecond(e.target.value)
  }
  const handleLastNameChange = (e) => {
    setLast(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleSingUserMailChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      setEmailError('Valid Email :)')
      setUserMail(e.target.value)
    } else {
      setEmailError('')
    }
    setSingUserMail(e.target.value)
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
            placeholder="User Email" 
            onChange={handleUserMailChange}
            value={userMail} 
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
      : <Navigate to ="/contests/"/>}
      
    <form action="#">
      <label>
      First Name
      <input name="name" onChange={handleFirstNameChange} />
    </label>
    <br />
    <label>
      Second Name
      <input name="url" onChange={handleSecondNameChange} />
    </label>
    <label>
      Last Name
      <input name="last_name" onChange={handleLastNameChange} />
    </label>
    <label>
      Email
      <input name="email" onChange={handleSingUserMailChange}/>
    </label>
    <label>
      Password
      <input name="password" onChange={handleSingPasswordChange} />
    </label>
    
        <button onClick={onSubmitSingUpClick} type="submit" disabled={emailError==='Enter valid Email!'}>
          singUp
        </button>
        </form>
    </div>
  )
}