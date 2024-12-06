import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Exchanges from './components/Exchanges/Exchanges';
import Coins from './components/Coins/Coins';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Exchanges />} />
      <Route path='/coins' element={<Coins />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App