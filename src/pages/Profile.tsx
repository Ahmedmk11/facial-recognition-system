import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { checkUserRole } from '../utils/CheckRole'
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Select } from 'antd'

import ProfilePicture from '../components/ProfilePicture'
import { checkUserDepartmentAndSite } from '../utils/CheckUserDepartmentAndSite'
import { getAllUsers } from '../utils/GetAllUsers'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { getUserByID } from '../utils/GetUserByID'
import { dateToString } from '../utils/DateToString'
import { getDepartmentID } from '../utils/GetDepartmentIDFromNameSite'
import { updateUser } from '../utils/UpdateUser'
import { stringToDate } from '../utils/stringToDate'
// import { updateUser } from '../utils/UpdateUser'

function Profile() {
    const navigate = useNavigate()
    const { Option, OptGroup } = Select
    const [currUser, setCurrUser] = useState<any>('')
    const [firstFetch, setFirstFetch] = useState<boolean>(true)

    const [role, setRole] = useState<any>(null)
    const [isAllowed, setIsAllowed] = useState<boolean>(false)
    const [isRestricted, setIsRestricted] = useState<boolean>(true)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const [users, setUsers] = useState<any>([])
    const [selectedUser, setSelectedUser] = useState<any>([])

    const [firstName, setFirstName] = useState<string>('TBA')
    const [lastName, setLastName] = useState<string>('TBA')
    const [userName, setUserName] = useState<string>('TBA')

    const [email, setEmail] = useState<string>('TBA')
    const [phone, setPhone] = useState<string>('TBA')
    const [birthdate, setBirthdate] = useState<string>('TBA')
    const [location, setLocation] = useState<string>('TBA')
    const [address, setAddress] = useState<string>('TBA')

    const [jobTitle, setJobTitle] = useState<string>('TBA')
    const [dateJoined, setDateJoined] = useState<string>('TBA')
    const [userRole, setUserRole] = useState<string>('TBA')
    const [status, setStatus] = useState<string>('TBA')

    const [dep, setDep] = useState<string>('TBA')
    const [site, setSite] = useState<string>('TBA')

    const [selectedDepartments, setSelectedDepartments] = useState<any>('')

    useEffect(() => {
        if (selectedUser[0]) {
            checkDepSiteResponse(selectedUser[0])
                .then((departmentNameSiteCurr: any) => {
                    const departmentSiteCurr = departmentNameSiteCurr
                        ? departmentNameSiteCurr[1]
                        : 'TBA'
                    const departmentNameCurr = departmentNameSiteCurr
                        ? departmentNameSiteCurr[0]
                        : 'TBA'
                    console.log('wow', departmentNameSiteCurr)
                    setFirstName(selectedUser[1] ? selectedUser[1] : 'TBA')
                    setLastName(selectedUser[2] ? selectedUser[2] : 'TBA')
                    setUserName(selectedUser[4] ? selectedUser[4] : 'TBA')
                    setEmail(selectedUser[3] ? selectedUser[3] : 'TBA')
                    setPhone(selectedUser[7] ? selectedUser[7] : 'TBA')
                    setBirthdate(
                        selectedUser[10]
                            ? dateToString(selectedUser[10])
                            : 'TBA'
                    )
                    setLocation(selectedUser[14] ? selectedUser[14] : 'TBA')
                    setAddress(selectedUser[6] ? selectedUser[6] : 'TBA')
                    setJobTitle(selectedUser[5] ? selectedUser[5] : 'TBA')
                    setDateJoined(
                        selectedUser[9] ? dateToString(selectedUser[9]) : 'TBA'
                    )
                    setUserRole(selectedUser[8] ? selectedUser[8] : 'TBA')
                    setStatus(selectedUser[11] ? selectedUser[11] : 'TBA')
                    setDep(departmentNameCurr ? departmentNameCurr : 'TBA')
                    setSite(departmentSiteCurr ? departmentSiteCurr : 'TBA')
                    console.log('-----0---------0--------0----------0')
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [selectedUser, selectedOptions])

    useEffect(() => {
        if (selectedUser[12]) {
            setSelectedDepartments(`dep_${selectedUser[12]}`)
        }
        // if (selectedUser[10]) {
        //     setSelectedRoles(`${selectedUser[8]}`)
        // }
        // if (selectedUser[11]) {
        //     setSelectedUserStatus(`u_${selectedUser[11]}`)
        // }
    }, [selectedUser])

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

    const getDepartmentIDResponse = async (n: string, s: string) => {
        try {
            const did = await getDepartmentID(n, s)
            return did
        } catch (error) {
            console.log(error)
            return -1
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

    const checkIsAllowed = async () => {
        if (role == 'super') {
            setIsAllowed(true)
            setIsRestricted(false)
            return
        } else if (role == 'employee') {
            setIsAllowed(false)
            setIsRestricted(true)
            return
        } else if (role == 'admin') {
            setIsRestricted(true)
            if (selectedOptions != 'user_undefined') {
                const selectedUid = selectedOptions.split('_')[1]
                if (currUser[0] == selectedUid) {
                    setIsAllowed(false)
                    return
                } else {
                    setIsAllowed(true)
                    return
                }
            }
        }
    }

    const filteredOptions = departments
        .filter(
            (department: any) =>
                (role == 'admin' && department[3] == '1') || role == 'super'
        )
        .map((department: any) => {
            const optGroupLabel = `${department[1]}, ${department[2]}`
            const usersInDepartment = users.filter(
                (user: any) => user[3] === department[0]
            )
            const userOptions = usersInDepartment
                .filter((user: any) => {
                    if (currUser[8] === 'super') {
                        return true
                    } else if (
                        currUser[8] === 'admin' &&
                        user[4] === 'employee'
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
            console.log('uuuusssss', department)
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
    }, [role, selectedOptions, currUser])

    function handleCancel() {
        checkDepSiteResponse(selectedUser[0])
            .then((departmentNameSiteCurr: any) => {
                const departmentSiteCurr = departmentNameSiteCurr
                    ? departmentNameSiteCurr[1]
                    : 'TBA'
                const departmentNameCurr = departmentNameSiteCurr
                    ? departmentNameSiteCurr[0]
                    : 'TBA'
                console.log('wow', departmentNameSiteCurr)
                setFirstName(selectedUser[1] ? selectedUser[1] : 'TBA')
                setLastName(selectedUser[2] ? selectedUser[2] : 'TBA')
                setUserName(selectedUser[4] ? selectedUser[4] : 'TBA')
                setEmail(selectedUser[3] ? selectedUser[3] : 'TBA')
                setPhone(selectedUser[7] ? selectedUser[7] : 'TBA')
                setBirthdate(
                    selectedUser[10] ? dateToString(selectedUser[10]) : 'TBA'
                )
                setLocation(selectedUser[14] ? selectedUser[14] : 'TBA')
                setAddress(selectedUser[6] ? selectedUser[6] : 'TBA')
                setJobTitle(selectedUser[5] ? selectedUser[5] : 'TBA')
                setDateJoined(
                    selectedUser[9] ? dateToString(selectedUser[9]) : 'TBA'
                )
                setUserRole(selectedUser[8] ? selectedUser[8] : 'TBA')
                setStatus(selectedUser[11] ? selectedUser[11] : 'TBA')
                setDep(departmentNameCurr ? departmentNameCurr : 'TBA')
                setSite(departmentSiteCurr ? departmentSiteCurr : 'TBA')
                console.log('-----0---------0--------0----------0')
            })
            .catch((error) => {
                console.error(error)
            })
        setIsEdit(false)
    }

    useEffect(() => {
        console.log('role: hm ', role)
    }, [role])

    async function handleSave() {
        updateUser(
            selectedUser[0],
            firstName,
            lastName,
            email,
            userName,
            jobTitle,
            address,
            location,
            phone,
            userRole,
            stringToDate(birthdate),
            status,
            parseInt(selectedDepartments.split('_')[1]),
            true
        )
            .then((result: any) => {
                console.log('User updated successfully:', result)
            })
            .catch((error: any) => {
                console.error('Failed to update user:', error)
            })

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

    // useEffect(() => {
    //     setUserRole(selectedRoles)
    // }, [selectedRoles])
    useEffect(() => {
        getDepartmentsResponse()
            .then((departments: any) => {
                const foundDepartment = departments.find(
                    (department: any) => department[0] == selectedDepartments
                )
                if (foundDepartment) {
                    setDep(foundDepartment[1])
                    setSite(foundDepartment[2])
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, [selectedDepartments])
    // useEffect(() => {
    //     setStatus(selectedUserStatus)
    // }, [selectedUserStatus])

    useEffect(() => {
        setSelectedOptions(`user_${currUser[0]}`)
        console.log('currrr', currUser)
    }, [currUser])

    const groupedDepartments: any = {}

    departments.forEach((department: any) => {
        const site = department[2]

        if (!groupedDepartments[site]) {
            groupedDepartments[site] = []
        }

        groupedDepartments[site].push([department[0], department[1]])
        console.log(groupedDepartments)
    })

    const filteredOptionsDepartment = Object.entries(groupedDepartments).map(
        ([site, departments]: [string, any]) => {
            const departmentOptions = departments.map(
                ([id, name]: [string, string], index: number) => (
                    <Option key={`dep_${id}`} value={`dep_${id}`}>
                        {name}
                    </Option>
                )
            )

            return (
                <OptGroup key={`optgroup_${site}`} label={site}>
                    {departmentOptions}
                </OptGroup>
            )
        }
    )

    useEffect(() => {
        console.log('hmmsttatus', status)
    }, [status])

    return (
        <div id='profile-page'>
            <NavBar />
            <div></div>
            <div id='profile-page-content'>
                {role == 'employee' ? null : (
                    <div id='profile-page-content-left'>
                        <Select
                            disabled={isEdit}
                            onChange={handleOptionSelect}
                            value={selectedOptions}
                            filterOption={(inputValue, option) => {
                                let optionLabel = option?.props?.children || ''
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
                                    onClick={async () => {
                                        await handleSave()
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
                            <ProfilePicture id={currUser[0]} />
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
                                    <div className='field-component'>
                                        <p className='field-label'>Email</p>
                                        {isEdit ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleEmailChange(e)
                                                }}
                                                value={email}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>
                                            Phone Number
                                        </p>
                                        {isEdit ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handlePhoneChange(e)
                                                }}
                                                value={phone}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col-4'>
                                    <div className='field-component'>
                                        <p className='field-label'>Birthdate</p>
                                        {isEdit ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleBirthdateChange(e)
                                                }}
                                                value={birthdate}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {birthdate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div className='field-component'>
                                        <p className='field-label'>Location</p>
                                        {isEdit ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleLocationChange(e)
                                                }}
                                                value={location}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>
                                            Street Address
                                        </p>
                                        {isEdit ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleAddressChange(e)
                                                }}
                                                value={address}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <div className='row'>
                                <p className='ppcr-title'>
                                    Employee Information
                                </p>
                                <hr />
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>Job Title</p>
                                        {isEdit && isAllowed ? (
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleJobTitleChange(e)
                                                }}
                                                value={jobTitle}
                                            />
                                        ) : (
                                            <p className='field-content'>
                                                {jobTitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>
                                            Date Joined
                                        </p>
                                        <p className='field-content'>
                                            {dateJoined}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-2 mb-2 custom-row'>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>Role</p>
                                        {isEdit &&
                                        isAllowed &&
                                        !isRestricted ? (
                                            <Select
                                                value={userRole}
                                                onChange={(
                                                    selectedValues: any
                                                ) => {
                                                    setUserRole(selectedValues)
                                                }}>
                                                <Option
                                                    key={`employee`}
                                                    value={`employee`}>
                                                    Employee
                                                </Option>
                                                <Option
                                                    key={`admin`}
                                                    value={`admin`}>
                                                    Admin
                                                </Option>
                                                <Option
                                                    key={`super`}
                                                    value={`super`}>
                                                    Super Admin
                                                </Option>
                                            </Select>
                                        ) : (
                                            <p className='field-content'>
                                                {userRole == 'super'
                                                    ? 'Super Admin'
                                                    : userRole
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      userRole.slice(1)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='field-component'>
                                        <p className='field-label'>
                                            User Status
                                        </p>
                                        {isEdit && isAllowed ? (
                                            <Select
                                                value={
                                                    status == '1'
                                                        ? 'u_1'
                                                        : 'u_0'
                                                }
                                                onChange={(
                                                    selectedValues: any
                                                ) => {
                                                    setStatus(
                                                        selectedValues.split(
                                                            '_'
                                                        )[1]
                                                    )
                                                }}>
                                                <Option
                                                    key={`u_1`}
                                                    value={`u_1`}>
                                                    Active
                                                </Option>
                                                <Option
                                                    key={`u_0`}
                                                    value={`u_0`}>
                                                    Inactive
                                                </Option>
                                            </Select>
                                        ) : (
                                            <p className='field-content'>
                                                {status == '1'
                                                    ? 'Active'
                                                    : status == '0'
                                                    ? 'Inactive'
                                                    : 'TBA'}
                                            </p>
                                        )}
                                    </div>
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
                                    <div className='field-component'>
                                        <p className='field-label'>
                                            Department Name
                                        </p>
                                        {isEdit &&
                                        isAllowed &&
                                        !isRestricted ? (
                                            <Select
                                                value={selectedDepartments}
                                                onChange={(
                                                    selectedValues: any
                                                ) => {
                                                    setSelectedDepartments(
                                                        selectedValues
                                                    )
                                                }}>
                                                {filteredOptionsDepartment}
                                            </Select>
                                        ) : (
                                            <p className='field-content'>
                                                {dep}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    {(!isEdit || !isAllowed) && (
                                        <div className='field-component'>
                                            <p className='field-label'>
                                                Department Site
                                            </p>
                                            <p className='field-content'>
                                                {site}
                                            </p>
                                        </div>
                                    )}
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
