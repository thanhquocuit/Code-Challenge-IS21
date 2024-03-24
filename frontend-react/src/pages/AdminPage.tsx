/**
 * System admin page
 */

import { Button, ButtonGroup, Card, CardBody, CardFooter, Grid, GridItem, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";
import PageTemplate, { PageHeading } from "../component/PageTemplate";

/**
 * Component for showing user information
 */
function UserItem() {

    // kitty placeholder for avatar demo
    const kittySize = (80 + Math.random() * 20).toFixed()

    return (
        <GridItem>
            <Card boxShadow='4px 4px 5px 2px rgba(0,0,0,0.2)' border="1px rgb(226, 232, 240) solid">

                <CardBody>
                    {/* User avatar demo */}
                    <div style={{
                        backgroundImage: `url(https://loremflickr.com/${kittySize}/${kittySize}/)`,
                        backgroundSize: '100%',
                        width: `${kittySize}px`,
                        height: `${kittySize}px`,
                        borderRadius: `${kittySize}px`,
                        margin: 'auto'
                    }}></div>

                    {/* Name, job and other information */}
                    <Text textAlign='center' fontWeight='bold' mt='2'>John</Text>
                    <Text textAlign='center'>Painter</Text>
                </CardBody>

                {/* Profile editting buttons */}
                <CardFooter borderTop='1px white solid'>

                    {/* Layout horizontally */}
                    <Stack direction='row' w='100%' justifyContent='space-between'>
                        {/* Button to delete user permernantly */}
                        <IconButton icon={<FaTrash />} color='red' aria-label="Delete User" />

                        {/* Profile edit or changing permission */}
                        <ButtonGroup isAttached>
                            <IconButton colorScheme='blue' icon={<FaEdit />} aria-label="Edit User" />

                            {/* Put permission list in a menu */}
                            <Menu>
                                <MenuButton as={Button} colorScheme="purple" rightIcon={<FaChevronDown />}>
                                    Permission
                                </MenuButton>

                                {/* Permission list */}
                                <MenuList>
                                    <MenuItem>Download</MenuItem>
                                    <MenuItem>Create a Copy</MenuItem>
                                    <MenuItem>Mark as Draft</MenuItem>
                                    <MenuItem>Delete</MenuItem>
                                    <MenuItem>Attend a Workshop</MenuItem>
                                </MenuList>
                            </Menu>
                        </ButtonGroup>
                    </Stack>
                </CardFooter>
            </Card>
        </GridItem>
    )
}

/**
 * The admin page: managing users and permissions
 * 
 */
export default function AdminPage() {
    return (
        <PageTemplate>
            {/** Heading */}
            <PageHeading title="System Admin">
                <Button leftIcon={<MdOutlineAdd />} colorScheme="green">Add new user</Button>
            </PageHeading>

            {/* Users table */}
            <Grid templateColumns='repeat(auto-fill, 350px)' gap={5} justifyContent='center'>
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
            </Grid>
        </PageTemplate>
    )
}