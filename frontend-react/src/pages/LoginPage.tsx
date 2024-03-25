import { Box, Card, HStack, CardBody, Heading, Text, FormControl, FormLabel, FormHelperText, Input, Button, FormErrorMessage, Center, Switch, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { ThemeToggler } from "../component/PageTemplate";
import { Field, Form, Formik } from 'formik';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import BE from '../model/Backend'
import AlertDialogRef from "../component/AlertDialog";

/**
 * Login from using Formik for easy from validation
 */
function LoginForm() {
    const nav = useNavigate()
    const [errorMsg, setErrorMsg] = React.useState('')

    function validateEmail(value: string) {
        let errorMessage;
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            errorMessage = 'Invalid email address';
        }
        return errorMessage;
    }

    function validatePassword(value: string) {
        let error
        if (!value) {
            error = 'Password is required'
        }
        return error
    }

    function handleSubmit(values: any, actions: any) {
        BE.login(values.email, values.password,
            {
                thenFn: (session) => {
                    // successfull, redirect to the homepage
                    if (session) {
                        AlertDialogRef.showToast(`Welcome back, ${session.name}!`)
                    }

                    nav('/')
                },
                catchFn: () => {
                    // login error
                    setErrorMsg('Incorrect email or password')
                },
                finallyFn: () => {
                    // stop spining the buttons
                    actions.setSubmitting(false)
                }
            })
    }

    return (
        <Formik initialValues={{ email: 'john@gmail.com', password: 'Password@1' }}
            onSubmit={handleSubmit}>

            {(props) => (
                <Form>

                    {/* Server responded: Login error email or password */}
                    {errorMsg && <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>{errorMsg}</AlertTitle>
                    </Alert>}

                    {/* Email field */}
                    <Field name='email' validate={validateEmail} >
                        {(val: any) => (
                            <FormControl isInvalid={val.form.errors.email && val.form.touched.email}>
                                <FormLabel>Email</FormLabel>
                                <Input {...val.field} isDisabled={props.isSubmitting} type="email" placeholder='email' />
                                <FormErrorMessage>{val.form.errors.email}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>

                    {/* Password field */}
                    <Field name='password' validate={validatePassword} >
                        {(val: any) => (
                            <FormControl isInvalid={val.form.errors.password && val.form.touched.password} mt='1'>
                                <FormLabel>Password</FormLabel>
                                <Input {...val.field} isDisabled={props.isSubmitting} type="password" placeholder='password' />
                                <FormErrorMessage>{val.form.errors.password}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>

                    {/* Form submit buttons */}
                    <HStack justifyContent='space-between'>
                        <FormControl display='flex' alignItems='center' mt='4'>
                            <Switch id='remember-me' isDisabled={props.isSubmitting} />
                            <FormLabel htmlFor='remember-me' ml='2' mt='1'>
                                Remember Me
                            </FormLabel>
                        </FormControl>
                        <Button mt={4} colorScheme='purple' isLoading={props.isSubmitting} type='submit' w='100px'>
                            Sign In
                        </Button>
                    </HStack>

                    {/* The link to go to Forgot Password page */}
                    <Center>
                        <Button variant='link' mt='5' size='sm' onClick={() => {
                            alert('Not implement yet')
                        }}>
                            Forgot Password?
                        </Button>
                    </Center>
                </Form>
            )}
        </Formik>
    )
}

/**
 * Login page
 */
export default function LoginPage() {
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
            <Box mt='4rem'>
                <Heading color='purple'>Sign In</Heading>
                <Text>Welcome back to your account.</Text>
            </Box>
            <Card variant='outline' mt='1rem'>
                <CardBody>
                    <LoginForm />
                </CardBody>
            </Card>

            {/* Helpful information */}
            <Alert status='success' mt='5'>
                <AlertIcon />
                <Box>
                    Please login with default users:
                    <ul>
                        <li>john@gmail.com</li>
                        <li>jane@gmail.com</li>
                        <li> adam@gmail.com</li>
                        <li>or your created accounts.</li>
                    </ul>
                    Default password for all: Password@1
                </Box>
            </Alert>
        </Box>
    )
}