import { Button, Divider, Dropdown, Input } from 'antd'
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
import { checkUserDepartmentAndSite } from '../utils/CheckUserDepartmentAndSite'
import axios from 'axios'
import { getAllUsers } from '../utils/GetAllUsers'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { capitalizeWords } from '../utils/Capitalize'
import { getUserByID } from '../utils/GetUserByID'
import { dateToString } from '../utils/DateToString'

function Profile() {
    const navigate = useNavigate()
    const { Option, OptGroup } = Select
    const [currUser, setCurrUser] = useState<any>('')

    const [role, setRole] = useState<any>(null)
    const [viewedUserID, setViewedUserID] = useState<any>('')
    const [isAllowed, setIsAllowed] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const [users, setUsers] = useState<any>([])
    const [selectedUser, setSelectedUser] = useState<any>([])

    const [firstName, setFirstName] = useState<string>('n/a')
    const [lastName, setLastName] = useState<string>('n/a')
    const [userName, setUserName] = useState<string>('n/a')

    const [email, setEmail] = useState<string>('n/a')
    const [phone, setPhone] = useState<string>('n/a')
    const [birthdate, setBirthdate] = useState<string>('n/a')
    const [location, setLocation] = useState<string>('n/a')
    const [address, setAddress] = useState<string>('n/a')

    const [jobTitle, setJobTitle] = useState<string>('n/a')
    const [dateJoined, setDateJoined] = useState<string>('n/a')
    const [userRole, setUserRole] = useState<string>('n/a')
    const [status, setStatus] = useState<string>('n/a')

    const [dep, setDep] = useState<string>('n/a')
    const [site, setSite] = useState<string>('n/a')
    const [depStatus, setDepStatus] = useState<string>('n/a')

    useEffect(() => {
        checkDepSiteResponse(selectedUser[0])
            .then((departmentNameSiteCurr: any) => {
                const departmentStateCurr = departmentNameSiteCurr[2]
                const departmentSiteCurr = departmentNameSiteCurr[1]
                const departmentNameCurr = departmentNameSiteCurr[0]
                console.log('wow', departmentNameSiteCurr)
                setFirstName(selectedUser[1] ? selectedUser[1] : 'n/a')
                setLastName(selectedUser[2] ? selectedUser[2] : 'n/a')
                setUserName(selectedUser[4] ? selectedUser[4] : 'n/a')
                setEmail(selectedUser[3] ? selectedUser[3] : 'n/a')
                setPhone(selectedUser[9] ? selectedUser[9] : 'n/a')
                setBirthdate(
                    dateToString(selectedUser[12])
                        ? dateToString(selectedUser[12])
                        : 'n/a'
                )
                setLocation(
                    selectedUser[7] && selectedUser[8]
                        ? `${selectedUser[7]} / ${selectedUser[8]}`
                        : 'n/a'
                )
                setAddress(selectedUser[6] ? selectedUser[6] : 'n/a')
                setJobTitle(selectedUser[5] ? selectedUser[5] : 'n/a')
                setDateJoined(selectedUser[11] ? selectedUser[11] : 'n/a')
                setUserRole(selectedUser[10] ? selectedUser[10] : 'n/a')
                setStatus(selectedUser[13] ? selectedUser[13] : 'n/a')
                setDep(departmentNameCurr ? departmentNameCurr : 'n/a')
                setSite(departmentSiteCurr ? departmentSiteCurr : 'n/a')
                setDepStatus(departmentStateCurr ? departmentStateCurr : 'n/a')
            })
            .catch((error) => {
                // Handle errors if the promise is rejected
                console.error(error)
            })
    }, [currUser, selectedUser])

    const checkDepSiteResponse = async (uid = '') => {
        try {
            const nameAndSite = await checkUserDepartmentAndSite(uid)
            return nameAndSite
        } catch (error) {
            console.log(error)
            return ['', '']
        }
    }

    const getUsersResponse = async () => {
        try {
            const users = await getAllUsers()
            return users
        } catch (error) {
            console.log(error)
            return []
        }
    }

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
        getDepartmentsResponse()
            .then((departments) => {
                setDepartments(departments)
            })
            .catch((error) => {
                console.error(error)
            })
        getUsersResponse()
            .then((users) => {
                setUsers(users)
            })
            .catch((error) => {
                console.error(error)
            })
        getUserByID()
            .then((user) => {
                setCurrUser(user)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        if (selectedOptions.length > 0) {
            if (selectedOptions.split('_')[1] != 'undefined') {
                getUserByID(selectedOptions.split('_')[1])
                    .then((user) => {
                        setSelectedUser(user)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }, [selectedOptions])

    useEffect(() => {
        console.log(departments)
        console.log(users)
        console.log('selectedUser', selectedUser)
    }, [departments, users, selectedUser])

    const checkIsAllowed = () => {
        if (role == 'super') {
            setIsAllowed(true)
        } else if (role == 'employee') {
            setIsAllowed(false)
        } else if (role == 'admin' && selectedOptions.length != 0) {
            const selectedUid = selectedOptions.split('_')[1]
            console.log('selectedUidddd', selectedUid)
            const departmentNameSiteAdmin: any = checkDepSiteResponse()
            const departmentNameSiteUser: any =
                checkDepSiteResponse(selectedUid)
            const departmentNameAdmin = departmentNameSiteAdmin[0]
            const departmentSiteAdmin = departmentNameSiteAdmin[1]
            const departmentNameUser = departmentNameSiteUser[0]
            const departmentSiteUser = departmentNameSiteUser[1]
            if (
                departmentNameAdmin == departmentNameUser &&
                departmentSiteAdmin == departmentSiteUser
            ) {
                setIsAllowed(false)
            }
        }
    }

    const filteredOptions = departments
        .filter(
            (department: any) =>
                (role == 'admin' && department[0] == 1) || role == 'super'
        )
        .map((department: any) => {
            const optGroupLabel = `${department[1]}, ${department[2]}`
            const usersInDepartment = users.filter(
                (user: any) => user[3] === department[0]
            )
            const userOptions = usersInDepartment
                .filter((user: any) => {
                    if (currUser[10] === 'super') {
                        return true
                    } else if (
                        currUser[10] === 'admin' &&
                        user[10] === 'employee'
                    ) {
                        return true
                    } else if (currUser[0] == user[0]) {
                        return true
                    }
                    return false
                })
                .map((user: any) => (
                    <Option key={`user_${user[0]}`} value={`user_${user[0]}`}>
                        {user[1]} {user[2]}
                    </Option>
                ))

            const selectAllOption =
                usersInDepartment.length > 0 ? null : (
                    <Option
                        disabled
                        key={`nodata_${department[0]}`}
                        value={`nodata_${department[0]}`}>
                        No Users Found
                    </Option>
                )

            return (
                <OptGroup
                    key={`optgroup_${department[0]}`}
                    label={optGroupLabel}>
                    {selectAllOption}
                    {userOptions}
                </OptGroup>
            )
        })

    const handleOptionSelect = (selectedValues: any) => {
        setSelectedOptions(selectedValues)
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
        checkIsAllowed()
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

    useEffect(() => {
        setSelectedOptions(`user_${currUser[0]}`)
    }, [currUser])

    return (
        <div id='profile-page'>
            <NavBar />
            <div></div>
            <div id='profile-page-content'>
                {role == 'employee' ? null : (
                    <div id='profile-page-content-left'>
                        <Select
                            disabled={isEdit}
                            defaultValue={`user_${currUser[0]}`}
                            onChange={handleOptionSelect}
                            value={selectedOptions}
                            filterOption={(inputValue, option) => {
                                let optionLabel = option?.props?.children || ''

                                // If optionLabel is an array, join its elements into a string
                                if (Array.isArray(optionLabel)) {
                                    optionLabel = optionLabel.join('')
                                }

                                const optgroupLabel = option?.props?.label || ''

                                return (
                                    (typeof optionLabel === 'string' &&
                                        optionLabel
                                            .toLowerCase()
                                            .includes(
                                                inputValue.toLowerCase()
                                            )) ||
                                    (typeof optgroupLabel === 'string' &&
                                        optgroupLabel
                                            .toLowerCase()
                                            .includes(inputValue.toLowerCase()))
                                )
                            }}>
                            {filteredOptions}
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
                                    <h1>
                                        {firstName} {lastName}
                                    </h1>
                                )}
                                {isEdit && isAllowed ? (
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
                                    <p id='username'>@{userName}</p>
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
                                        isEdit={isEdit && isAllowed}
                                        handle={handleJobTitleChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Date Joined'
                                        content={dateJoined}
                                        isEdit={isEdit && isAllowed}
                                        handle={handleDateJoinedChange}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <Field
                                        label='Role'
                                        content={
                                            userRole == 'super'
                                                ? 'Super Admin'
                                                : userRole
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  userRole.slice(1)
                                        }
                                        isEdit={isEdit && isAllowed}
                                        handle={handleUserRoleChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Status'
                                        content={
                                            status == '1'
                                                ? 'Active'
                                                : status == '0'
                                                ? 'Inactive'
                                                : 'n/a'
                                        }
                                        isEdit={isEdit && isAllowed}
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
                                        isEdit={isEdit && isAllowed}
                                        handle={handleDepChange}
                                    />
                                </div>
                                <div className='col'>
                                    <Field
                                        label='Site'
                                        content={site}
                                        isEdit={isEdit && isAllowed}
                                        handle={handleSiteChange}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-6'>
                                    <Field
                                        label='Status'
                                        content={
                                            depStatus == '1'
                                                ? 'Active'
                                                : depStatus == '0'
                                                ? 'Inactive'
                                                : 'n/a'
                                        }
                                        isEdit={isEdit && isAllowed}
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
