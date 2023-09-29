import { DatePicker, Input, Modal, Skeleton, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { checkUserRole } from '../utils/CheckRole'
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Select } from 'antd'

import { checkUserDepartmentAndSite } from '../utils/CheckUserDepartmentAndSite'
import { getAllUsers } from '../utils/GetAllUsers'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { getUserByID } from '../utils/GetUserByID'
import { dateToString } from '../utils/DateToString'
import { getDepartmentID } from '../utils/GetDepartmentIDFromNameSite'
import { updateUser } from '../utils/UpdateUser'
import { stringToDate } from '../utils/stringToDate'
import { stringToDayJs } from '../utils/StringToDayJs'
import { dayJsToString } from '../utils/DayJsToString'
import {
    checkEmailInUse,
    checkNumberInUse,
    checkUserNameInUse,
} from '../utils/ValidationAlreadyExists'
import Footer from '../components/Footer'
import Webcam from 'react-webcam'

function Profile() {
    const navigate = useNavigate()
    const { Option, OptGroup } = Select
    const [currUser, setCurrUser] = useState<any>('')
    const [filteredOptions, setFilteredOptions] = useState<any>([])
    const [render, setRender] = useState<boolean>(true)
    const [editProfilePic, setEditProfilePic] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

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
    const [image, setImage] = useState<any>(null)

    const [dep, setDep] = useState<string>('TBA')
    const [site, setSite] = useState<string>('TBA')

    const [selectedDepartments, setSelectedDepartments] = useState<any>('')

    const [firstNameError, setFirstNameError] = useState<string>('')
    const [lastNameError, setLastNameError] = useState<string>('')
    const [userNameError, setUserNameError] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')
    const [phoneError, setPhoneError] = useState<string>('')
    const [locationError, setLocationError] = useState<string>('')
    const [addressError, setAddressError] = useState<string>('')
    const [jobTitleError, setJobTitleError] = useState<string>('')

    const [screenshot, setScreenshot] = useState<any>(null)

    const webcamRef = React.useRef(null)
    const inputRef = React.useRef(null)
    const [open, setOpen] = useState(false)

    const showModal = () => {
        setScreenshot(null)
        setIsEdit(true)
        setOpen(true)
    }

    const handleOk = () => {
        setOpen(false)
        setScreenshot(null)
    }

    const handleCancelModal = () => {
        setOpen(false)
        setIsEdit(false)
        setScreenshot(null)
    }

    const capture = React.useCallback(() => {
        const cam = webcamRef.current as any
        const imageSrc = cam.getScreenshot()
        setScreenshot(imageSrc)
    }, [webcamRef])

    const retake = React.useCallback(() => {
        setScreenshot(null)
    }, [webcamRef])

    const handleSaveImage = () => {
        if (screenshot) {
            setImage(screenshot.split('data:image/jpeg;base64,')[1])
            console.log('ss', screenshot.split('data:image/jpeg;base64,')[1])
            handleOk()
        }
    }

    const validateFirstName = (value: string) => {
        if (/^[A-Za-z]{2,128}$/.test(value)) {
            setFirstNameError('')
        } else {
            setFirstNameError(
                'Please enter English letters only and between 2 to 128 characters.'
            )
        }
    }

    const validateLastName = (value: string) => {
        if (/^[A-Za-z]{2,128}$/.test(value)) {
            setLastNameError('')
        } else {
            setLastNameError(
                'Please enter English letters only and between 2 to 128 characters.'
            )
        }
    }

    const validateUserName = async (value: string) => {
        if (/^[A-Za-z0-9_]{6,64}$/.test(value)) {
            if (value == selectedUser[4]) {
                setUserNameError('')
            } else {
                try {
                    setUserNameError('')
                    await checkUserNameInUse({}, value)
                } catch (error) {
                    setUserNameError('Username is taken')
                }
            }
        } else {
            setUserNameError(
                'Please enter 6 to 64 characters, letters, numbers, and underscores only.'
            )
        }
    }

    const validateEmail = async (value: string) => {
        if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,128}$/.test(value)) {
            if (value == selectedUser[3]) {
                setEmailError('')
            } else {
                try {
                    setEmailError('')
                    await checkEmailInUse({}, value)
                } catch (error) {
                    setEmailError('Email is already in use')
                }
            }
        } else {
            setEmailError('Please enter a valid email address.')
        }
    }

    const validatePhone = async (value: string) => {
        if (/^[\d()+-]{0,15}$/.test(value)) {
            if (value == selectedUser[7]) {
                setPhoneError('')
            } else {
                try {
                    setPhoneError('')
                    await checkNumberInUse({}, value)
                } catch (error) {
                    setPhoneError('Phone number is already in use')
                }
            }
        } else {
            setPhoneError('Please enter a valid phone number.')
        }
    }

    const validateLocation = (value: string) => {
        if (
            /^[A-Za-z, ]{0,255}$/.test(value) &&
            value.split(',').length === 2
        ) {
            setLocationError('')
        } else {
            setLocationError(
                'Please enter a valid location, must contain a comma. (e.g. City, Country).'
            )
        }
    }

    const validateAddress = (value: string) => {
        if (value.length <= 95) {
            setAddressError('')
        } else {
            setAddressError("Address shouldn't exceed 95 characters.")
        }
    }

    const validateJobTitle = (value: string) => {
        if (value.length <= 128) {
            setJobTitleError('')
        } else {
            setJobTitleError("Job title shouldn't exceed 128 characters.")
        }
    }

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
                            ? dateToString(selectedUser[10]).split(', ')[1]
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
                    setImage(selectedUser[13] ? selectedUser[13] : 'TBA')
                    setDep(departmentNameCurr ? departmentNameCurr : 'TBA')
                    setSite(departmentSiteCurr ? departmentSiteCurr : 'TBA')
                    console.log('-----0---------0--------0----------0')
                    setIsLoading(false)
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
        setFilteredOptions(
            departments
                .filter(
                    (department: any) =>
                        (role == 'admin' && department[3] == '1') ||
                        role == 'super'
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
                            <Option
                                key={`user_${user[0]}`}
                                value={`user_${user[0]}`}>
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
        )
    }, [render, selectedUser]) // PROBLEM: Select departments arent updated until refresh

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
                    selectedUser[10]
                        ? dateToString(selectedUser[10]).split(', ')[1]
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
                setImage(selectedUser[13] ? selectedUser[13] : 'TBA')
                setDep(departmentNameCurr ? departmentNameCurr : 'TBA')
                setSite(departmentSiteCurr ? departmentSiteCurr : 'TBA')
                console.log('-----0---------0--------0----------0')
            })
            .catch((error) => {
                console.error(error)
            })
        setFirstNameError('')
        setLastNameError('')
        setUserNameError('')
        setEmailError('')
        setPhoneError('')
        setLocationError('')
        setAddressError('')
        setJobTitleError('')
        setIsEdit(false)
    }

    useEffect(() => {
        console.log('role: hm ', role)
    }, [role])

    async function handleSave() {
        if (
            !firstNameError &&
            !lastNameError &&
            !userNameError &&
            !emailError &&
            !phoneError &&
            !locationError &&
            !addressError &&
            !jobTitleError
        ) {
            setRender(!render)
            console.log('bb', stringToDate(birthdate))
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
                `data:image/jpeg;base64, ${image}`,
                true
            )
                .then((result: any) => {
                    console.log('User updated successfully:', result)
                })
                .catch((error: any) => {
                    console.error('Failed to update user:', error)
                })

            setIsEdit(false)
            message.success('Changes saved successfully', 4)
        } else {
            message.error(
                'Please review the highlighted fields and make sure they meet the required criteria before saving.',
                4
            )
        }
    }

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFirstName(value)
        validateFirstName(value)
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLastName(value)
        validateLastName(value)
    }

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUserName(value)
        validateUserName(value)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        validateEmail(value)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPhone(value)
        validatePhone(value)
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLocation(value)
        validateLocation(value)
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setAddress(value)
        validateAddress(value)
    }

    const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setJobTitle(value)
        validateJobTitle(value)
    }

    function handleBirthdateChange(d: any) {
        setBirthdate(d)
    }

    function handleImageChange(d: any) {
        setImage(null)
    }

    useEffect(() => {
        getDepartmentsResponse()
            .then((departments: any) => {
                const foundDepartment = departments.find(
                    (department: any) =>
                        department[0] == selectedDepartments.split('_')[1]
                )
                if (foundDepartment) {
                    console.log(foundDepartment)
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

    function upload(event: any): void {
        if (inputRef && inputRef.current) {
            const inp = inputRef.current as any
            inp.click()
        }
    }

    function handleFileUpload(event: any) {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            if (selectedFile.type === 'image/jpeg') {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const base64Image = e.target?.result as string
                    console.log('Base64-encoded image:', base64Image)
                    if (base64Image) {
                        setScreenshot(base64Image) // force 480x480
                    } else {
                        console.error('Invalid base64 image format')
                    }
                }

                reader.readAsDataURL(selectedFile)
            } else {
                console.log('Please select a JPEG image.')
            }
        }
    }

    return (
        <div id='profile-page'>
            <NavBar />
            <div></div>
            <div id='profile-page-content'>
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
                                disabled={isLoading}
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
                            {isLoading ? (
                                <Skeleton.Avatar
                                    active
                                    shape='square'
                                    style={{
                                        width: 260,
                                        height: 260,
                                        borderRadius: 6,
                                    }}
                                />
                            ) : (
                                <div
                                    id='profile-picture-component'
                                    onMouseEnter={() => {
                                        setEditProfilePic(true)
                                    }}
                                    onMouseLeave={() => {
                                        setEditProfilePic(false)
                                    }}
                                    onClick={showModal}>
                                    <EditOutlined
                                        id='edit-profile-pic'
                                        style={
                                            editProfilePic
                                                ? {}
                                                : { display: 'none' }
                                        }
                                    />

                                    <img
                                        id='user-picture'
                                        src={`data:image/jpeg;base64, ${image}`}
                                        alt='User image'
                                        style={{ objectFit: 'cover' }} // Maintain aspect ratio
                                        width={260}
                                        height={260}
                                    />
                                    <div id='pp-bottom'>
                                        <p>ID: {selectedUser[0]}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='col col-8'>
                            <div
                                className='col-12 mb-2'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}>
                                {isEdit ? (
                                    <div className='row'>
                                        <div className='col-5'>
                                            {isLoading ? (
                                                <Skeleton.Input active />
                                            ) : (
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handleFirstNameChange(e)
                                                    }}
                                                    value={firstName}
                                                />
                                            )}
                                            {firstNameError && (
                                                <div className='error-msg'>
                                                    {firstNameError}
                                                </div>
                                            )}
                                        </div>
                                        <div className='col-5'>
                                            <Input
                                                type='text'
                                                onChange={(e) => {
                                                    handleLastNameChange(e)
                                                }}
                                                value={lastName}
                                            />
                                            {lastNameError && (
                                                <div className='error-msg'>
                                                    {lastNameError}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : isLoading ? (
                                    <Skeleton.Input active />
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
                                        {userNameError && (
                                            <div className='error-msg'>
                                                {userNameError}
                                            </div>
                                        )}
                                    </div>
                                ) : isLoading ? (
                                    <Skeleton.Input active />
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
                                            <>
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handleEmailChange(e)
                                                    }}
                                                    value={email}
                                                />
                                                {emailError && (
                                                    <div className='error-msg'>
                                                        {emailError}
                                                    </div>
                                                )}
                                            </>
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                            <>
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handlePhoneChange(e)
                                                    }}
                                                    value={phone}
                                                />
                                                {phoneError && (
                                                    <div className='error-msg'>
                                                        {phoneError}
                                                    </div>
                                                )}
                                            </>
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                            <DatePicker
                                                value={stringToDayJs(birthdate)}
                                                onChange={(dayjs: any) => {
                                                    handleBirthdateChange(
                                                        dayJsToString(dayjs)
                                                    )
                                                }}
                                            />
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                            <>
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handleLocationChange(e)
                                                    }}
                                                    value={location}
                                                />
                                                {locationError && (
                                                    <div className='error-msg'>
                                                        {locationError}
                                                    </div>
                                                )}
                                            </>
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                            <>
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handleAddressChange(e)
                                                    }}
                                                    value={address}
                                                />
                                                {addressError && (
                                                    <div className='error-msg'>
                                                        {addressError}
                                                    </div>
                                                )}
                                            </>
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                            <>
                                                <Input
                                                    type='text'
                                                    onChange={(e) => {
                                                        handleJobTitleChange(e)
                                                    }}
                                                    value={jobTitle}
                                                />
                                                {jobTitleError && (
                                                    <div className='error-msg'>
                                                        {jobTitleError}
                                                    </div>
                                                )}
                                            </>
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                        {isLoading ? (
                                            <Skeleton.Input active />
                                        ) : (
                                            <p className='field-content'>
                                                {dateJoined}
                                            </p>
                                        )}
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
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                        ) : isLoading ? (
                                            <Skeleton.Input active />
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
                                                {isLoading ? (
                                                    <Skeleton.Input active />
                                                ) : (
                                                    site
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-end'>
                        <button
                            disabled={isLoading}
                            type='button'
                            style={{ width: 300 }}
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={() => {
                                navigate('/attendance', {
                                    state: {
                                        uid: selectedUser[0],
                                    },
                                })
                            }}>
                            View Attendance
                        </button>
                    </div>
                </div>
                {role == 'employee' ? null : (
                    <div id='profile-page-content-left'>
                        {isLoading ? (
                            <Skeleton.Input active />
                        ) : (
                            <Select
                                disabled={isEdit && isLoading}
                                onChange={handleOptionSelect}
                                value={selectedOptions}
                                filterOption={(inputValue, option) => {
                                    let optionLabel =
                                        option?.props?.children || ''
                                    if (Array.isArray(optionLabel)) {
                                        optionLabel = optionLabel.join('')
                                    }

                                    const optgroupLabel =
                                        option?.props?.label || ''

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
                                                .includes(
                                                    inputValue.toLowerCase()
                                                ))
                                    )
                                }}>
                                {filteredOptions}
                            </Select>
                        )}
                    </div>
                )}
            </div>
            <Footer />
            <Modal
                destroyOnClose
                title='Change Profile Picture'
                open={open}
                onOk={handleOk}
                onCancel={handleCancelModal}
                width={1000}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                footer={[
                    <div key={0} className='webcam-buttons'>
                        <button
                            type='button'
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={
                                currUser[0] == selectedUser[0]
                                    ? screenshot
                                        ? retake
                                        : capture
                                    : upload
                            }>
                            {currUser[0] == selectedUser[0]
                                ? screenshot
                                    ? 'Retake'
                                    : 'Capture'
                                : 'Upload'}
                        </button>
                        <button
                            disabled={screenshot ? false : true}
                            type='button'
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={handleSaveImage}>
                            Done
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={handleCancelModal}>
                            Cancel
                        </button>
                    </div>,
                ]}>
                <div id='webcam-container'>
                    {screenshot && currUser[0] == selectedUser[0] ? (
                        <div
                            style={{
                                height: 480,
                                width: 480,
                            }}>
                            <img
                                src={screenshot}
                                alt='Captured'
                                width={480}
                                height={480}
                                style={{ objectFit: 'cover' }} // Maintain aspect ratio
                            />
                        </div>
                    ) : currUser[0] == selectedUser[0] ? (
                        <div className='video-container'>
                            <Webcam
                                className='webcam-video'
                                ref={webcamRef}
                                audio={false}
                                height={480}
                                width={480}
                                mirrored
                                screenshotQuality={1}
                                screenshotFormat='image/jpeg'
                            />
                            <div className='face-overlay'></div>
                        </div>
                    ) : (
                        <>
                            <div style={{ height: 480, width: 480 }}>
                                <img
                                    src={
                                        screenshot
                                            ? screenshot
                                            : `data:image/jpeg;base64, ${image}`
                                    }
                                    alt='Captured'
                                    width={480}
                                    height={480}
                                    style={{ objectFit: 'cover' }} // Maintain aspect ratio
                                />
                            </div>
                            <input
                                ref={inputRef}
                                style={{ display: 'none' }}
                                type='file'
                                accept='image/jpeg'
                                onChange={handleFileUpload}
                            />
                        </>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default Profile
