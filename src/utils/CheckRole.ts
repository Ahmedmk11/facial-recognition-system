import axios from 'axios'

export const checkUserRole = () => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/check-role', {
                withCredentials: true,
            })
            .then((response) => {
                let role = response.data.role[0]
                console.log('role: ', role)
                resolve(role)
            })
            .catch((error) => {
                console.log("Can't get role: ", error)
                resolve(null)
            })
    })
}
