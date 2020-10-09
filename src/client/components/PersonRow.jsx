import React from 'react';
import get from 'lodash/get';
import axios from 'axios';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Button } from 'rendition';
import PersonSelector from './PersonSelector';
import DaySlots from './DaySlots';

const getDefaultDaySlots = () => [{}, {}, {}, {}, {}];

const PersonRow = ({
  localOffset,
  now,
  id,
  allPeopleOptions,
  dayOfWeek,
  onPersonSelected,
  onPersonRemoved,
}) => {
  const [person, setPerson] = React.useState(null);
  const [daySlots, setDaySlots] = React.useState(getDefaultDaySlots());

  const removePerson = React.useCallback(() => {
    setPerson(null);
    setDaySlots(getDefaultDaySlots());
    onPersonRemoved(id);
  }, [id, onPersonRemoved]);

  const selectPerson = React.useCallback(
    (newPerson) => {
      if (!person) {
        onPersonSelected(id);
      }
      setPerson(newPerson);
      axios.default
        .get(
          `${process.env.REACT_APP_API_URL}/person__is_available_for__slot_index__on__day_of_the_week?$filter=person eq ${newPerson.id}&$select=on__day_of_the_week,is_available_for__slot_index,score`,
        )
        .then((response) => {
          const newDaySlots = get(response, ['data', 'd']);
          if (newDaySlots) {
            const daySlotsByDay = newDaySlots.reduce((byDay, slot) => {
              byDay[slot.on__day_of_the_week - 1][slot.is_available_for__slot_index] = slot.score;
              return byDay;
            }, getDefaultDaySlots());
            setDaySlots(daySlotsByDay);
          }
        });
    },
    [person, id, onPersonSelected],
  );

  return (
    <Flex flexDirection='row' alignItems='center' alignSelf='flex-start'>
      <Button
        disabled={!person}
        quartenary
        plain
        icon={<FontAwesomeIcon icon={faTimes} />}
        onClick={removePerson}
      />
      <PersonSelector
        mx={3}
        person={person}
        allPeopleOptions={allPeopleOptions}
        onPersonSelected={selectPerson}
      />
      <DaySlots
        timezoneOffset={person ? person.timezoneOffset : 0}
        localOffset={localOffset}
        timezone={
          person
            ? person.timezone
            : Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        slots={get(daySlots, dayOfWeek - 1, [])}
        dayOfWeek={dayOfWeek}
      />
    </Flex>
  );
};

export default PersonRow;
