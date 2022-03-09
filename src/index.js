import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import VoiceHome from './VoiceHome'

<<<<<<< HEAD
ReactDOM.render(
  <React.StrictMode>
    <App />
    
  </React.StrictMode>,
  document.getElementById('root')
=======

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  AdminHome,
  Login
} from "./components";

// ReactDOM.render(
//   <React.StrictMode>
//     <VoiceHome />
//   </React.StrictMode>,
//   document.getElementById('root')
// ); `/contests/user/${userId}`
 ReactDOM.render(<Router>
  
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/contests/user/:id_user" element={<AdminHome />} />
     {/* pagina concurso */}
    <Route path="/api/contests/:id_contest/:url_contest" element={<VoiceHome />} />
    {/* <Route path="/blog" element={<Blog />}>
      <Route path="" element={<Posts />} />
      <Route path=":postSlug" element={<Post />} />
    </Route> */}
  </Routes>
  
</Router>,

document.getElementById("root")
>>>>>>> 32c87d3cec89e7595b1cefc705acb125c4e3b414
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
