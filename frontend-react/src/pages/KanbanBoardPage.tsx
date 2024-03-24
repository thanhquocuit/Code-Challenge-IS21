/**
 * Main home page: the kanban style board
 */

import { Box, Button, Card, CardBody, CardHeader, Flex, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import { GrDrag } from "react-icons/gr";
import { ReactSortable } from "react-sortablejs";
import PageTemplate from '../component/PageTemplate';
import { MdOutlineAdd } from 'react-icons/md';

/**
 * The board note components
 * 
 * @param color the paint color
 */
function Note(props: { color: string }) {
  return (
    <Card mb='5'
      boxShadow='4px 4px 5px 2px rgba(0,0,0,0.2)'
      border="1px rgb(226, 232, 240) solid"

      // Custom attr hook for storing drag&drop information across columns
      attr-color={props.color}>

      {/* Heading text: where user can click and drag */}
      <CardHeader className='card-handle' display='flex'>
        <Box flex='0' minWidth='40px'>
          <Icon w={5} h={5} as={GrDrag} />
        </Box>
        <Heading flex='2' size='md'>{props.color}</Heading>
      </CardHeader>

      {/* Note body content */}
      <CardBody>
        <Flex justifyContent='space-between'>
          <Text>{props.color}</Text>
          <Box width='32px' bgColor={props.color}></Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

/**
 * Kanban board columns
 * @param listGroup important to prevent drag&drop between different board columns 
 */
function KanbanColumn(props: { title: string, items: any[], listGroup: string }) {
  const [state, setState] = React.useState<any[]>(props.items);

  return (
    <Box w='100%' h='100%'>
      <Text>{props.title}</Text>

      {/* Integrating Sortable API */}
      <ReactSortable
        className='board-cont' // CSS name for custom css hook
        list={state} setList={setState} animation={200}
        handle='.card-handle' // Handle for dragging, the CardHeader only, allow to use CardBody for other interactions
        group={props.listGroup} ghostClass='ghost' chosenClass='chosen'

        // Enable cross columns drag&drop
        onAdd={(evt) => {
          console.log(`${props.title}: ${evt.item.getAttribute('attr-color')}`)
        }}>

        {/* The sticky note elements */}
        {state.map((item) => (
          <Note key={item.id} color={item.color} />
        ))}
      </ReactSortable>
    </Box>
  );
}

/**
 * Kanban board component
 * 
 * @param headerButtons? put 'Add New Thing' button here 
 */
function KanbanBoard(props: { title: string, headerButtons?: React.ReactNode }) {

  /*
  Generate drag&drop group name from the title, the content of group name is not important. 
  Just make to it is different to other boards is enough
  */
  const listGroup = props.title.replaceAll(/\s+/g, '')

  return (
    <Box w='100%'>

      {/* Heading text */}
      <HStack justifyContent='space-between'>
        <Box mb={5}>
          <Icon as={FaList} display='inline-block' mr='3' mb='3' fontSize='x-large' color='gray' />
          <Heading size='lg' display='inline-block'>Sorting by {props.title}</Heading>
        </Box>
        {props.headerButtons}
      </HStack>

      {/** We are organizing the board with 3 columns: Available, Running Low and Out of Stock */}
      <Flex className='kanban-board' dir='row' gap='5'>

        {/* Column 1: Available */}
        <KanbanColumn title='Available' listGroup={listGroup} items={[
          { id: 1, color: "blue" },
          { id: 2, color: "grey" },
          { id: 3, color: "white" },
        ]} />

        {/* Column 2: Running Low */}
        <KanbanColumn title='Running Low' listGroup={listGroup} items={[
          { id: 4, color: "purple" },
        ]} />

        {/* Column 3: Out of Stock */}
        <KanbanColumn title='Out of Stock' listGroup={listGroup} items={[
          { id: 5, color: "black" },
        ]} />
      </Flex>
    </Box>
  )
}

/**
 * The home page component
 */
export default function KanbanBoardPage() {
  function Separator() {
    return <hr style={{ width: '33%' }} />
  }

  return (
    <PageTemplate>
      {/* Board 1: the paint stock showing the quality of paints in inventory */}
      <KanbanBoard title="Paint Stock" headerButtons={<Button leftIcon={<MdOutlineAdd />} colorScheme="green">Add new paint</Button>} />

      {/* Board 2: the paint orders: houses and painting progress */}
      <Separator />
      <KanbanBoard title="Orders" headerButtons={<Button leftIcon={<MdOutlineAdd />} colorScheme="green">Add new order</Button>} />

    </PageTemplate>
  );
}
