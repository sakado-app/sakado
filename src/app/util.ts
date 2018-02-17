export function date(date: Date, hour: boolean = false, weekday: boolean = true, year: boolean = false)
{
    return capitalize(date.toLocaleDateString(navigator.language, {
        weekday: weekday ? 'long' : undefined, day:'numeric', month: 'long', hour: hour ? 'numeric' : undefined, year: year ? 'numeric' : undefined
    }));
}

export function capitalize(value: string)
{
    let result = '';

    value.split(' ').forEach(word => {
        result += (word.length == 1 ? word : word.charAt(0).toUpperCase() + word.slice(1)) + ' ';
    });

    return result.substring(0, result.length - 1);
}
