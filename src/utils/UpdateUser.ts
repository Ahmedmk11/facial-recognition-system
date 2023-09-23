import axios from 'axios'

export const updateUser = (data: any) => {
    return new Promise((resolve, reject) => {
        axios
            .put('http://127.0.0.1:5000/api/update-user', {
                withCredentials: true,
                params: {
                    data: data,
                },
            })
            .then((response) => {
                let ok = response.data.ok
                resolve(ok)
            })
            .catch((error) => {
                console.log("Can't update user: ", error)
                reject(null)
            })
    })
}
