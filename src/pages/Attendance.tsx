import { Button, DatePicker, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { checkUserRole } from '../utils/CheckRole'
import { getUserByID } from '../utils/GetUserByID'
import { getAllUsers } from '../utils/GetAllUsers'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'

interface DataType {
    key: React.Key
    name: string
    age: number
    address: string
}

function Attendance() {
    const navigate = useNavigate()
    const { Option, OptGroup } = Select
    const { RangePicker } = DatePicker
    const [role, setRole] = useState<any>(null)
    const [selectedOptions, setSelectedOptions] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const [currUser, setCurrUser] = useState<any>('')
    const [users, setUsers] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ]

    const data: DataType[] = []
    for (let i = 0; i < 46; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        })
    }

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
        setSelectedOptions([`user_${currUser[0]}`])
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
    return (
        <div id='attendance-page'>
            <NavBar />
            <div id='attendance-content'>
                {role == 'employee' ? null : (
                    <div id='attendance-filters'>
                        <Select
                            allowClear
                            placeholder='Select users'
                            mode='multiple'
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
                        <RangePicker showTime allowClear />
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
