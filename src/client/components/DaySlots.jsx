import React from 'react';
import get from 'lodash/get';
import { Flex } from 'rendition';
import HourSlot from './HourSlot';

const numSlots = 48;

const getTzDateTime = (timeZone, hour) => {
  const dt = new Date()
  dt.setHours(hour)
  dt.setMinutes(0)
  dt.setSeconds(0)
  const tzTime = new Date(dt.toLocaleString('en-US', { timeZone }))
  return tzTime
}

const DaySlots = ({ timezoneOffset, localOffset, timezone, slots = {}, dayOfWeek }) => {
  const hourSlots = []
  for(let slotIndex = 0; slotIndex < numSlots; slotIndex += 2) {
    const offsetSlotIndex = (slotIndex + (timezoneOffset * 2) % numSlots + numSlots) % numSlots
    const offsetSlotIndex2 = (slotIndex + (timezoneOffset * 2) + 1 % numSlots + numSlots) % numSlots
    hourSlots.push({
      tzDateTime: getTzDateTime(timezone, Math.floor(slotIndex/2)),
      scores: [get(slots, [ offsetSlotIndex ], 0), get(slots, [ offsetSlotIndex2 ], 0)],
    })
  }
  return (
    <Flex flexDirection="row" alignItems="center" alignSelf="stretch">
      {hourSlots.map((_, index) => {
        const hourSlot = hourSlots[((index + localOffset + 1) % 24 + 24) % 24]
        return <HourSlot isCurrent={index === 11} key={hourSlot.tzDateTime} dayOfWeek={dayOfWeek} {...hourSlot} />;
      })}
    </Flex>
  );
};

export default DaySlots;
