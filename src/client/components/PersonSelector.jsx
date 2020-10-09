import React from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import memoize from 'lodash/memoize';
import { Box, Flex, Txt } from 'rendition';
import Select from 'react-select';

const SingleLine = styled(Txt) `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const formatPerson = (option) => {
  return (
    <Flex flexDirection="column">
      <SingleLine bold>{option.label}</SingleLine>
      <SingleLine>
        <Txt.span color="text.light">{option.person.timezoneOffset}</Txt.span>
        <Txt.span ml={2} color="text.light" italic>{option.person.timezone}</Txt.span>
      </SingleLine>
    </Flex>
  )
}

const PersonSelector = ({
  allPeopleOptions,
  person,
  onPersonSelected,
  ...rest
}) => {
  const onChange = (option) => {
    onPersonSelected(get(option, ['person'], null));
  };

  const getPersonOption = memoize(
    (p) =>
      p && {
        label: `${p.name} (${p.username})`,
        value: p.id,
        person: p,
      },
  );

  return (
    <Box my={2} {...rest}>
      <Select
        placeholder="Select team member..."
        value={getPersonOption(person)}
        formatOptionLabel={formatPerson}
        options={allPeopleOptions}
        onChange={onChange}
        styles={{
          control: (base) => ({
            ...base,
            minWidth: '250px',
          }),
          valueContainer: (base) => ({
            ...base,
            minHeight: '58px'
          })
        }}
      />
    </Box>
  );
};

export default PersonSelector;
