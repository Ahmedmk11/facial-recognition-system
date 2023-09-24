import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Select } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { checkUserRole } from '../utils/CheckRole'
import { getUserByID } from '../utils/GetUserByID'
import { getAllUsers } from '../utils/GetAllUsers'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { getUserAttendance } from '../utils/GetUserAttendance'
import { convertDateFormats } from '../utils/ConvertDateTimeToString'

interface DataType {
    key: React.Key
    uid: number
    fullname: string
    location: string
    date: string
    time: string
}

function Attendance() {
    const navigate = useNavigate()
    const { state } = useLocation()

    const { Option, OptGroup } = Select
    const { RangePicker } = DatePicker
    const [role, setRole] = useState<any>(null)
    const [selectedOptions, setSelectedOptions] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const [currUser, setCurrUser] = useState<any>('')
    const [users, setUsers] = useState<any>([])
    const [data, setData] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const [attendance, setAttendance] = useState<any>([])

    async function getUserAttendanceResponse(uid: string) {
        try {
            const attendance = await getUserAttendance(uid)
            return attendance
        } catch (error) {
            console.log(error)
            return []
        }
    }

    useEffect(() => {
        if (selectedOptions[0] && !selectedOptions[0]?.includes('undefined')) {
            getUserAttendanceResponse(
                selectedOptions
                    .map((option: string) => option.split('_')[1])
                    .join(',')
            )
                .then((attendance) => {
                    setAttendance(attendance)
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            setAttendance([])
            setData([])
        }
    }, [selectedOptions])

    useEffect(() => {
        console.log('blobloblobloblo', currUser)
        getUserAttendanceResponse(state ? `${state.uid}` : `${currUser[0]}`)
            .then((attendance) => {
                setAttendance(attendance)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [currUser])

    useEffect(() => {
        console.log('atte', attendance)
    }, [attendance])

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'uid',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Time',
            dataIndex: 'time',
        },
    ]

    useEffect(() => {
        if (attendance.length > 0) {
            setData(
                attendance.map((a: any, index: any) => ({
                    key: index,
                    uid: a[1],
                    fullname: `${
                        users.find((user: any) => {
                            return user[0] == a[1]
                        })[1]
                    } ${
                        users.find((user: any) => {
                            return user[0] == a[1]
                        })[2]
                    }`,
                    location: users.find((user: any) => {
                        return user[0] == a[1]
                    })[5],
                    date: convertDateFormats(a[2])[0],
                    time: convertDateFormats(a[2])[1],
                }))
            )
            console.log(
                'yoyo',
                users.find((user: any) => {
                    user[0] == attendance[0][1]
                })
            )
        }
    }, [attendance])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = []
                    newSelectedRowKeys = changeableRowKeys.filter(
                        (_, index) => {
                            if (index % 2 !== 0) {
                                return false
                            }
                            return true
                        }
                    )
                    setSelectedRowKeys(newSelectedRowKeys)
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = []
                    newSelectedRowKeys = changeableRowKeys.filter(
                        (_, index) => {
                            if (index % 2 !== 0) {
                                return true
                            }
                            return false
                        }
                    )
                    setSelectedRowKeys(newSelectedRowKeys)
                },
            },
        ],
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
        checkUserRole()
            .then((role) => {
                setRole(role)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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
        if (state) {
            setSelectedOptions([`user_${state.uid}`])
        } else {
            setSelectedOptions([`user_${currUser[0]}`])
        }
        console.log('currrr', currUser)
    }, [currUser])

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
    function handleDownloadReport() {
        throw new Error('Function not implemented.')
    }

    return (
        <div id='attendance-page'>
            <NavBar />
            <div id='attendance-content'>
                {role == 'employee' ? null : (
                    <div id='attendance-filters'>
                        <div id='inputs'>
                            <Select
                                allowClear
                                placeholder='Select users'
                                mode='multiple'
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
                            <RangePicker showTime allowClear />
                        </div>
                        <button
                            className='btn btn-primary btn-lg float-right custom-button'
                            style={{
                                fontSize: 15,
                                width: '85%',
                            }}
                            onClick={() => {
                                handleDownloadReport()
                            }}>
                            Download Report
                        </button>
                    </div>
                )}
                <div id='attendance-container'>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={data}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Attendance
