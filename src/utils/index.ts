import { v4 as uuid } from 'uuid'

export const vitualizeArray = <T>(args: {
  arr: T[]
  padding: number
  from: number
}) => {
  const { arr, padding, from } = args

  let minRange = from - padding
  let maxRange = from + padding

  if (minRange < 0) {
    minRange = 0
  }

  if (maxRange > arr.length - 1) {
    maxRange = arr.length - 1
  }

  let newArr = arr.map((item, index) => {
    return {
      value: item,
      index
    }
  })

  let result = newArr.filter((_, index) => {
    let show = index >= minRange && index <= maxRange

    return show
  })

  return result
}

export const getUUId = () => {
  return uuid()
}

export const roundNumber = (value: number, precision = 0) => {
  let multiplier = Number(`1`.padEnd(precision ? precision + 1 : 0, '0'))
  const result = Math.round((value + Number.EPSILON) * multiplier) / multiplier

  return result
}
