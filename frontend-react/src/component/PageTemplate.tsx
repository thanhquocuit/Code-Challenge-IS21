import { BoxProps, Flex, HStack, IconButton, Input, InputGroup, InputRightElement, useColorMode } from "@chakra-ui/react";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function MenuToggler() {
    return <IconButton icon={<FaBars />} aria-label="Open menu" title="Open menu" />
}

function AppIcon() {
    return <img className="header-icon" src="/logo64.png" alt="paint stock icon" />
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

function Header() {
    return <div className="page-header">
        <Flex justifyContent='space-between'>
            {/** Left side */}
            <HStack flex='2'>
                <MenuToggler />
                <AppIcon />
                <SearchBar flex='2' />
            </HStack>

            {/** Right side */}
            <HStack flex='1' justifyContent='end'>
                <ThemeToggler />
            </HStack>
        </Flex>
    </div>
}

function Footer() {
    return <div className="page-footer"></div>
}

export default function PageTemplate(props: PropsWithChildren<any>) {
    const { colorMode } = useColorMode();

    return (
        <div className="page-template">
            <Header />
            <div className="page-content">
                {props.children}
            </div>
            <Footer />
            <ScrollRestoration />
        </div>
    )
}