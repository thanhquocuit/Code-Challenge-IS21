/**
 * System admin page
 */

import { Alert, AlertIcon, AlertTitle, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Select, Stack, Text, Tooltip, useColorMode, useDisclosure } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { MdOutlineAdd, MdOutlinePersonAddDisabled } from "react-icons/md";
import { GridLoader } from "react-spinners";
import AlertDialogRef from "../component/AlertDialog";
import PageTemplate, { DataLoaderOp, PageHeading } from "../component/PageTemplate";
import BE, { IUser, UserRoles } from '../model/Backend';

/**
 * Component for showing user information
 */
function UserItem(props: { data: IUser }) {

    function printRoleName(role: number) {
        switch (role) {
            case 0: return 'Painter';
            case 1: return 'Marketing';
            case 999: return 'System Admin';
            default: return 'Unknow Role'
        }
    }

    function isAdmin(role: number) {
        return role == 999;
    }

    function handleUpdateRole(role: number) {
        BE.updateUserRole(props.data.id, role, {
            begin: () => DataLoaderOp.showLoading(),
            end: () => {
                DataLoaderOp.showCompleted()
                BE.dataListeners.doUserUpdate()
            }
        })
    }

    // kitty placeholder for avatar demo
    const kittySize = (80 + Math.random() * 20).toFixed()

    return (
        <GridItem>
            <Card boxShadow='4px 4px 5px 2px rgba(0,0,0,0.2)' border="1px rgb(226, 232, 240) solid" minH='420px'>
                <CardHeader>
                    {!!props.data.disabled && <Alert status='info'>
                        <AlertIcon />
                        <AlertTitle>Account is disabled</AlertTitle>
                    </Alert>}
                </CardHeader>

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
                    <Text textAlign='center' fontWeight='bold' mt='2'>{props.data.name}</Text>
                    <Text textAlign='center'>{props.data.email}</Text>
                    {isAdmin(props.data.role)
                        ? <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle textAlign='center'>{`${props.data.name} is System Admin`}</AlertTitle>
                        </Alert>
                        : <Text textAlign='center'>{printRoleName(props.data.role)}</Text>
                    }

                </CardBody>

                {/* Profile editting buttons */}
                <CardFooter borderTop='1px white solid'>

                    {/* Layout horizontally */}
                    <Stack direction='row' w='100%' justifyContent='space-between'>
                        {/* Button to delete user permernantly */}
                        <Tooltip label='Disable/Enable user'>
                            <IconButton icon={<MdOutlinePersonAddDisabled />} colorScheme='red' variant='outline' aria-label="Disable/Enable user"
                                onClick={() => {
                                    BE.updateUserStatus(props.data.id, props.data.disabled ? 0 : 1, {
                                        begin: () => DataLoaderOp.showLoading(),
                                        end: () => {
                                            DataLoaderOp.showCompleted()
                                            BE.dataListeners.doUserUpdate()
                                        }
                                    })
                                }} />
                        </Tooltip>

                        {/* Profile edit or changing permission */}
                        <ButtonGroup isAttached>
                            <IconButton colorScheme='green' icon={<FaEdit />} aria-label="Edit User" />

                            {/* Put permission list in a menu */}
                            <Menu>
                                <MenuButton as={Button} colorScheme="purple" rightIcon={<FaChevronDown />}>
                                    Role
                                </MenuButton>

                                {/* Permission list */}
                                <MenuList>
                                    <MenuItem onClick={() => handleUpdateRole(UserRoles.Painter)}>Painter</MenuItem>
                                    <MenuItem onClick={() => handleUpdateRole(UserRoles.Marketing)}>Marketing</MenuItem>
                                    <MenuItem onClick={() => handleUpdateRole(UserRoles.Admin)}>System Admin</MenuItem>
                                </MenuList>
                            </Menu>
                        </ButtonGroup>
                    </Stack>
                </CardFooter>
            </Card>
        </GridItem>
    )
}

function CreateUserDrawer() {
    const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<any>()
    const [isError, setError] = React.useState('')

    function validateEmail(value: string) {
        let errorMessage;
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            errorMessage = 'Invalid email address';
        }
        return errorMessage;
    }

    function handleSubmit(values: any, actions: any) {
        setError('')
        BE.createUser(values.name, values.email, parseInt(values.role), {
            begin: () => DataLoaderOp.showLoading(),
            end: (err?: string) => {
                DataLoaderOp.showCompleted()

                if (err) {
                    actions.setSubmitting(false)
                    setError(err)
                }
                else {
                    BE.dataListeners.doUserUpdate()

                    AlertDialogRef.showToast(`Account created successfull!`)
                    onClose()
                }
            }
        });
    }

    return (
        <>
            <Button leftIcon={<MdOutlineAdd />} colorScheme='green' onClick={() => {
                setError('')
                onOpen()
            }}>
                Create user
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <Formik initialValues={{ email: 'quoc@gmail.com', name: 'Quoc', role: 0 }}
                    onSubmit={handleSubmit}>

                    {(props) => (
                        <Form>
                            <DrawerContent bg={colorMode == 'light' ? 'white.500' : 'black.500'}>
                                <DrawerCloseButton />
                                <DrawerHeader borderBottomWidth='1px'>
                                    Create a new account
                                </DrawerHeader>

                                <DrawerBody>
                                    <Stack spacing='24px'>

                                        {/* Input name */}
                                        <Field name='name' validate={(value: string) => !value && 'Name is required'} >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.name && val.form.touched.name}>
                                                    <FormLabel htmlFor='username'>Name</FormLabel>
                                                    <Input
                                                        ref={firstField}
                                                        id='username' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter user name'
                                                        {...val.field} type="text"
                                                    />
                                                    <FormErrorMessage>{val.form.errors.name}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        {/* Input email */}
                                        <Field name='email' validate={validateEmail} >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.email && val.form.touched.email}>
                                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                                    <Input
                                                        id='email' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter user email'
                                                        {...val.field} type="email"
                                                    />
                                                    <FormErrorMessage>{val.form.errors.email}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        {/* Input role */}
                                        <Field name='role'>
                                            {(val: any) => (
                                                <FormControl >
                                                    <FormLabel htmlFor='owner'>Select Role</FormLabel>
                                                    <Select isDisabled={props.isSubmitting} id='owner'  {...val.field}>
                                                        <option value='0'>Painter</option>
                                                        <option value='1'>Marketing</option>
                                                        <option value='999'>Admin</option>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Alert status='info'>
                                            <AlertIcon />
                                            <AlertTitle textAlign='center'>Default password is: Password@1</AlertTitle>
                                        </Alert>

                                        {isError && <Alert status='error'>
                                            <AlertIcon />
                                            <AlertTitle textAlign='center'>{isError}</AlertTitle>
                                        </Alert>}
                                    </Stack>
                                </DrawerBody>

                                <DrawerFooter borderTopWidth='1px'>
                                    <Button variant='outline' mr={3} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='blue' type='submit' isLoading={props.isSubmitting}>Create</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </>
    )
}

/**
 * The admin page: managing users and permissions
 * 
 */
export default function AdminPage() {
    const [isReady, setReady] = React.useState(false)
    const [data, setData] = React.useState<IUser[]>([])

    // on mounted: fetching data from server
    React.useEffect(() => {
        BE.getUsers().then((resp) => {
            setReady(true);
            setData(resp);
        })

        BE.dataListeners.cbUserData = (resp) => {
            setData([...resp]);
        }
    }, [])

    return isReady
        ? (
            <PageTemplate>
                {/** Heading */}
                <PageHeading title="System Admin">
                    <CreateUserDrawer />
                </PageHeading>

                {/* Users table */}
                <Grid templateColumns='repeat(auto-fill, 350px)' gap={5} justifyContent='center'>
                    {data.map((data, key) =>
                        <UserItem key={key} data={data} />
                    )}

                </Grid>
            </PageTemplate>
        )
        : (
            <PageTemplate>
                <Box w='350px' m='auto' mt='5rem'>
                    <Box ml='100px'>
                        <GridLoader color='lightgreen' />
                    </Box>
                    <Text fontSize='md'>Loading users, please wait for a moment</Text>
                </Box>
            </PageTemplate>
        )
}