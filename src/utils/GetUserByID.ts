import axios from 'axios'

export const getUserByID = (uid = '') => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-user-id', {
                params: {
                    uid: uid,
                },
                withCredentials: true,
            })
            .then((response) => {
                let user = response.data.user
                resolve(user)
            })
            .catch((error) => {
                console.log("Can't get user: ", error)
                resolve(null)
            })
    })
}
