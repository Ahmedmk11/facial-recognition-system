import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function Logout() {
    return (
        <div id='logout-page'>
            <NavBar />
            <div id='attendance-container'></div>
            <Footer />
        </div>
    )
}

export default Logout
