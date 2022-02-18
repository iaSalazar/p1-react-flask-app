import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import VoiceHome from './Voice'

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
// );
 ReactDOM.render(<Router>
  
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/AdminHome" element={<AdminHome />} />
     {/* pagina concurso */}
    <Route path="/api/contests/:id_contest/:contest_url" element={<VoiceHome />} />
    {/* <Route path="/blog" element={<Blog />}>
      <Route path="" element={<Posts />} />
      <Route path=":postSlug" element={<Post />} />
    </Route> */}
  </Routes>
  
</Router>,

document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
