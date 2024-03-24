import { Box, Button, Card, CardBody, Center, HStack, Heading, Text } from "@chakra-ui/react";
import { ThemeToggler } from "../component/PageTemplate";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function PageNotFound() {
    return (
        <Box margin='auto' w='320px'>
            {/* App Logo */}
            <HStack w='100%' flex='2' mt='1rem' justifyContent='space-between'>
                <Box>
                    <img className="header-icon" width='32px' src="/logo64.png" alt="paint stock icon" style={{ display: 'inline-block' }} />
                    <Heading float='right' size='md' pt='4px' pl='1' mb='0' fontStyle='italic' display='inline-block'>My Paint Stock</Heading>
                </Box>
                <ThemeToggler />
            </HStack>

            {/* Login page welcome message */}
            <Box my='4rem'>
                <Heading color='purple'>404</Heading>
                <Text>There is nothing here to see!</Text>
            </Box>
            <Link to='/' >
                <Button colorScheme="purple" w='200px' leftIcon={<FaArrowLeft />}>Go Back</Button>
            </Link>
        </Box>
    )
}