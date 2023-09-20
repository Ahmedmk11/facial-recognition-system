export function dateToString(inputDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }
    const date = new Date(inputDate)
    return date.toLocaleDateString(undefined, options)
}
