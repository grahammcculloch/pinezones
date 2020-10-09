import React from 'react';
import get from 'lodash/get';
import { Flex } from 'rendition';
import HourSlot from './HourSlot';
import { getTzDateTime, NUM_SLOTS } from '../util';

const DaySlots = ({ timezoneOffset, localOffset, timezone, slots = {}, dayOfWeek }) => {
  const hourSlots = []
  for(let slotIndex = 0; slotIndex < NUM_SLOTS; slotIndex += 2) {
    const offsetSlotIndex = (slotIndex + (timezoneOffset * 2) % NUM_SLOTS + NUM_SLOTS) % NUM_SLOTS
    const offsetSlotIndex2 = (slotIndex + (timezoneOffset * 2) + 1 % NUM_SLOTS + NUM_SLOTS) % NUM_SLOTS
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
