import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client';

import Home from './pages/Home/index'
import Survey from './pages/Survey/index'
import Header from './components/Header'
import Error from './components/Error/index'
import LoginPage from './pages/LoginPage/index'

const container = document.getElementById('app');

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="*" element={<Error />} />
          {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
        </Routes>
      </Router>
  );
};

//creer le root APRES avoir defini le JSX
const root = createRoot(container!);
root.render(<App />);
// export default App;