import axios from 'axios'

export const deleteNotification = (nid: number) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                'http://127.0.0.1:5000/api/delete-notifications',
                { nid },
                { withCredentials: true }
            )
            .then((response) => {
                let handled = response.data.handled
                console.log('res', response)
                resolve(handled)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
