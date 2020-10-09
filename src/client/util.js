const { differenceInMinutes } = require('date-fns');

export const NUM_SLOTS = 48

export const DoW = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tues',
  3: 'Wed',
  4: 'Thurs',
  5: 'Fri',
  6: 'Sat'
}

const getTzDate = (date, timeZone) => {
  return new Date(date.toLocaleString('en-US', { timeZone }))
}

export const getTimezoneOffset = (timeZone) => {
  const localTime = new Date()
  const tzTime = getTzDate(localTime, timeZone)
  const diffHours = differenceInMinutes(tzTime, localTime) / 60
  const roundedDiffHours = Math.round(diffHours*2)/2
  return roundedDiffHours > 0 ? `+${roundedDiffHours}` : roundedDiffHours
}

export const getTzDateTimeForHour = (timeZone, hour) => {
  const localTime = new Date()
  localTime.setHours(hour)
  localTime.setMinutes(0)
  localTime.setSeconds(0)
  return getTzDate(localTime, timeZone)
}