const { differenceInMinutes } = require('date-fns');

export const DoW = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tues',
  3: 'Wed',
  4: 'Thurs',
  5: 'Fri',
  6: 'Sat'
}

export const getTimezoneOffset = (timeZone) => {
  const localTime = new Date()
  const tzTime = new Date(localTime.toLocaleString('en-US', { timeZone }))
  const diffHours = differenceInMinutes(tzTime, localTime) / 60
  const roundedDiffHours = Math.round(diffHours*2)/2
  return `${roundedDiffHours > 0 ? '+' : ''}${roundedDiffHours}`
}
