/**
 * Main home page: the kanban style board
 */

import { Box, Button, Card, CardBody, CardHeader, Center, Flex, HStack, Heading, Icon, Stack, Text, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import { GrDrag } from "react-icons/gr";
import { MdOutlineAdd } from 'react-icons/md';
import { ReactSortable } from "react-sortablejs";
import PageTemplate, { DataLoaderOp } from '../component/PageTemplate';
import BE, { IOrder, IPaint, PaintStatus } from '../model/Backend';
import { GridLoader } from 'react-spinners';


function SVGPaintBucket(props: { color: string }) {
  const { colorMode } = useColorMode()

  let stroke = props.color == '#000000' ? 'lightgray' : 'black';
  if (colorMode != 'light')
    stroke = props.color == 'lightgray' ? 'white' : 'lightgray';

  return (
    <svg width="64px" height="64px" viewBox="0 0 128 128">
      <path style={{ fill: props.color, fillOpacity: 1, fillRule: 'evenodd', opacity: 1, stroke: 'none' }} d="M23.4833,29.6701 C23.4833,29.6701,72.0596,30.7332,72.0596,30.7332 C72.0596,30.7332,117.84,31.7351,117.84,31.7351 C117.84,31.7351,116.543,111.359,116.543,111.359 C116.543,111.359,71.2369,119.731,71.2369,119.731 C71.2369,119.731,23.5465,112.336,23.5465,112.336 C23.5465,112.336,23.4833,29.6701,23.4833,29.6701 z" />
      <path style={{ fill: stroke, fillOpacity: 1, fillRule: 'nonzero', opacity: 1, stroke: 'none' }} d="M69.013,1.30957 C40.8386,1.30957,12.3355,8.92135,12.3355,18.3128 C12.3355,18.3128,12.3355,35.7298,12.3355,35.7298 C9.66598,38.2916,6.75843,41.5619,4.46299,45.4443 C2.09954,49.4401,0.999996,53.5265,0.999996,57.3749 C0.999996,62.8046,3.25009,67.7639,7.76162,71.3289 C11.9784,74.6616,17.7709,76.5206,24.5552,76.5206 C35.6639,76.5206,49.4366,71.5386,63.3452,59.9764 C63.3452,59.9764,63.3452,66.4943,63.3452,66.4943 C63.3452,71.1929,67.1539,74.9959,71.8468,74.9959 C76.5397,74.9959,80.3485,71.1929,80.3485,66.4943 C80.3485,66.4943,80.3485,57.987,80.3485,57.987 C80.3485,54.8584,82.8819,52.3193,86.0162,52.3193 C89.1505,52.3193,91.684,54.8584,91.684,57.987 C91.684,57.987,91.684,74.9903,91.684,74.9903 C91.684,78.1189,94.2174,80.658,97.3517,80.658 C100.486,80.658,103.019,78.1189,103.019,74.9903 C103.019,74.9903,103.019,52.3193,103.019,52.3193 C103.019,49.1907,105.553,46.6515,108.687,46.6515 C111.821,46.6515,114.355,49.1907,114.355,52.3193 C114.355,52.3193,114.355,55.1645,114.355,55.1645 C114.355,55.1645,114.361,104.723,114.361,104.723 C113.992,106.271,99.4771,114.664,69.1773,114.664 C38.5885,114.664,24.028,106.271,23.671,104.763 C23.671,104.763,23.671,82.1033,23.671,82.1033 C20.2647,82.0693,15.7588,81.4288,12.3355,80.1819 C12.3355,80.1819,12.3355,104.757,12.3355,104.757 C12.3355,116.064,35.0065,126,69.1773,126 C102.844,126,125.69,116.11,125.69,104.763 C125.69,104.763,125.69,18.3128,125.69,18.3128 C125.69,8.92135,97.1873,1.30957,69.013,1.30957 z M9.34292,48.3292 C10.2384,46.8102,11.2699,45.4273,12.3355,44.1124 C12.3355,44.1124,12.3355,67.6052,12.3355,67.6052 C12.3355,67.6052,11.2756,66.8854,11.2756,66.8854 C5.77223,62.5326,5.04676,55.5953,9.34292,48.3292 z M23.671,70.8188 C23.671,70.8188,23.671,33.0433,23.671,33.0433 C41.6434,42.0833,61.4975,34.6756,63.1808,52.5573 C47.7079,66.755,33.7369,71.2156,23.671,70.8188 z M69.455,28.4071 C57.8192,28.4071,27.0093,26.1966,27.0093,20.5232 C27.0093,14.7931,55.2687,11.4038,69.455,11.4038 C84.0098,11.4038,112.025,14.8555,112.025,20.5232 C112.025,26.2533,81.363,28.4071,69.455,28.4071 z" />
    </svg>
  )
}

function SVGOrderItem(props: { color: string }) {
  const { colorMode } = useColorMode()

  let stroke = props.color == 'black' ? 'lightgray' : 'black';
  if (colorMode != 'light')
    stroke = props.color == 'lightgray' ? 'white' : 'lightgray';

  return (
    <svg width="64px" height="64px" viewBox="0 0 128 128">
      <path style={{ fill: props.color, fillOpacity: 1, fillRule: 'evenodd', opacity: 1, stroke: 'none' }} d="M17.3167,53.1949 C17.3167,53.1949,64.8645,4.12853,64.8645,4.12853 C64.8645,4.12853,112.412,53.1949,112.412,53.1949 C112.412,53.1949,112.412,121.465,112.412,121.465 C112.412,121.465,82.6438,121.465,82.6438,121.465 C82.6438,121.465,82.3206,76.549,82.3206,76.549 C82.3206,76.549,47.6596,76.6452,47.6596,76.6452 C47.6596,76.6452,47.3677,121.465,47.3677,121.465 C47.3677,121.465,17.3167,121.465,17.3167,121.465 C17.3167,121.465,17.3167,53.1949,17.3167,53.1949 z" />
      <path style={{ fill: stroke, fillOpacity: 1, fillRule: 'nonzero', opacity: 1, stroke: 'none' }} d="M115.912,62.246 C115.912,83.69,115.912,103.134,115.912,124.578 C81.8357,124.578,47.7598,124.578,13.6838,124.578 C13.6838,103.134,13.6838,83.69,13.6838,62.246 C11.4808,64.449,9.27781,66.652,7.0748,68.855 C5.87021,67.6504,4.66563,64.4458,3.46104,63.2412 C23.9066,42.7957,44.3522,22.3501,64.7978,1.90451 C85.2433,22.3501,105.689,42.7957,126.134,63.2412 C124.93,64.4458,123.725,67.6504,122.521,68.855 C120.318,66.652,118.115,64.449,115.912,62.246 C115.912,62.246,115.912,62.246,115.912,62.246 z M85.2433,117.467 C93.7623,117.467,100.281,117.467,108.8,117.467 C108.8,96.0226,108.8,77.5786,108.8,56.1346 C93.4661,40.8004,80.1319,27.4662,64.7978,12.132 C49.4636,27.4662,36.1294,40.8004,20.7952,56.1346 C20.7952,77.5786,20.7952,96.0226,20.7952,117.467 C29.3142,117.467,35.8332,117.467,44.3522,117.467 C44.3522,102.132,44.3522,88.7982,44.3522,73.464 C57.9826,73.464,71.613,73.464,85.2433,73.464 C85.2433,88.7982,85.2433,102.132,85.2433,117.467 z M78.1319,81.1428 C67.9092,81.1428,61.6864,81.1428,51.4636,81.1428 C51.4636,94.3949,51.4636,103.647,51.4636,116.899 C61.6864,116.899,67.9092,116.899,78.1319,116.899 C78.1319,103.647,78.1319,94.3949,78.1319,81.1428 z" />
    </svg>
  )
}

/**
 * The board note components
 * 
 * @param color the paint color
 */
function Note(props: {
  id: number,
  title: string, desc: string, color: string,
  icon: React.ReactElement<typeof SVGPaintBucket | typeof SVGOrderItem>
}) {
  return (
    <Card mb='5'
      boxShadow='4px 4px 5px 2px rgba(0,0,0,0.2)'
      border="1px rgb(226, 232, 240) solid"

      // Custom attr hook for storing drag&drop information across columns
      attr-dataid={props.id}>

      {/* Heading text: where user can click and drag */}
      <CardHeader className='card-handle' display='flex'>
        <Box flex='0' minWidth='40px'>
          <Icon w={5} h={5} as={GrDrag} />
        </Box>
        <Heading flex='2' size='md'>{props.title}</Heading>
      </CardHeader>

      {/* Note body content */}
      <CardBody>
        <Flex justifyContent='space-between'>
          <Text>{props.desc}</Text>
          {props.icon}
        </Flex>
      </CardBody>
    </Card>
  )
}

function PaintBucket(props: { data: IPaint }) {
  const color = `#${props.data.color_code}`
  return <Note id={props.data.id} title={props.data.title}
    desc={props.data.desc}
    color={color}
    icon={<SVGPaintBucket color={color} />} />
}

function PaintOrder(props: { data: IOrder }) {
  const color = `#ffff`
  return <Note id={props.data.id} title={props.data.title}
    desc={props.data.address}
    color={color}
    icon={<SVGOrderItem color={color} />} />
}

/**
 * Kanban board columns
 * @param listGroup important to prevent drag&drop between different board columns 
 */
function KanbanColumn(props: {
  title: string, type: 'paint' | 'order',
  column: number, items: (IPaint | IOrder)[], listGroup: string
}) {
  const [state, setState] = React.useState<any[]>(props.items);

  return (
    <Box w='100%' h='100%'>
      <Text fontSize='larger' fontWeight='bold'>{props.title}</Text>

      {/* Integrating Sortable API */}
      <ReactSortable
        className='board-cont' // CSS name for custom css hook
        list={state} setList={setState} animation={200}
        handle='.card-handle' // Handle for dragging, the CardHeader only, allow to use CardBody for other interactions
        group={props.listGroup} ghostClass='ghost' chosenClass='chosen'

        // Enable cross columns drag&drop
        onAdd={(evt) => {
          const attr = evt.item.getAttribute('attr-dataid')
          if (attr) {
            const itemID = parseInt(attr);
            const tracker = {
              begin: () => DataLoaderOp.showLoading(),
              end: () => DataLoaderOp.showCompleted(),
            }

            if (props.type == 'paint') {
              BE.updatePaintStatus(itemID, props.column, tracker)
            }
            else {
              BE.updateOrderStatus(itemID, props.column, tracker)
            }
          }
        }}>

        {/* The sticky note elements */}
        {state.map((item) => (
          props.type == 'paint'
            ? <PaintBucket key={item.id} data={item} />
            : <PaintOrder key={item.id} data={item} />
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
function KanbanBoard(props: {
  title: string,
  columns: [string, string, string],
  type: 'paint' | 'order',
  data: (IPaint | IOrder)[],
  headerButtons?: React.ReactNode
}) {

  /*
  Generate drag&drop group name from the title, the content of group name is not important. 
  Just make to it is different to other boards is enough
  */
  const listGroup = props.title.replaceAll(/\s+/g, '')

  return (
    <Box w='100%'>

      {/* Heading text */}
      <Stack justifyContent='space-between' direction={{ sm: 'column', lg: 'row' }}>
        <Box mb={5}>
          <Icon as={FaList} display='inline-block' mr='3' mb='3' fontSize='x-large' color='gray' />
          <Heading size='lg' display='inline-block'>Sorting by {props.title}</Heading>
        </Box>
        <Box my={{ sm: '5', lg: '0' }} alignItems='end'>{props.headerButtons}</Box>
      </Stack>

      {/** We are organizing the board with 3 columns: Available, Running Low and Out of Stock */}
      <Flex className='kanban-board' direction={{ sm: 'column', lg: 'row' }} gap='5'>

        {/* Column 1: Available */}
        <KanbanColumn title={props.columns[0]} column={PaintStatus.Available} type={props.type} listGroup={listGroup}
          items={props.data.filter(a => a.status == PaintStatus.Available)} />

        {/* Column 2: Running Low */}
        <KanbanColumn title={props.columns[1]} column={PaintStatus.RunningLow} type={props.type} listGroup={listGroup}
          items={props.data.filter(a => a.status == PaintStatus.RunningLow)} />

        {/* Column 3: Out of Stock */}
        <KanbanColumn title={props.columns[2]} column={PaintStatus.OutOfStock} type={props.type} listGroup={listGroup}
          items={props.data.filter(a => a.status == PaintStatus.OutOfStock)} />
      </Flex>
    </Box>
  )
}

/**
 * The home page component
 */
export default function KanbanBoardPage() {

  const [isReady, setReady] = React.useState(false)
  const [data, setData] = React.useState({ paints: [] as IPaint[], orders: [] as IOrder[] })

  // on mounted: fetching data from server
  React.useEffect(() => {
    BE.getPaintStocks().then((resp) => {
      setReady(true);
      setData(resp);
    })
  }, [])

  function Separator() {
    const width = useBreakpointValue({ base: '33%', sm: '90%', lg: '33%' })
    return <hr style={{ width }} />
  }

  return isReady
    ? (
      <PageTemplate>
        {/* Board 1: the paint stock showing the quality of paints in inventory */}
        <KanbanBoard
          title="Paint Stock" columns={['Available', 'Running Low', 'Out of Stock']} type='paint' data={data.paints}
          headerButtons={
            <Button leftIcon={<MdOutlineAdd />} colorScheme="green">
              Add new paint
            </Button>
          } />

        {/* Board 2: the paint orders: houses and painting progress */}
        <Separator />

        <KanbanBoard title="Orders" columns={['Waiting', 'Painting', 'Completed']} type='order' data={data.orders}
          headerButtons={
            <Button leftIcon={<MdOutlineAdd />} colorScheme="green">
              Add new order
            </Button>} />

      </PageTemplate>
    )
    : (
      <PageTemplate>
        <Box w='350px' m='auto' mt='5rem'>
          <Box ml='100px'>
            <GridLoader color='lightgreen' />
          </Box>
          <Text fontSize='md'>Loading data, please wait for a moment</Text>
        </Box>
      </PageTemplate>
    )
}
