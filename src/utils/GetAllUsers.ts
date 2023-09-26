import axios from 'axios'

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-all-users', {
                withCredentials: true,
            })
            .then((response) => {
                let users = response.data.users
                resolve(users)
            })
            .catch((error) => {
                reject(null)
            })
    })
}
