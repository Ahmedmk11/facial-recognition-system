import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function Home() {
    const navigate = useNavigate()

    return (
        <div id='home-page'>
            <NavBar />
            <div id='home-container'></div>
            <Footer />
        </div>
    )
}

export default Home
