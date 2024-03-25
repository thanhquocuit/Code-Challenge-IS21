
import { Alert, AlertIcon, AlertTitle, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightAddon, Select, Stack, Textarea, useColorMode, useDisclosure } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { MdOutlineAdd } from "react-icons/md";
import AlertDialogRef from "./AlertDialog";
import { DataLoaderOp } from "./PageTemplate";
import BE from '../model/Backend';
import { HexColorPicker } from "react-colorful";

export function OrderCreateDrawer() {
    const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<any>()
    const [isError, setError] = React.useState('')
    const [color, setColor] = React.useState("#b32aa9");

    function handleSubmit(values: any, actions: any) {
        setError('')

        BE.createOrder(values.title, values.address || '', values.paint_color, {
            begin: () => DataLoaderOp.showLoading(),
            end: (err?: string) => {
                DataLoaderOp.showCompleted()

                if (err) {
                    actions.setSubmitting(false)
                    setError(err)
                }
                else {
                    BE.dataListeners.doStockUpdate()

                    AlertDialogRef.showToast(`Order created successfull!`)
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
                Add new order
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <Formik initialValues={{ title: '', address: '', paint_color: 0 }}
                    onSubmit={handleSubmit}>

                    {(props) => (
                        <Form>
                            <DrawerContent bg={colorMode == 'light' ? 'white.500' : 'black.500'}>
                                <DrawerCloseButton />
                                <DrawerHeader borderBottomWidth='1px'>
                                    Create a new paint
                                </DrawerHeader>

                                <DrawerBody>
                                    <Stack spacing='24px'>

                                        {/* Input name */}
                                        <Field name='title' validate={(value: string) => !value && 'Name is required'} >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.title && val.form.touched.title}>
                                                    <FormLabel htmlFor='title'>Title</FormLabel>
                                                    <Input
                                                        ref={firstField}
                                                        id='title' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter paint name'
                                                        {...val.field} type="text"
                                                    />
                                                    <FormErrorMessage>{val.form.errors.title}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        {/* Input address*/}
                                        <Field name='address'>
                                            {(val: any) => (
                                                <FormControl>
                                                    <FormLabel htmlFor='Address'>Address</FormLabel>
                                                    <Textarea
                                                        id='Address' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter address'
                                                        {...val.field} type="text"
                                                    />
                                                </FormControl>
                                            )}
                                        </Field>

                                        {/* Input paint_color */}
                                        <Field name='paint_color' >
                                            {(val: any) => (
                                                <FormControl>
                                                    <FormLabel htmlFor='paint_color'>Paint Color</FormLabel>
                                                    <Select isDisabled={props.isSubmitting} id='paint_color' {...val.field}>
                                                        {BE.getStocksCache().paints.map(a => <option value={a.id} key={a.id}>{a.title}</option>)}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </Field>

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