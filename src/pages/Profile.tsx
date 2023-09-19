import { Button, Dropdown, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { checkUserRole } from '../utils/CheckRole'
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Select } from 'antd'

import cancelIcn from '../assets/icons/cancel.svg'
import doneIcn from '../assets/icons/done.svg'
import ProfilePicture from '../components/ProfilePicture'
import Field from '../components/Field'

function Profile() {
    const navigate = useNavigate()
    const [role, setRole] = useState<any>(null)
    const [viewedUser, setViewedUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<any>([])

    const [firstName, setFirstName] = useState<string>('First')
    const [lastName, setLastName] = useState<string>('Last')
    const [userName, setUserName] = useState<string>('username')

    const [email, setEmail] = useState<string>('ahmed@gmail.com')
    const [phone, setPhone] = useState<string>('01550800848')
    const [birthdate, setBirthdate] = useState<string>('21 Sept 2002')
    const [location, setLocation] = useState<string>('cairo')
    const [address, setAddress] = useState<string>('13 el nour')

    const [jobTitle, setJobTitle] = useState<string>('Software Engineer')
    const [dateJoined, setDateJoined] = useState<string>('01 Aug 2023')
    const [userRole, setUserRole] = useState<string>('role')
    const [status, setStatus] = useState<string>('active')

    const [dep, setDep] = useState<string>('Application')
    const [site, setSite] = useState<string>('Maadi Technology Park')
    const [depStatus, setDepStatus] = useState<string>('active')

    const checkIsAdmin = () => {
        if (role == 'super') {
            setIsAdmin(true)
        } else if (role == 'employee') {
            setIsAdmin(false)
        } else {
            if (2) {
                // check if admin department if same as selected user
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        }
    }

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

    const handleEdit = () => {
        setIsEdit(true)
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

    useEffect(() => {
        checkIsAdmin()
    }, [role])

    function handleCancel() {
        setIsEdit(false)
    }

    function handleSave() {
        setIsEdit(false)
    }

    function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFirstName(e.target.value)
    }

    function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setLastName(e.target.value)
    }

    function handleUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserName(e.target.value)
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
    }

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPhone(e.target.value)
    }

    function handleBirthdateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBirthdate(e.target.value)
    }

    function handleLocationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setLocation(e.target.value)
    }

    function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAddress(e.target.value)
    }

    function handleJobTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setJobTitle(e.target.value)
    }

    function handleDateJoinedChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDateJoined(e.target.value)
    }

    function handleUserRoleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserRole(e.target.value)
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStatus(e.target.value)
    }

    function handleDepChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDep(e.target.value)
    }

    function handleSiteChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSite(e.target.value)
    }

    function handleDepStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDepStatus(e.target.value)
    }

    return (
        <div id='profile-page'>
            <NavBar />
            <div></div>
            <div id='profile-page-content'>
                {role == 'employee' ? null : (
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
                    <div className='row justify-content-end'>
                        {isEdit ? (
                            <div
                                className='float-right'
                                style={{
                                    width: 250,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: 12,
                                }}>
                                <button
                                    type='button'
                                    className='btn btn-outline-danger form-btns'
                                    style={{ width: 120 }}
                                    onClick={() => {
                                        handleCancel()
                                    }}>
                                    <CloseOutlined />
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-outline-success form-btns'
                                    style={{ width: 120 }}
                                    onClick={() => {
                                        handleSave()
                                    }}>
                                    <CheckOutlined />
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                type='button'
                                className='btn btn-outline-secondary float-right'
                                style={{ width: 90 }}
                                onClick={() => {
                                    handleEdit()
                                }}>
                                <EditOutlined style={{ marginRight: 8 }} />
                                Edit
                            </button>
                        )}
                    </div>
                    <div className='row'>
                        <div className='col col-3' style={{ marginRight: 26 }}>
                            <ProfilePicture />
                        </div>
                        <div className='col col-8'>
                            <div
                                className='col-6 mb-2'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}>
                                {isEdit ? (
                                    <div className='row'>
                                        <div className='col-5'>
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleFirstNameChange(e)
                                                }}
                                                value={firstName}
                                            />
                                        </div>
                                        <div className='col-5'>
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleLastNameChange(e)
                                                }}
                                                value={lastName}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <h1>Ahmed Mahmoud</h1>
                                )}
                                {isEdit && isAdmin ? (
                                    <div className='col-5'>
                                        <Input
                                            type='text'
                                            onChange={(e) => {
                                                handleUserNameChange(e)
                                            }}
                                            value={userName}
                                        />
                                    </div>
                                ) : (
                                    <p id='username'>@ahmedmk11</p>
                                )}
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
                                        content={email}
                                        isEdit={isEdit}
                                        handle={handleEmailChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Phone Number'
                                        content={phone}
                                        isEdit={isEdit}
                                        handle={handlePhoneChange}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-4'>
                                    <Field
                                        label='Birthdate'
                                        content={birthdate}
                                        isEdit={isEdit}
                                        handle={handleBirthdateChange}
                                    />
                                </div>
                                <div className='col-3'>
                                    <Field
                                        label='Location'
                                        content={location}
                                        isEdit={isEdit}
                                        handle={handleLocationChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Street Address'
                                        content={address}
                                        isEdit={isEdit}
                                        handle={handleAddressChange}
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
                                        content={jobTitle}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleJobTitleChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Date Joined'
                                        content={dateJoined}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleDateJoinedChange}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field
                                        label='Role'
                                        content={userRole}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleUserRoleChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Status'
                                        content={status}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleStatusChange}
                                    />
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
                                        content={dep}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleDepChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Site'
                                        content={site}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleSiteChange}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-6'>
                                    <Field
                                        label='Status'
                                        content={depStatus}
                                        isEdit={isEdit && isAdmin}
                                        handle={handleDepStatusChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-end'>
                        <button
                            type='button'
                            style={{ width: 300 }}
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={() => {
                                navigate('/attendance')
                            }}>
                            View Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
