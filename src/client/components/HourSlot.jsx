import React from 'react';
import { Flex, Txt } from 'rendition';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import styled from 'styled-components';

const Outer = styled(Flex)`
  position: relative;
  background-color: ${({ current }) => (current ? '#e1ebf0' : 'transparent')};
`;

const ScoreBox = styled(Flex)`
  border-top: 1px solid #95b3d7;
  border-bottom: 1px solid #95b3d7;
  color: ${({ score }) => (score === 1 ? '#fff' : '#789bc5')};
  background-color: ${({ score }) => {
    if (!score) {
      return '#fffff3';
    } else if (score === 1) {
      return '#95b3d7';
    } else if (score === 2) {
      return '#bcdaff';
    }
    return '#d5f6ff';
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
