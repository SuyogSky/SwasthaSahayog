import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import AuthContext from "../../../context/AuthContext"

import "./Login.scss"

import { IoPersonSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";

function Login() {

  const { loginUser } = useContext(AuthContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    email.length > 0 && loginUser(email, password)

    console.log(email)
    console.log(password)
  }

  return (
    <section className="login-section">
      <form action="" onSubmit={handleSubmit}>
        <h1>Log<span>In</span></h1>
        <div className="email">
          <input type="email" name='email' placeholder='Email Address' required />
          <IoPersonSharp />
        </div>

        <div className="password">
          <input type="password" name='password' placeholder='Password' required />
          <FaLock />
        </div>

        <button type="submit">Login</button>

        <p className="no-account">Don't Have an Account? <Link to="/register">Sign Up</Link></p>

      </form>
    </section>
  )
}

export default Login