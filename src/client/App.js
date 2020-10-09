import React from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { Provider, Flex, Heading } from 'rendition';
import clamp from 'lodash/clamp';
import get from 'lodash/get';
import without from 'lodash/without';
import getDay from 'date-fns/getDay';
import getHours from 'date-fns/getHours';
import styled from 'styled-components';
import DayPicker from './components/DayPicker';
import PersonRow from './components/PersonRow';
import { getTimezoneOffset } from './constants';

const Wrapper = styled(Flex)`
  margin-left: auto;
  margin-right: auto;
  max-width: 1020px;
`;

const App = () => {
  const now = new Date();
  const localOffset = now.getHours() - 12
  const currentHour = getHours(now);
  const localTimezone = -Math.floor(now.getTimezoneOffset() / 60);
  const [dayOfWeek, setDayOfWeek] = React.useState(clamp(getDay(now) || 1, 1, 5));

  const [ allPeopleOptions, setAllPeopleOptions ] = React.useState([]);

  const [persons, setPersons] = React.useState([uuid()]);

  React.useEffect(() => {
    axios.default.get('http://localhost:1337/working-hours/person?$orderby=name asc&$select=name,username,id,timezone')
      .then((response) => {
        const fetchedPeople = get(response, [ 'data', 'd'])
        if (fetchedPeople) {
          const peopleOptions = fetchedPeople.map(person => ({
            label: person.username ? `${person.name} (${person.username})` : person.name,
            value: person.id,
            person: {
              ...person,
              timezoneOffset: getTimezoneOffset(person.timezone)
            } 
          }))
          setAllPeopleOptions(peopleOptions)
        } else {
          console.error('Could not fetch all people', response)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch all people', err)
      })
  }, [])

  const selectPerson = React.useCallback((id, index) => {
    const newPersons = [
      ...persons.slice(0, index),
      id,
      ...persons.slice(index + 1, persons.length),
    ]
    newPersons.push(uuid())
    setPersons(newPersons)
  }, [ persons ])

  const removePerson = React.useCallback((id) => {
    setPersons(without(persons, id))
  }, [ persons ])

  return (
    <Provider>
      <Wrapper py={4} alignItems="center" flexDirection="column">
        <Heading.h1 align="center">Balena Team Preferred Working Hours</Heading.h1>
        <DayPicker dayOfWeek={dayOfWeek} onChange={setDayOfWeek} />
        {persons.map((id, index) => (
          <PersonRow
            localOffset={localOffset}
            now={now}
            key={id}
            id={id}
            allPeopleOptions={allPeopleOptions}
            dayOfWeek={dayOfWeek}
            localTimezone={localTimezone}
            currentHour={currentHour}
            onPersonSelected={(id) => selectPerson(id, index)}
            onPersonRemoved={removePerson}
          />
        ))}
      </Wrapper>
    </Provider>
  );
};

export default App;
