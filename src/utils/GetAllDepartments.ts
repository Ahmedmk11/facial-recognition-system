import axios from 'axios'

export const getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-all-departments', {
                withCredentials: true,
            })
            .then((response) => {
                let departments = response.data.departments
                resolve(departments)
            })
            .catch((error) => {
                resolve(null)
            })
    })
}
