import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { checkUserRole } from '../utils/CheckRole'
import { getUserByID } from '../utils/GetUserByID'
import { getAllDepartments } from '../utils/GetAllDepartments'
import NotFoundPage from './NotFoundPage'

function Departments() {
    const [role, setRole] = useState<any>(null)
    const [currUser, setCurrUser] = useState<any>('')

    const getDepartmentsResponse = async () => {
        try {
            const deps = await getAllDepartments()
            return deps
        } catch (error) {
            console.log(error)
            return []
        }
    }

    useEffect(() => {
        checkUserRole()
            .then((role) => {
                setRole(role)
            })
            .catch((error) => {
                console.log(error)
            })
        getUserByID()
            .then((user) => {
                setCurrUser(user)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return role == 'super' ? (
        <div id='departments-page'>
            <NavBar />
            <div id='departments-content'>hi</div>
            <Footer />
        </div>
    ) : (
        <NotFoundPage
            msgTitle={'Unauthorized Access'}
            msgContent={
                'You do not have the proper authorization to view this page.'
            }
        />
    )
}

export default Departments
