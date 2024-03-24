import React, { useState, useEffect } from 'react'
import useAxios from "../../utils/useAxios"
import { jwtDecode } from 'jwt-decode'

import "./Landing.scss"

import HeartBanner from "../../assets/Images/heart-banner.png"

import Services from "./Services/Services"

function LandingPage() {

  const [res, setRes] = useState("")
  const api = useAxios()
  const token = localStorage.getItem("authTokens")

  if (token) {
    const decode = jwtDecode(token)
    var user_id = decode.user_id
    var username = decode.username
    var full_name = decode.full_name
    var image = decode.image
    var role = decode.role
    localStorage.setItem('loggedInUser', JSON.stringify(decode))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/test/")
        setRes(response.data.response)
      }
      catch (error) {
        console.log(error)
        setRes("Something went wrong")
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.post("/test/")
        setRes(response.data.response)
      }
      catch (error) {
        console.log(error)
        setRes("Something went wrong")
      }
    }
    fetchPostData()
  }, [])

  return (
    <main className="home-page">
      <section className="landing">
        <div className="contents">
          <div className="display-message">
            {username ? <p>Hello! {role} Welcome to</p> : <p>Welcome to</p>}
            <h1>Swastha Sahayog</h1>
            <p>Connecting Care. Anywhere, Anytime.</p>
            <button>Meet a Doctor</button>
          </div>
          <div className="stats">
            <div className="users">
              <b>999K+</b>
              <p>Online Users</p>
            </div>
            <div className="pharmacies">
              <b>300+</b>
              <p>Pharmacies</p>
            </div>
            <div className="doctors">
              <b>100+</b>
              <p>Doctors</p>
            </div>
          </div>
        </div>
        <img src={HeartBanner} alt="" />
      </section>

      <Services />
    </main>
  )
}

export default LandingPage