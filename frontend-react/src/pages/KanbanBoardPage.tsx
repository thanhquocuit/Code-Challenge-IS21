/**
 * Main home page: the kanban style board
 */

import { Box, Card, CardBody, CardHeader, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import { GrDrag } from "react-icons/gr";
import { ReactSortable } from "react-sortablejs";
import PageTemplate from '../component/PageTemplate';


function Note(props: { color: string }) {
  return (
    <Card mb='5' boxShadow='4px 4px 5px 2px rgba(0,0,0,0.2)'
      border="1px rgb(226, 232, 240) solid"
      attr-color={props.color}>
      <CardHeader className='card-handle' display='flex'>
        <Box flex='0' minWidth='40px'>
          <Icon w={5} h={5} as={GrDrag} />
        </Box>
        <Heading flex='2' size='md'>{props.color}</Heading>
      </CardHeader>
      <CardBody>
        <Flex justifyContent='space-between'>
          <Text>{props.color}</Text>
          <Box width='32px' bgColor={props.color}></Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

function KanbanColumn(props: { title: string, items: any[], listGroup: string }) {
  const [state, setState] = React.useState<any[]>(props.items);

  return (
    <Box w='100%' h='100%'>
      <Text>{props.title}</Text>
      <ReactSortable className='board-cont' list={state} setList={setState} handle='.card-handle' animation={200}
        group={props.listGroup} ghostClass='ghost' chosenClass='chosen' onAdd={(evt) => {
          console.log(`${props.title}: ${evt.item.getAttribute('attr-color')}`)
        }}>
        {state.map((item) => (
          <Note key={item.id} color={item.color} />
        ))}
      </ReactSortable>
    </Box>
  );
}

function KanbanBoard(props: { title: string }) {

  const listGroup = props.title.replaceAll(/\s+/g, '')
  return (
    <Box w='100%'>
      <Box mb={5}>
        <Icon as={FaList} display='inline-block' mr='3' mb='3' fontSize='x-large' color='gray' />
        <Heading size='lg' display='inline-block'>Sorted by {props.title}</Heading>
      </Box>

      <Flex className='kanban-board' dir='row' gap='5'>
        <KanbanColumn title='Available' listGroup={listGroup} items={[
          { id: 1, color: "blue" },
          { id: 2, color: "grey" },
          { id: 3, color: "white" },
        ]} />

        <KanbanColumn title='Running Low' listGroup={listGroup} items={[
          { id: 4, color: "purple" },
        ]} />

        <KanbanColumn title='Out of Stock' listGroup={listGroup} items={[
          { id: 5, color: "black" },
        ]} />
      </Flex>
    </Box>
  )
}

export default function KanbanBoardPage() {
  function Separator() {
    return <hr style={{ width: '33%' }} />
  }

  return (
    <PageTemplate>
      <KanbanBoard title="Paint Stock" />
      <Separator />
      <KanbanBoard title="Orders" />
    </PageTemplate>
  );
}
