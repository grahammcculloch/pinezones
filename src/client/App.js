import React from 'react';
import axios from 'axios';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import styled, { createGlobalStyle } from 'styled-components';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Provider, Box, Flex, Heading } from 'rendition';
import clamp from 'lodash/clamp';
import get from 'lodash/get';
import without from 'lodash/without';
import getDay from 'date-fns/getDay';
import getHours from 'date-fns/getHours';
import DayPicker from './components/DayPicker';
import PersonRow from './components/PersonRow';
import { getTimezoneOffset } from './util';

const GlobalStyle = createGlobalStyle `
  body {
    background-color: #F8F9FD;
  }
`

const DragHandleWrapper = styled(Box)`
  cursor: row-resize;
`;

const DragHandle = sortableHandle(() => (
  <DragHandleWrapper
    ml={2}
    p={2}
    tooltip={{
      text: 'Drag to re-order',
      placement: 'right',
    }}
  >
    <FontAwesomeIcon icon={faGripLines} />
  </DragHandleWrapper>
));

const SortableItem = sortableElement((props) => {
  console.log('SortableItem', props);
  return (
    <Flex flexDirection='row' alignItems='center'>
      {props.value}
      <DragHandle />
    </Flex>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

const Wrapper = styled(Flex)`
  margin-left: auto;
  margin-right: auto;
  max-width: 1020px;
`;

const App = () => {
  const now = new Date();
  const localOffset = now.getHours() - 12;
  const currentHour = getHours(now);
  const localTimezone = -Math.floor(now.getTimezoneOffset() / 60);
  const [dayOfWeek, setDayOfWeek] = React.useState(
    clamp(getDay(now) || 1, 1, 5),
  );

  const [allPeopleOptions, setAllPeopleOptions] = React.useState([]);

  const [persons, setPersons] = React.useState([uuid()]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setPersons(arrayMove(persons, oldIndex, newIndex));
  };

  React.useEffect(() => {
    axios.default
      .get(
        'http://localhost:1337/working-hours/person?$orderby=name asc&$select=name,username,id,timezone',
      )
      .then((response) => {
        const fetchedPeople = get(response, ['data', 'd']);
        if (fetchedPeople) {
          const peopleOptions = fetchedPeople.map((person) => ({
            label: person.username
              ? `${person.name} (${person.username})`
              : person.name,
            value: person.id,
            person: {
              ...person,
              timezoneOffset: getTimezoneOffset(person.timezone),
            },
          }));
          setAllPeopleOptions(peopleOptions);
        } else {
          console.error('Could not fetch all people', response);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch all people', err);
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
    <Provider>
      <GlobalStyle />
      <Wrapper py={3} alignItems='center' flexDirection='column'>
        <Heading.h1 align='center'>Preferred Working Hours</Heading.h1>
        <Heading.h3 align='center'>Balena Team</Heading.h3>
        <DayPicker dayOfWeek={dayOfWeek} onChange={setDayOfWeek} />
        <SortableContainer onSortEnd={onSortEnd} useDragHandle lockAxis='y'>
          {persons.map((id, index) => (
            <SortableItem
              key={id}
              index={index}
              value={
                <PersonRow
                  localOffset={localOffset}
                  now={now}
                  id={id}
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
      </Wrapper>
    </Provider>
  );
};

export default App;
