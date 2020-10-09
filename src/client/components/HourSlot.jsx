import React from 'react';
import { Flex, Txt } from 'rendition';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import styled from 'styled-components';

const Outer = styled(Flex)`
  position: relative;
  background-color: ${({ theme, current }) => (current ? theme.colors.quartenary.main : 'transparent')};
`;

const ScoreBox = styled(Flex)`
  border-top: 1px solid ${({theme}) => theme.colors.gray.dark};
  border-bottom: 1px solid ${({theme}) => theme.colors.gray.dark};
  background-color: ${({ score }) => {
    if (!score) {
      return '#ffebee';
    } else if (score === 1) {
      return '#76ea7d';
    } else if (score === 2) {
      return '#b0ecb2';
    }
    return '#cff4d1';
  }};
`;

const TxtWrapper = styled(Flex)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const availabilityMap = {
  1: 'Preferred',
  2: 'Non-preferred',
  3: 'Ask me nicely!',
};

const HourSlot = ({ tzDateTime, scores, isCurrent, dayOfWeek, ...rest }) => {
  const hours = getHours(tzDateTime);
  const minutes = getMinutes(tzDateTime);
  return (
    <Outer
      py={2}
      {...rest}
      current={isCurrent}
      flexDirection='row'
      alignItems='center'
      alignSelf='stretch'
    >
      {scores.map((score) => (
        <ScoreBox
          width='15px'
          height='38px'
          score={score}
          tooltip={availabilityMap[score]}
        />
      ))}
      <TxtWrapper
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Txt fontSize={minutes ? '80%' : '100%'}>{hours}</Txt>
        {hours && minutes ? <Txt fontSize='60%'>{minutes}</Txt> : null}
      </TxtWrapper>
    </Outer>
  );
};

export default HourSlot;
