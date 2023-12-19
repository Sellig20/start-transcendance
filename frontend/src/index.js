import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/index'
import Survey from './pages/Survey/index'
import Header from './components/Header'
import Error from './components/Error/index'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey/:questionNumber" element={<Survey />} />
        <Route path="*" element={<Error />} /> 
         {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)