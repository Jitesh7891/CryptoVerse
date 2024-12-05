import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { FaEthereum } from "react-icons/fa"

const Header = () => {
  return (
    <navbar className='navbar' >
        <div className="logo">
            <Link to='/'>
            <h1>CryptoVerse</h1>
            </Link>
            <FaEthereum color='#00FF00' size={"25"} style={{marginLeft:"5px"}} /> 
        </div>
      <ul>
        <li> <Link to='/coins'>Coins</Link></li>
      </ul>
    </navbar>
  )
}

export default Header