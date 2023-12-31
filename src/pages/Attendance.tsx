import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Select, Skeleton } from 'antd'
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
import dayjs from 'dayjs'
import { downloadExcel } from '../utils/DownloadReport'

interface DataType {
    key: any
    uid: any
    fullname: any
    location: any
    date: any
    time: any
}

function Attendance() {
    const { state } = useLocation()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { Option, OptGroup } = Select
    const { RangePicker } = DatePicker
    const [dateRange, setDateRange] = useState<any>([])

    const [role, setRole] = useState<any>(null)
    const [selectedOptions, setSelectedOptions] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const [currUser, setCurrUser] = useState<any>('')
    const [users, setUsers] = useState<any>([])
    const [data, setData] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const loadingSkeletonData = Array(2).fill(0)

    const [downloadData, setDownloadData] = useState({
        ID: [] as number[],
        FullName: [] as string[],
        Location: [] as string[],
        Date: [] as string[],
        Time: [] as string[],
    })

    const [downloadAllData, setDownloadAllData] = useState({
        ID: [] as number[],
        FullName: [] as string[],
        Location: [] as string[],
        Date: [] as string[],
        Time: [] as string[],
    })

    const [attendance, setAttendance] = useState<any>([])

    async function getUserAttendanceResponse(uid: string) {
        try {
            const attendance = await getUserAttendance(uid)
            return attendance
        } catch (error: any) {
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
                .then((attendance: any) => {
                    const filteredAttendance = attendance.filter((a: any) => {
                        const attendanceDate = dayjs(a[2])
                        return (
                            (typeof dateRange !== 'undefined' &&
                                dateRange != null &&
                                dateRange.length === 0) ||
                            (attendanceDate.isAfter(dayjs(dateRange[0])) &&
                                attendanceDate.isBefore(dayjs(dateRange[1])))
                        )
                    })
                    setAttendance(filteredAttendance)
                    setIsLoading(false)
                })
                .catch((error) => {})
        } else {
            setAttendance([])
            setData([])
        }
    }, [selectedOptions, dateRange])

    useEffect(() => {
        const newDownloadData = {
            ID: [] as number[],
            FullName: [] as string[],
            Location: [] as string[],
            Date: [] as string[],
            Time: [] as string[],
        }

        selectedRowKeys.forEach((key) => {
            const selectedRow = data[key]
            if (selectedRow) {
                newDownloadData.ID.push(selectedRow.uid)
                newDownloadData.FullName.push(selectedRow.fullname)
                newDownloadData.Location.push(selectedRow.location)
                newDownloadData.Date.push(selectedRow.date)
                newDownloadData.Time.push(selectedRow.time)
            }
        })

        setDownloadData(newDownloadData)
    }, [selectedRowKeys, data])

    useEffect(() => {
        if (data && data.length == 0) {
            setSelectedRowKeys([])
            setDownloadData({
                ID: [] as number[],
                FullName: [] as string[],
                Location: [] as string[],
                Date: [] as string[],
                Time: [] as string[],
            })
        }
    }, [data])

    useEffect(() => {
        getUserAttendanceResponse(state ? `${state.uid}` : `${currUser[0]}`)
            .then((attendance: any) => {
                const filteredAttendance = attendance.filter((a: any) => {
                    const attendanceDate = dayjs(a[2])
                    return (
                        (typeof dateRange !== 'undefined' &&
                            dateRange.length === 0) ||
                        (attendanceDate.isAfter(dayjs(dateRange[0])) &&
                            attendanceDate.isBefore(dayjs(dateRange[1])))
                    )
                })
                setAttendance(filteredAttendance)
                setIsLoading(false)
            })
            .catch((error) => {})
    }, [currUser])

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
            const filteredData = attendance.map((a: any, index: any) => ({
                key: index,
                uid: a ? a[1] : 'null',
                fullname: `${
                    users.find((user: any) => {
                        return user[0] == a[1]
                    })
                        ? users.find((user: any) => {
                              return user[0] == a[1]
                          })[1]
                        : 'null'
                } ${
                    users.find((user: any) => {
                        return user[0] == a[1]
                    })
                        ? users.find((user: any) => {
                              return user[0] == a[1]
                          })[2]
                        : 'null'
                }`,
                location: users.find((user: any) => {
                    return user[0] == a[1]
                })
                    ? users.find((user: any) => {
                          return user[0] == a[1]
                      })[5]
                    : 'null',
                date: a ? convertDateFormats(a[2])[0] : 'null',
                time: a ? convertDateFormats(a[2])[1] : 'null',
            }))
            setData(filteredData)
        } else {
            setData([])
        }
    }, [attendance, users])

    useEffect(() => {
        if (data.length > 0) {
            const newDownloadData = {
                ID: [] as number[],
                FullName: [] as string[],
                Location: [] as string[],
                Date: [] as string[],
                Time: [] as string[],
            }

            data.forEach((a: any) => {
                newDownloadData.ID.push(a.uid)
                newDownloadData.FullName.push(a.fullname)
                newDownloadData.Location.push(a.location)
                newDownloadData.Date.push(a.date)
                newDownloadData.Time.push(a.time)
            })

            setDownloadAllData(newDownloadData)
        }
    }, [data])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
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
        } catch (error: any) {
            return []
        }
    }

    const getDepartmentsResponse = async () => {
        try {
            const deps = await getAllDepartments()
            return deps
        } catch (error: any) {
            return []
        }
    }

    useEffect(() => {
        checkUserRole()
            .then((role) => {
                setRole(role)
            })
            .catch((error) => {})
    }, [])

    useEffect(() => {
        getDepartmentsResponse()
            .then((departments) => {
                setDepartments(departments)
            })
            .catch((error) => {})
        getUsersResponse()
            .then((users) => {
                setUsers(users)
            })
            .catch((error) => {})
        getUserByID()
            .then((user) => {
                setCurrUser(user)
            })
            .catch((error) => {})
    }, [])

    useEffect(() => {
        if (state) {
            setSelectedOptions([`user_${state.uid}`])
        } else {
            setSelectedOptions([`user_${currUser[0]}`])
        }
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
        downloadExcel(downloadData)
    }

    function handleDownloadAllReports() {
        downloadExcel(downloadAllData)
    }

    function handleDateChange(values: any): void {
        setDateRange(values)
    }

    return (
        <div id='attendance-page'>
            <NavBar />
            <div id='attendance-content'>
                <div id='attendance-container'>
                    {isLoading ? (
                        <Table
                            style={{ paddingLeft: 12 }}
                            columns={columns}
                            dataSource={loadingSkeletonData.map((_, index) => ({
                                key: index,
                                uid: <Skeleton active />,
                                fullname: <Skeleton active />,
                                location: <Skeleton active />,
                                date: <Skeleton active />,
                                time: <Skeleton active />,
                            }))}
                            pagination={false}
                        />
                    ) : (
                        <Table
                            style={{ paddingLeft: 12 }}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                position: ['bottomLeft'],
                                pageSize: 5,
                            }}
                        />
                    )}
                </div>
                <div id='attendance-filters'>
                    {role == 'employee' ? null : (
                        <div id='inputs'>
                            {isLoading ? (
                                <Skeleton.Input active />
                            ) : (
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
                                            (typeof optgroupLabel ===
                                                'string' &&
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
                            {isLoading ? (
                                <Skeleton.Input
                                    active
                                    style={{ marginTop: 26 }}
                                />
                            ) : (
                                <RangePicker
                                    showTime
                                    allowClear
                                    onChange={handleDateChange}
                                />
                            )}
                        </div>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            gap: 12,
                        }}>
                        <button
                            disabled={
                                downloadAllData.ID &&
                                downloadAllData.ID.length == 0
                            }
                            className='btn btn-primary btn-lg float-right custom-button'
                            style={{
                                fontSize: 15,
                                width: '85%',
                            }}
                            onClick={() => {
                                handleDownloadAllReports()
                            }}>
                            Download All Reports
                        </button>
                        <button
                            disabled={
                                downloadData.ID && downloadData.ID.length == 0
                            }
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
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Attendance
