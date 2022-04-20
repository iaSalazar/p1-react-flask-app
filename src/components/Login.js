
import react, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  useNavigate,
  Link
} from "react-router-dom";
import validator from 'validator'
import {login, authFetch, useAuth, logout} from "../auth"
import Button from 'react-bootstrap/Button'



function checkLoginStatus() {
  fetch('/api/check_logged', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    },
    
  }).then(response=>response.json()).then(response => {
    if(response.status_loged=='logged'){
      console.log('THE USER IS LOGGED IN')
    }else{
      console.log('THE USER IS NOT LOGGED IN')
    }
  })
}

export default function Login() {

  let navigate = useNavigate();
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
  const [firstName, setFirst] = useState('')
  const [secondName, setSecond] = useState('')
  const [lastName, setLast] = useState('')
  const [Email, setEmail] = useState('')
  const [userMail, setUserMail] = useState('')
  const [password, setPassword] = useState('')
  const [singUpUserMail, setSingUserMail] = useState('')
  const [singUpPassword, setSingPassword] = useState('')
  const id = sessionStorage.getItem("id")
  const [userId, setUserId] = useState()
  //const [useAuth, authFetch, login, logout] = useAuthProvider();
  const [logged] = useAuth();
  const navToLogin= `/contests/user/${userId}`


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
          sessionStorage.setItem("id", token.id)
          setTimeout(4000)
          checkLoginStatus()
          console.log(`the id: ${id} should have been saved`)
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
    fetch('/api/signUp', {
      method: 'post',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
          console.log(token.access_token)
          if (token.access_token) {
            login(token.access_token)
            //sessionStorage.setItem("token", token.access_token)
            console.log(token.access_token)
            console.log(token.id)
            setUserId(token.id)
            sessionStorage.setItem("id", token.id)
            setTimeout(4000)
            console.log(`the id: ${id} should have been saved`)
            navigate('/')
          }
          else {
            console.log(token)
            console.log("Please type in correct username/password")
          }
        
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

  const idGet = async() => (sessionStorage.getItem("id"))

  return (
    <div>
      <h2>Login</h2>

      {!logged? (<form action="#">
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
        
        <Button variant="primary" onClick={onSubmitClick} type="submit">
          Login Now
        </Button>
        <p> </p>
      </form>)
      //:<button onClick={() => logout()}>Logout</button>
      //
      : <Navigate to ={`/contests/user`}/>}
      
    <form action="#">
      <label>
      First Name <span>  </span>  
      <input name="name" onChange={handleFirstNameChange} />
    </label>
    
    <label>
    <span>  Second Name </span>
      <input name="url" onChange={handleSecondNameChange} />
    </label>
    <br />
    <label>
      Last Name <span>  </span>
      <input name="last_name" onChange={handleLastNameChange} />
    </label>
    
    <label>
      Email <span>  </span>
      <input name="email" onChange={handleSingUserMailChange}/>
    </label>
    <br />
    <label>
      Password <span>  </span>
      <input name="password" onChange={handleSingPasswordChange} />
    </label>
    
        <Button variant="primary" onClick={onSubmitSingUpClick} type="submit" disabled={emailError==='Enter valid Email!'}>
          singUp
        </Button>
     </form>
     <p>El administrador puede visitar el home y pueda crear una nueva cuenta.</p>
     <p></p>
     <p></p>

     <h1>SuperVoices</h1>
<p> Somos SuperVoices un software dedicado a la realizacion de concursos para encontrar las mejores voces para sus
anuncios publicitarios (videos en YouTube, comerciales en TV y radio, etc.). Nuestros principale clientes son la grandes empresas que se 
en cuentran busca de esa voz diferenciadora para realizar la grabacion de sus archivos multimedia para impulsar empresa.
El modelo general de funcionamiento de nuestra plataforma se basa en que un administrador de una empresa
entra al portal y crea una cuenta. Una vez la cuenta ha sido creada el
administrador puede proceder a configurar los concursos de voces que esa empresa tiene
disponibles en los cuales participarán locutores profesionales o personas interesadas en audicionar en el concurso. Por cada concurso publicado el
sistema genera una URL única que el administrador puede enviar a su listado de locutores profesionales a través de email, para que
estos puedan entrar y subir sus propuestas de voces para cada concurso. Las voces serán revisadas
por el equipo de marketing de la empresa y la mejor voz será contratada por la empresa.</p>
  
    </div>
    
  )
}