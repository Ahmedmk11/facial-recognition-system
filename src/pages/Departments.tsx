import React, { useEffect, useState } from 'react'
import { Table, Input, Switch, Button, Skeleton, message } from 'antd'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import NotFoundPage from './NotFoundPage'
import { checkUserRole } from '../utils/CheckRole'
import { getUserByID } from '../utils/GetUserByID'
import { CloseOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { getAllDepartments } from '../utils/GetAllDepartments'
import { updateDepartment } from '../utils/UpdateDepartment'
import { addDepartment } from '../utils/AddDepartment'

function Departments() {
    const [role, setRole] = useState<any>(null)
    const [currUser, setCurrUser] = useState<any>('')
    const [departments, setDepartments] = useState<any[]>([])
    const [editingRow, setEditingRow] = useState<number | null>(null)
    const [editedName, setEditedName] = useState<string>('')
    const [editedSite, setEditedSite] = useState<string>('')
    const [newName, setNewName] = useState<string>('')
    const [newSite, setNewSite] = useState<string>('')
    const [editedStatus, setEditedStatus] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const handleStatusChange = (checked: boolean) => {
        setEditedStatus(checked ? '1' : '0')
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

        getUserByID()
            .then((user) => {
                setCurrUser(user)
            })
            .catch((error) => {
                console.error(error)
            })

        getDepartmentsResponse().then((data: any) => {
            const sortedArrayOfArrays = data
            sortedArrayOfArrays.sort((a: any, b: any) => a[0] - b[0])
            setDepartments(sortedArrayOfArrays)
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        if (editingRow) {
            setEditedName(departments[editingRow - 1][1])
            setEditedSite(departments[editingRow - 1][2])
            setEditedStatus(departments[editingRow - 1][3])
        }
    }, [editingRow])

    function handleCancel() {
        setEditingRow(null)
        setIsAdding(false)
        setEditedName('')
        setEditedSite('')
    }

    const handleCancelNew = () => {
        setIsAdding(false)
        setNewName('')
        setNewSite('')
    }

    const handleAddClick = async () => {
        await addDepartment(newName, newSite)
        message.success('New Department Added!')
        getDepartmentsResponse().then((data: any) => {
            const sortedArrayOfArrays = data
            sortedArrayOfArrays.sort((a: any, b: any) => a[0] - b[0])
            setDepartments(sortedArrayOfArrays)
        })
        setIsAdding(false)
        setNewName('')
        setNewSite('')
    }

    const handleSaveClick = async (did: number) => {
        await updateDepartment(did, editedName, editedSite, editedStatus)
        getDepartmentsResponse().then((data: any) => {
            const sortedArrayOfArrays = data
            sortedArrayOfArrays.sort((a: any, b: any) => a[0] - b[0])
            setDepartments(sortedArrayOfArrays)
        })
        setEditingRow(null)
        setEditedName('')
        setEditedSite('')
    }

    function handleAddNewDepartment() {
        setIsAdding(true)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 0,
            key: 'id',
            className: 'col-id',
        },
        {
            title: 'Name',
            dataIndex: 1,
            key: 'name',
            render: isLoading
                ? () => <Skeleton.Input className='skeletons' active />
                : (text: string, record: any) =>
                      editingRow === record[0] ? (
                          <Input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                          />
                      ) : (
                          <span>{text}</span>
                      ),
            className: 'col-name',
        },
        {
            title: 'Site',
            dataIndex: 2,
            key: 'site',
            render: isLoading
                ? () => <Skeleton.Input className='skeletons' active />
                : (text: string, record: any) =>
                      editingRow === record[0] ? (
                          <Input
                              value={editedSite}
                              onChange={(e) => setEditedSite(e.target.value)}
                          />
                      ) : (
                          <span>{text}</span>
                      ),
            className: 'col-site',
        },
        {
            title: 'Status',
            dataIndex: 3,
            key: 'status',
            render: isLoading
                ? () => <Skeleton.Input className='skeletons' active />
                : (text: string, record: any) =>
                      editingRow === record[0] ? (
                          <Switch
                              checked={editedStatus === '1'}
                              onChange={(checked) =>
                                  handleStatusChange(checked)
                              }
                          />
                      ) : (
                          <span>{text === '1' ? 'Active' : 'Inactive'}</span>
                      ),
            className: 'col-status',
        },
        {
            title: 'Action',
            key: 'action',
            render: isLoading
                ? () => <Skeleton.Input className='skeletons' active />
                : (text: string, record: any) =>
                      editingRow === record[0] ? (
                          <div className='tbuttons'>
                              <Button
                                  type='default'
                                  style={{
                                      width: 90,
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                  }}
                                  onClick={() => {
                                      handleCancel()
                                  }}
                                  danger>
                                  <CloseOutlined />
                                  Cancel
                              </Button>
                              <Button
                                  type='primary'
                                  style={{
                                      width: 90,
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                  }}
                                  onClick={async () => {
                                      await handleSaveClick(record[0])
                                  }}>
                                  <CheckOutlined />
                                  Save
                              </Button>
                          </div>
                      ) : (
                          <Button onClick={() => setEditingRow(record[0])}>
                              Edit
                          </Button>
                      ),
            className: 'col-action',
        },
    ]

    return role == 'super' ? (
        <div id='departments-page'>
            <NavBar />
            <div id='departments-content'>
                <Table
                    dataSource={departments}
                    columns={columns}
                    pagination={{
                        position: ['bottomLeft'],
                        pageSize: 5,
                    }}
                    rowKey={(record) => record[0].toString()}
                />
                <div id='add-new-dep'>
                    {isAdding ? (
                        <div id='new-dep-inputs'>
                            <Input
                                placeholder='Department Name'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Input
                                placeholder='Site'
                                value={newSite}
                                onChange={(e) => setNewSite(e.target.value)}
                            />
                        </div>
                    ) : null}
                    {isAdding && (
                        <div className='new-dep-buttons'>
                            <Button
                                type='default'
                                style={{
                                    width: 90,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    handleCancelNew()
                                }}
                                danger>
                                <CloseOutlined />
                                Cancel
                            </Button>
                            <Button
                                type='primary'
                                style={{
                                    width: 90,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    handleAddClick()
                                }}>
                                <PlusOutlined />
                                Add
                            </Button>
                        </div>
                    )}
                </div>
                {isAdding ? null : (
                    <button
                        disabled={isLoading}
                        className='btn btn-primary btn-lg float-right custom-button'
                        style={{
                            fontSize: 15,
                            margin: 32,
                        }}
                        onClick={handleAddNewDepartment}>
                        Add New Department
                    </button>
                )}
            </div>
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
