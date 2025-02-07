const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

export function formatDate(date: Date) {
    return DATE_FORMATTER.format(date)
}