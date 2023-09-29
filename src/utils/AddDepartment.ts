import axios from 'axios'

export const addDepartment = (name: string, site: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                'http://127.0.0.1:5000/api/add-department',
                {
                    name: name,
                    site: site,
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
