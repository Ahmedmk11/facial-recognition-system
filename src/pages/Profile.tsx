import { Button, Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { checkUserRole } from '../utils/CheckRole'
import { Select } from 'antd'

import plusIcnLight from '../assets/icons/plus-light.svg'
import ProfilePicture from '../components/ProfilePicture'
import Field from '../components/Field'

function Profile() {
    const navigate = useNavigate()
    const [role, setRole] = useState<any>(null)
    const [selectedOptions, setSelectedOptions] = useState<any>([])

    const { Option } = Select

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

    const handleOptionSelect = (selectedValues: any) => {
        if (selectedValues.includes('selectAll')) {
            if (options.length === selectedOptions.length) {
                setSelectedOptions([])
            } else {
                setSelectedOptions(options.map((option) => option.value))
            }
        } else {
            setSelectedOptions(selectedValues)
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
    }, [])

    return (
        <div id='profile-page'>
            <NavBar />
            <div></div>
            <div id='profile-page-content'>
                {role === 'employee' ? null : (
                    <div id='profile-page-content-left'>
                        <Select
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder='Select options'
                            value={selectedOptions}
                            onChange={handleOptionSelect}>
                            <Option value='selectAll'>Select All</Option>
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
                <div id='profile-page-content-right' className='row'>
                    <div className='row'>
                        <div className='col'>
                            <ProfilePicture />
                        </div>
                        <div className='col col-8'>
                            <div className='row'>
                                <h1>Ahmed Mahmoud</h1>
                                <p id='username'>@ahmedmk11</p>
                            </div>
                            <div className='row'>
                                <p className='ppcr-title'>
                                    Personal Information
                                </p>
                                <hr />
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-7'>
                                    <Field
                                        label='Email'
                                        content='ahmedmahmoud1903@outlook.com'
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Phone Number'
                                        content='+201550800848'
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-4'>
                                    <Field
                                        label='Birthdate'
                                        content='21 Sept 2002, (Age 20)'
                                    />
                                </div>
                                <div className='col-3'>
                                    <Field
                                        label='Location'
                                        content='Cairo/Egypt'
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Street Address'
                                        content='13 El Nour, 11, 6'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <div className='row'>
                                <p className='ppcr-title'>
                                    Professional Information
                                </p>
                                <hr />
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field
                                        label='Job Title'
                                        content='Software Engineer'
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Date Joined'
                                        content='01 Aug 2023, (1 Month, 17 Days)'
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field label='Role' content='Super Admin' />
                                </div>
                                <div className='col'>
                                    <Field label='Status' content='Active' />
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='row'>
                                <p className='ppcr-title'>
                                    Department Information
                                </p>
                                <hr />
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field
                                        label='Department'
                                        content='Applications'
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Site'
                                        content='Maadi Technology Park'
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field label='Status' content='Active' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-end'>
                        <button
                            type='button'
                            style={{ width: 300 }}
                            className='btn btn-primary btn-lg float-right custom-button'>
                            View Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
