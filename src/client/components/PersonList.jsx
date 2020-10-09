import React from 'react';
import arrayMove from 'array-move';
import getHours from 'date-fns/getHours';
import without from 'lodash/without';
import { v4 as uuid } from 'uuid';
import PersonListItem from './PersonListItem';
import { SortableContainer, SortableItem } from './SortableList';
import { getTimezoneOffset } from '../util';
import api from '../api';

const PersonList = ({ now, dayOfWeek }) => {
  const localOffset = now.getHours() - 12;
  const currentHour = getHours(now);
  // HACK: Need to deal with local timezones that are not whole hours?
  const localTimezone = -Math.floor(now.getTimezoneOffset() / 60);

  const [persons, setPersons] = React.useState([uuid()]);
  const [allPeopleOptions, setAllPeopleOptions] = React.useState([]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setPersons(arrayMove(persons, oldIndex, newIndex));
  };

  React.useEffect(() => {
    api.getPeople().then((fetchedPeople) => {
      const peopleOptions = fetchedPeople.map((person) => ({
        label: person.username
          ? `${person.name} (${person.username})`
          : person.name,
        value: person.id,
        person: {
          ...person,
          timezone: person.works_in__timezone,
          timezoneOffset: getTimezoneOffset(person.works_in__timezone),
        },
      }));
      setAllPeopleOptions(peopleOptions);
    });
  }, []);

  const selectPerson = React.useCallback(
    (id, index) => {
      const newPersons = [
        ...persons.slice(0, index),
        id,
        ...persons.slice(index + 1, persons.length),
      ];
      newPersons.push(uuid());
      setPersons(newPersons);
    },
    [persons],
  );

  const removePerson = React.useCallback(
    (id) => {
      setPersons(without(persons, id));
    },
    [persons],
  );

  return (
    <SortableContainer onSortEnd={onSortEnd} useDragHandle lockAxis='y'>
      {persons.map((id, index) => (
        <SortableItem
          key={id}
          index={index}
          value={
            <PersonListItem
              id={id}
              localOffset={localOffset}
              allPeopleOptions={allPeopleOptions}
              dayOfWeek={dayOfWeek}
              localTimezone={localTimezone}
              currentHour={currentHour}
              onPersonSelected={(id) => selectPerson(id, index)}
              onPersonRemoved={removePerson}
            />
          }
        />
      ))}
    </SortableContainer>
  );
};

export default PersonList;
