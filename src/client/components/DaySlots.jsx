import React from 'react';
import get from 'lodash/get';
import { Flex } from 'rendition';
import HourSlot from './HourSlot';
import { getTzDateTimeForHour, NUM_SLOTS } from '../util';

const circularIndex = (index, n) => ((index % n) + n) % n;

const DaySlots = ({
  timezoneOffset,
  localOffset,
  timezone,
  slots = {},
  dayOfWeek,
}) => {
  const hourSlots = [];
  const slotTimezoneOffset = Math.floor(timezoneOffset * 2);

  // Convert the half-hour slots into hour slots
  for (let slotIndex = 0; slotIndex < NUM_SLOTS; slotIndex += 2) {
    const offsetSlotIndex = circularIndex(
      slotIndex + slotTimezoneOffset,
      NUM_SLOTS,
    );
    const offsetSlotIndex2 = circularIndex(
      slotIndex + slotTimezoneOffset + 1,
      NUM_SLOTS,
    );
    const hourSlotIndex = Math.floor(slotIndex / 2);
    hourSlots.push({
      tzDateTime: getTzDateTimeForHour(timezone, hourSlotIndex),
      scores: [
        get(slots, [offsetSlotIndex], 0),
        get(slots, [offsetSlotIndex2], 0),
      ],
    });
  }

  return (
    <Flex flexDirection='row' alignItems='center' alignSelf='stretch'>
      {hourSlots.map((_, index) => {
        const hourSlot = hourSlots[circularIndex(index + localOffset + 1, 24)];
        return (
          <HourSlot
            isCurrent={index === 11}
            key={hourSlot.tzDateTime}
            dayOfWeek={dayOfWeek}
            {...hourSlot}
          />
        );
      })}
    </Flex>
  );
};

export default DaySlots;
