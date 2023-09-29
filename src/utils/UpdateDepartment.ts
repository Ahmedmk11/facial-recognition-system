import axios from 'axios'

export const updateDepartment = (
    did: number,
    name: string,
    site: string,
    status: string
) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                'http://127.0.0.1:5000/api/update-department',
                {
                    did: did,
                    name: name,
                    site: site,
                    status: status,
                },
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
