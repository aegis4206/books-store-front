export const positiveInteger = (target: string | number | unknown) => {
    const number = Number(target)
    return Number.isNaN(number) || !Number.isInteger(number);
}
