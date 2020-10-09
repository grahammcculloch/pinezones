import React from 'react';
import keys from 'lodash/keys';
import { Flex, ButtonGroup, Button } from 'rendition';
import { DoW } from '../util';

const DayPicker = ({ dayOfWeek, onChange }) => {
  return (
    <Flex
      my={4}
      flexDirection='row'
      flex={1}
      justifyContent='center'
      alignItems='center'
    >
      <ButtonGroup>
        {keys(DoW)
          .slice(1, 6)
          .map((index) => (
            <Button
              key={index}
              active={dayOfWeek.toString() === index}
              onClick={() => onChange(index)}
            >
              {DoW[index]}
            </Button>
          ))}
      </ButtonGroup>
    </Flex>
  );
};

export default DayPicker;
