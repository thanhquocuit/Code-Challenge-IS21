import { As, Box, BoxProps, Button, Flex, HStack, Heading, Icon, IconButton, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaBars, FaEye, FaList, FaPaintRoller, FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaBoxOpen, FaCheck } from "react-icons/fa6";
import { MdClear, MdDarkMode, MdLabel, MdLightMode } from "react-icons/md";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import BE, { useSession } from "../model/Backend";
import ImgPaintBrush from '../static/paint_brush.png';
import ImgPaintDrops from '../static/paint_drops.png';
import AlertDialogRef from "./AlertDialog";
import { UIAvatar } from "./ElementUtils";

/**
 * Located at top left of the header, use to toggling the menu panel
 */
function MenuToggler(props: { onToggle: (expand: boolean) => void }) {
    const [expanded, setExpanded] = React.useState(false);

    return <IconButton icon={<FaBars />} aria-label="Open menu" title="Open menu" onClick={() => {
        const toggle = !expanded
        setExpanded(toggle)
        props.onToggle(toggle)
    }} />
}

/**
 * App logo and icon
 */
export function AppIcon(props: { to: string }) {
    return (
        <Box cursor='pointer' w='' display={{ sm: 'none', lg: 'block' }}>
            <Link to={props.to}>
                <img className="header-icon" src="/logo64.png" alt="paint stock icon" />
                <Heading float='right' size='lg' pt='5px' pl='1' mb='0' fontStyle='italic' color='purple'>My Paint Stock</Heading>
            </Link>
        </Box>
    )
}

/**
 * Header searching bar, pack as a hook for other can retrieving search query
 */
const SearchBarDelegate = {
    onUpdate: (val: string) => { }
}

export function useSearchBar() {
    const [searchQuery, setSearchQuery] = React.useState('')

    // tracking search query updating from the component
    React.useEffect(() => {
        SearchBarDelegate.onUpdate = (val) => setSearchQuery(val)
    }, [])

    return searchQuery
}

function SearchBar(props: BoxProps) {
    const [searchData, setSearchData] = React.useState('')

    return (
        <InputGroup {...props} >
            <Input placeholder='Search' value={searchData} onChange={(evt) => {
                let query = evt.target.value
                if (query) query = query.trim().toLowerCase();

                setSearchData(query)
                SearchBarDelegate.onUpdate(query)
            }} />

            {/* search icon or clear icon */}
            <InputRightElement>
                {searchData
                    ? <MdClear color='purple' onClick={() => {
                        setSearchData('')
                        SearchBarDelegate.onUpdate('')
                    }} />
                    : <FaSearch color='purple' />
                }

            </InputRightElement>
        </InputGroup>
    )
}

const DataLoaderRef = React.createRef<any>()
export const DataLoaderOp = {
    showLoading: () => DataLoaderRef.current && DataLoaderRef.current.showLoading(),
    showCompleted: () => DataLoaderRef.current && DataLoaderRef.current.showCompleted(),
}

/**
 * Small icon component to render current data fetchin progress
 */
function DataLoader() {
    const Elm = React.forwardRef((_props: any, ref) => {
        const [state, setState] = React.useState('');

        const showLoading = React.useCallback(() => setState('loading'), []);
        const showCompleted = React.useCallback(() => setTimeout(() => setState('completed'), 800), []);

        React.useImperativeHandle(ref, () => ({ showLoading, showCompleted }), [
            showLoading,
            showCompleted,
        ]);

        return state == 'loading'
            ? <SyncLoader size='8px' color="lightgreen" />
            : (state == 'completed'
                ? <Icon as={FaCheck} color="lightgreen" w='22px' />
                : <></>
            )
    })

    return <Elm ref={DataLoaderRef} />
}

/**
 * Button to toggle theme across the app
 */
export function ThemeToggler() {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <IconButton isRound={true} variant='outline' aria-label='Toggle Theme' fontSize='20px'
            color={colorMode === "dark" ? "white" : "yellow.500"}
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
        />
    )
}

/** 
 * Component to render avatar icon of login user
*/
function AvatarIcon() {
    const session = useSession()

    function getInitialName() {
        if (session.name.length > 2) return session.name.substring(0, 2).toUpperCase();
        else return session.name || 'CA'
    }

    return <UIAvatar initial={getInitialName()} size={40} bgColor="none" textColor="white" />
}
function AvatarMenu() {
    const nav = useNavigate()
    const session = useSession()

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <Tooltip label={`Hey, ${session.name}`} aria-label='A tooltip'>
                        <MenuButton
                            isActive={isOpen}
                            as={Button}
                            className="avatar-btn"
                        >
                            <AvatarIcon />
                        </MenuButton>
                    </Tooltip>
                    <MenuList>
                        <MenuItem isDisabled={true} className="MenuItem-text">
                            Hi, {session.name}
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FaEye />} onClick={() => {
                            AlertDialogRef.showMessage('Feature has not immplemented yet')
                        }}>View Profile</MenuItem>
                        <MenuItem
                            icon={<FaSignOutAlt />}
                            onClick={() => {
                                BE.logout();
                                AlertDialogRef.showToast(`Logout successful.`)
                                nav('/login')
                            }}
                        >
                            Sign Out
                        </MenuItem>
                    </MenuList>
                </>
            )}
        </Menu>
    )
}

/**
 * Main Header
 */
function Header(props: { onToggleLeftBar: (expand: boolean) => void }) {
    return <div className="page-header">
        <Flex justifyContent='space-between'>
            {/** Left side */}
            <HStack flex='2'>
                <MenuToggler onToggle={props.onToggleLeftBar} />
                <AppIcon to='/' />
                <SearchBar flex='2' marginLeft='2rem' />
            </HStack>

            {/** Right side */}
            <HStack flex='1' justifyContent='end' maxW={{ sm: '50px', lg: 'unset' }}>
                <DataLoader />
                <Box display={{ sm: 'none', lg: 'block' }}><ThemeToggler /></Box>
                <Box display={{ sm: 'none', lg: 'block' }}><AvatarMenu /></Box>
            </HStack>
        </Flex>
    </div>
}

/**
 * Main Footer
 */
function Footer() {
    return <div className="page-footer">
        <Text float='right' m='5'>@ThanhQuoc, 2024</Text>
    </div>
}

/**
 * 
 * @param isMenuExpanded force the menu in expanded mode or not 
 * @returns 
 */
function MainMenu(props: { className: string, isMenuExpanded: boolean }) {
    const nav = useNavigate();

    const [menuState, setMenuState] = React.useState(props.isMenuExpanded)
    React.useEffect(() => {
        setMenuState(props.isMenuExpanded)
    }, [props.isMenuExpanded])

    /*
    Auto expand menu when mouse is hover on
     */
    const handlePointerEnter = React.useCallback(() => {
        if (props.isMenuExpanded) return;
        setMenuState(true)
    }, [props.isMenuExpanded])

    // Hide when mouse is hover out
    const handlePointerLeave = React.useCallback(() => {
        if (props.isMenuExpanded) return;
        setMenuState(false)
    }, [props.isMenuExpanded])

    // Menu items
    function Item(itemProps: PropsWithChildren<{ icon: As, to: string }>) {
        return (
            <Link to={itemProps.to}>
                <Stack className="item" direction='row' m='1' pr='5' mr='5' py='2'
                    borderEndRadius='1rem' cursor='pointer'>
                    <Icon className="icon" fontSize='2rem' as={itemProps.icon} mt='1' />
                    <Text className="txt" fontWeight='500' fontSize='large' pt='1' m='0'>  {itemProps.children}</Text>
                </Stack>
            </Link>
        )
    }

    return (
        <Flex className={`${props.className} ${menuState ? 'expanded' : ''}`}
            direction='column' pt='5' justifyContent='space-between'
            onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
            <Flex direction='column'>
                {/* System admin menu, available to admin only */}
                {BE.isAdmin() &&
                    <Box >
                        <Item icon={FaUser} to='/admin'>System Admin</Item>
                    </Box>}

                {/* organize note by category */}
                <Item icon={FaPaintRoller} to='/#orders'>Orders</Item>
                <Item icon={FaBoxOpen} to='/#stock'>Stocks</Item>
                <Item icon={MdLabel} to='/?label=custom'>Custom labels</Item>
            </Flex>

            {/* Second menu item for repsonsive layout */}
            <Flex direction='column' display={{ sm: 'flex', lg: 'none' }}>
                <Stack className="item" direction='row' m='1' pr='5' mr='5' py='2'>
                    <Button bgColor='var(--app-purple)' ml='2'>
                        <AvatarIcon />
                    </Button>
                </Stack>
                <Stack className="item" direction='row' m='1' pr='5' mr='5' py='2'>
                    <Icon className="icon" fontSize='2rem' as={FaSignOutAlt} mt='1' onClick={() => {
                        BE.logout();
                        AlertDialogRef.showToast(`Logout successful.`)
                        nav('/login')
                    }} />
                </Stack>
            </Flex>
        </Flex>
    )
}

/**
 * The app content componnent
 * @param props isMenuExpanded: respond the width corresponding to the width of main menu
 * @returns 
 */
function MainContent(props: PropsWithChildren<{ className: string, isMenuExpanded: boolean }>) {
    return (
        <div className={`${props.className} ${props.isMenuExpanded && 'menu-expanded'}`}>

            {/* Wrapper box to set the css property: relative for deco images*/}
            <Box p='5' h='100%' minH='calc(100vh - 128px)' pos='relative'>

                {/* children elements */}
                {props.children}

                {/* Decorations images under the background */}
                <img src={ImgPaintDrops} alt='bg-right' style={{ position: 'absolute', top: 0, right: 0, zIndex: -1, opacity: 0.2 }} />
                <img src={ImgPaintBrush} alt='bg-left' style={{ position: 'absolute', bottom: '-64px', left: 0, zIndex: -1, opacity: 0.2 }} />
            </Box>
        </div>
    )
}


/**
 * The main page skeleton can be shared across the application.
 * Included: PageHeader + <your content: props.children> + PageFooter
 * @param props The page content
 * @returns 
 */
export default function PageTemplate(props: PropsWithChildren<any>) {
    const [leftBarExpanded, setLeftBarExpanded] = React.useState(false);

    return <>
        {/* Wrapper class `page-template` outside all of components */}
        <div className="page-template">
            {/* The page header */}
            <Header onToggleLeftBar={(expanded) => setLeftBarExpanded(expanded)} />

            {/* The main app container */}
            <div className="page-content">
                {/* App main menu, will always stay on the left side */}
                <MainMenu className="left-menu" isMenuExpanded={leftBarExpanded} />

                {/* The remaining space for page content */}
                <MainContent className="right-content" isMenuExpanded={leftBarExpanded} >{props.children}</MainContent>
            </div>

            {/* The page footer */}
            <Footer />

            {/* Reset the scrolling position when navigate to other pages */}
            <ScrollRestoration />
        </div>
    </>
}

/**
 * Page heading, place before main content.
 * Title on the left side, and buttons on the right sides
 * 
 * @param props 
 * @returns 
 */
export function PageHeading(props: PropsWithChildren<{ title: string }>) {
    return (
        <HStack justifyContent='space-between' mb={5}>
            <Box>
                <Icon as={FaList} display='inline-block' mr='3' mb='3' fontSize='x-large' color='gray' />
                <Heading size='lg' display='inline-block'>{props.title}</Heading>
            </Box>
            {props.children}
        </HStack >
    )
}