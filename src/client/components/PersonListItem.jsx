import React from 'react';
import get from 'lodash/get';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Button } from 'rendition';
import PersonSelector from './PersonSelector';
import DaySlots from './DaySlots';
import api, { getDefaultDaySlots } from '../api';

const PersonListItem = ({
  localOffset,
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
      api.getTimeSlotsByDay(newPerson.id).then(setDaySlots);
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

export default PersonListItem;
