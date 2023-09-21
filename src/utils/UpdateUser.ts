import axios from 'axios'

export const updateUser = (data: any) => {
    return new Promise((resolve, reject) => {
        const res = axios({
            method: 'put',
            url: 'http://127.0.0.1:5000/api/update-user',
            data: data,
        })
            .then((response) => {
                let res = response.data.state
                resolve(res)
            })
            .catch((error) => {
                console.log("Can't update user: ", error)
                reject(error)
            })
    })
}
