
import { Alert, AlertIcon, AlertTitle, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightAddon, Select, Stack, Textarea, useColorMode, useDisclosure } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { MdOutlineAdd } from "react-icons/md";
import AlertDialogRef from "./AlertDialog";
import { DataLoaderOp } from "./PageTemplate";
import BE from '../model/Backend';
import { HexColorPicker } from "react-colorful";

export function PaintCreateDrawer() {
    const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<any>()
    const [isError, setError] = React.useState('')
    const [color, setColor] = React.useState("#b32aa9");

    function handleSubmit(values: any, actions: any) {
        setError('')

        const code = values.code.substring(1)
        BE.createPaint(values.title, code, values.desc, values.quantity, {
            begin: () => DataLoaderOp.showLoading(),
            end: (err?: string) => {
                DataLoaderOp.showCompleted()

                if (err) {
                    actions.setSubmitting(false)
                    setError(err)
                }
                else {
                    BE.dataListeners.doStockUpdate()

                    AlertDialogRef.showToast(`Paint created successfull!`)
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
                Add new paint
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <Formik initialValues={{ title: '', code: '', desc: '', quantity: 0 }}
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

                                        {/* Input color HEX */}
                                        <Field name='code' validate={(value: string) => !value && 'Color HEX is required'} >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.code && val.form.touched.code}>
                                                    <FormLabel htmlFor='code'>Color HEX</FormLabel>
                                                    <Input
                                                        id='code' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter color Hex'
                                                        {...val.field} type="text"
                                                    />
                                                    <HexColorPicker color={color} onChange={(code) => {
                                                        val.form.values.code = code
                                                        setColor(code)
                                                    }} />

                                                    <FormErrorMessage>{val.form.errors.code}</FormErrorMessage>
                                                </FormControl>

                                            )}
                                        </Field>

                                        {/* Input quantity */}
                                        <Field name='quantity' validate={(value: number) => value <= 0 && 'Please enter valid quantity'} >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.quantity && val.form.touched.quantity}>
                                                    <FormLabel htmlFor='quantity'>Quantity</FormLabel>
                                                    <Input
                                                        id='quantity' isDisabled={props.isSubmitting}
                                                        placeholder='Please enter quantity'
                                                        {...val.field} type="number"
                                                    />

                                                    <FormErrorMessage>{val.form.errors.quantity}</FormErrorMessage>
                                                </FormControl>

                                            )}
                                        </Field>

                                        {/* Input description */}
                                        <Field name='desc'  >
                                            {(val: any) => (
                                                <FormControl isInvalid={val.form.errors.desc && val.form.touched.desc}>
                                                    <FormLabel htmlFor='desc'>Description</FormLabel>
                                                    <Textarea
                                                        id='desc' isDisabled={props.isSubmitting}
                                                        {...val.field}
                                                    />
                                                    <FormErrorMessage>{val.form.errors.desc}</FormErrorMessage>
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