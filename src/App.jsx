import React from 'react'
import Exchanges from './components/Exchanges/Exchanges';
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Exchanges />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App