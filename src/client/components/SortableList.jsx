import React from 'react';
import styled from 'styled-components';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { Flex, Box } from 'rendition';
import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

export const SortableItem = sortableElement(({ value }) => (
  <Flex flexDirection='row' alignItems='center'>
    {value}
    <DragHandle />
  </Flex>
));

export const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});
