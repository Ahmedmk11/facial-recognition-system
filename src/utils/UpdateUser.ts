import axios from 'axios'

export function updateUser(
    userId: number,
    newFirstname: string,
    newLastname: string,
    newEmail: string,
    newUsername: string,
    newJobtitle: string,
    newStreetAddress: string,
    newLocation: string,
    newPhoneNumber: string,
    newRole: string,
    newBirthdate: string, // Assuming it's a string in ISO format, e.g., 'YYYY-MM-DD'
    newEmploymentStatus: string,
    newDepartmentId: number,
    newImage: any,
    debugMode: boolean
): Promise<string> {
    const apiUrl = 'http://127.0.0.1:5000/api/update-user'

    // Prepare the request body
    const requestBody = {
        userId,
        newFirstname,
        newLastname,
        newEmail,
        newUsername,
        newJobtitle,
        newStreetAddress,
        newLocation,
        newPhoneNumber,
        newRole,
        newBirthdate,
        newEmploymentStatus,
        newDepartmentId,
        newImage,
        debugMode,
    }
    return axios
        .post(apiUrl, requestBody)
        .then((response) => {
            return response.data.result
        })
        .catch((error) => {
            console.error('Error updating user:', error)
            throw error
        })
}
