import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Provider, Flex, Heading } from 'rendition';
import clamp from 'lodash/clamp';
import getDay from 'date-fns/getDay';
import DayPicker from './components/DayPicker';
import PersonList from './components/PersonList';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #F8F9FD;
  }
`;

const Wrapper = styled(Flex)`
  margin-left: auto;
  margin-right: auto;
  max-width: 1020px;
`;

const App = () => {
  const now = new Date();
  const [dayOfWeek, setDayOfWeek] = React.useState(
    clamp(getDay(now) || 1, 1, 5),
  );

  return (
    <Provider>
      <GlobalStyle />
      <Wrapper py={3} alignItems='center' flexDirection='column'>
        <Heading.h1 align='center'>Preferred Working Hours</Heading.h1>
        <Heading.h3 align='center'>Balena Team</Heading.h3>
        <DayPicker dayOfWeek={dayOfWeek} onChange={setDayOfWeek} />
        <PersonList now={now} dayOfWeek={dayOfWeek} />
      </Wrapper>
    </Provider>
  );
};

export default App;
