export const positiveInteger = (target: string | number | unknown) => {
    console.log(target)

    const number = Number(target)
    console.log(number)
    return Number.isNaN(number) || !Number.isInteger(number);
}
