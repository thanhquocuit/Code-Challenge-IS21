import { As, Box, BoxProps, Button, Flex, HStack, Heading, Icon, IconButton, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaBars, FaEye, FaPaintRoller, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { MdDarkMode, MdLabel, MdLightMode } from "react-icons/md";
import { ScrollRestoration } from "react-router-dom";
import { UIAvatar } from "./ElementUtils";
import ImgPaintBrush from '../static/paint_brush.png';
import ImgPaintDrops from '../static/paint_drops.png';

function MenuToggler(props: { onToggle: (expand: boolean) => void }) {
    const [expanded, setExpanded] = React.useState(false);

    return <IconButton icon={<FaBars />} aria-label="Open menu" title="Open menu" onClick={() => {
        const toggle = !expanded
        setExpanded(toggle)
        props.onToggle(toggle)
    }} />
}

function AppIcon() {
    return <>
        <img className="header-icon" src="/logo64.png" alt="paint stock icon" />
        <Heading size='md'>My Paint Stock</Heading>
    </>
}

function SearchBar(props: BoxProps) {
    return (
        <InputGroup {...props} >
            <Input placeholder='Search' />
            <InputRightElement>
                <FaSearch color='green.500' />
            </InputRightElement>
        </InputGroup>
    )
}

function ThemeToggler() {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <IconButton isRound={true} variant='outline' aria-label='Toggle Theme' fontSize='20px'
            color={colorMode === "dark" ? "white" : "yellow.500"}
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
        />
    )
}

function AvatarIcon() {
    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <Tooltip label="Hey, Hello Quoc" aria-label='A tooltip'>
                        <MenuButton
                            isActive={isOpen}
                            as={Button}
                            className="avatar-btn"
                        >
                            <UIAvatar initial='TH' size={40} bgColor="none" textColor="white" />
                        </MenuButton>
                    </Tooltip>
                    <MenuList>
                        <MenuItem isDisabled={true} className="MenuItem-text">
                            Hi, Quoc
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FaEye />}>View Profile</MenuItem>
                        <MenuItem
                            icon={<FaSignOutAlt />}
                            onClick={() => { }}
                        >
                            Sign Out
                        </MenuItem>
                    </MenuList>
                </>
            )}
        </Menu>
    )
}

function Header(props: { onToggleLeftBar: (expand: boolean) => void }) {
    return <div className="page-header">
        <Flex justifyContent='space-between'>
            {/** Left side */}
            <HStack flex='2'>
                <MenuToggler onToggle={props.onToggleLeftBar} />
                <AppIcon />
                <SearchBar flex='2' marginLeft='2rem' />
            </HStack>

            {/** Right side */}
            <HStack flex='1' justifyContent='end'>
                <ThemeToggler />
                <AvatarIcon />
            </HStack>
        </Flex>
    </div>
}

function Footer() {
    return <div className="page-footer">
        <Text float='right' m='5'>@ThanhQuoc, 2024</Text>
    </div>
}

function MainMenu(props: { className: string, isMenuExpanded: boolean }) {

    const [menuState, setMenuState] = React.useState(props.isMenuExpanded)
    React.useEffect(() => {
        setMenuState(props.isMenuExpanded)
    }, [props.isMenuExpanded])

    const handlePointerEnter = React.useCallback(() => {
        if (props.isMenuExpanded) return;
        setMenuState(true)
    }, [props.isMenuExpanded])

    const handlePointerLeave = React.useCallback(() => {
        if (props.isMenuExpanded) return;
        setMenuState(false)
    }, [props.isMenuExpanded])

    function Item(itemProps: PropsWithChildren<{ icon: As }>) {
        return (
            <Stack className="item" direction='row' m='1' pr='5' mr='5' py='2'
                borderEndRadius='1rem' cursor='pointer'>
                <Icon className="icon" fontSize='2rem' as={itemProps.icon} mt='1' />
                <Text className="txt" fontWeight='500' fontSize='large' pt='1' m='0'>  {itemProps.children}</Text>
            </Stack>
        )
    }

    return (
        <Flex className={`${props.className} ${menuState ? 'expanded' : ''}`} direction='column' pt='5'
            onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
            <Item icon={FaPaintRoller}>Orders</Item>
            <Item icon={FaBoxOpen}>Stocks</Item>
            <Item icon={MdLabel}>Custom labels</Item>
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
            <Box p='5' h='100%' pos='relative'>

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