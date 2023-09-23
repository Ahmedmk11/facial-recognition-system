export function stringToDate(inputDateString: any): any {
    const dateParts = inputDateString.split(' ')

    if (dateParts.length !== 3) {
        return null // Invalid input format
    }

    const monthNames: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }

    const month = monthNames[dateParts[0]]
    const day = dateParts[1].replace(',', '') // Remove the comma
    const year = dateParts[2]

    if (!month || isNaN(parseInt(day)) || isNaN(parseInt(year))) {
        return null // Invalid month, day, or year
    }

    // Ensure the day and month are zero-padded if needed
    const formattedMonth = month.length === 1 ? '0' + month : month
    const formattedDay = day.length === 1 ? '0' + day : day

    return `${year}-${formattedMonth}-${formattedDay}`
}
