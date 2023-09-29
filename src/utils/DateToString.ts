export function dateToString(inputDate: string): string {
    const dateParts = inputDate.split(' ')
    if (dateParts.length >= 4) {
        return dateParts.slice(0, 4).join(' ')
    }
    return inputDate
}
