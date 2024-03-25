import {
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertStatus,
    Button,
    AlertDialog as ChakraAlertDialog,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import * as React from "react";

interface AlertDialogOption {
    showMessage: (message: string | JSX.Element, title?: string) => Promise<void>;
    showConfirmation: (
        message: string,
        title?: string,
        buttons?: string[]
    ) => Promise<boolean | string>;
    showToast: (
        description: string,
        title?: string,
        status?: AlertStatus) => void;
}

const alertDialogRef = React.createRef<AlertDialogOption>();

const AlertDialogRef: AlertDialogOption = {
    showMessage: (message: string | JSX.Element, title?: string) => {
        if (alertDialogRef.current)
            return alertDialogRef.current.showMessage(message, title);
        else return new Promise((rs) => rs());
    },
    showConfirmation: (message: string, title?: string, buttons?: string[]) => {
        if (alertDialogRef.current)
            return alertDialogRef.current.showConfirmation(message, title, buttons);
        else return new Promise((rs) => rs(false));
    },
    showToast(description: string, title: string = "Message", status: AlertStatus = 'success') {
        if (alertDialogRef.current)
            return alertDialogRef.current.showToast(description, title, status);
    },
};

export function AlertDialog() {
    const Referer = React.forwardRef<AlertDialogOption>((_props: any, ref) => {
        const [options, setOptions] = React.useState({
            title: "Message",
            message: "..." as (string | JSX.Element),
            cancelButton: false,
            buttons: ["OK"],
        });
        const {
            isOpen,
            onOpen: onOpenAlert,
            onClose: onCloseAlert,
        } = useDisclosure();
        const cancelRef = React.useRef<any>();
        const callbackRef = React.useRef({
            resolve: (_param?: any): ('completed' | 'blocked') => { return 'completed' },
            reject: () => { },
        });

        const showMessage = React.useCallback(
            (message: string | JSX.Element, title?: string): Promise<void> => {
                return new Promise((rs) => {
                    callbackRef.current.resolve = () => { rs(); return 'blocked' };
                    callbackRef.current.reject = rs;

                    title = title || "Message";
                    setOptions({
                        title,
                        message,
                        cancelButton: false,
                        buttons: ['OK'],
                    });
                    onOpenAlert();
                });
            }, [onOpenAlert]);

        const showConfirmation = React.useCallback(
            (
                message: string,
                title?: string,
                buttons?: string[]
            ): Promise<boolean | string> => {
                return new Promise((rs) => {
                    callbackRef.current.resolve = (result: boolean | string) => { rs(result); return 'completed' };

                    title = title || "Message";
                    buttons = buttons || ["OK"];
                    setOptions({
                        title,
                        message,
                        cancelButton: true,
                        buttons,
                    });
                    onOpenAlert();
                });
            }, [onOpenAlert]);

        const toast = useToast()
        const showToast = React.useCallback(
            (
                description: string,
                title?: string,
                status?: AlertStatus
            ) => {
                title = title || "Message",
                    status = status || 'success'

                toast({
                    title,
                    description,
                    status,
                    duration: 3200,
                    isClosable: true,
                })
            }, []);


        React.useImperativeHandle(ref, () => ({ showMessage, showConfirmation, showToast }), [
            showMessage,
            showConfirmation,
            showToast,
        ]);

        function handleCancel() {
            onCloseAlert();
            callbackRef.current.resolve(false);
        }

        function handleOkay(btn: string | any) {
            let ok = callbackRef.current.resolve(btn);
            if (ok == 'completed')
                onCloseAlert();
        }

        return (
            <ChakraAlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => handleCancel()}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bgColor="white">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {
                                options.title}
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            {
                                typeof options.message == 'string'
                                    ? <div dangerouslySetInnerHTML={{ __html: options.message }}></div>
                                    : options.message
                            }
                        </AlertDialogBody>
                        <AlertDialogFooter bg='none'>
                            {options.cancelButton && (
                                <Button
                                    ref={cancelRef}
                                    minW="100px"
                                    onClick={() => handleCancel()}
                                >
                                    Cancel
                                </Button>
                            )}
                            {options.buttons.map((btn) => (
                                <Button
                                    key={btn}
                                    colorScheme="app-primary"
                                    onClick={() => handleOkay(btn)}
                                    ml={3}
                                    minW="100px"
                                >
                                    {btn}
                                </Button>
                            ))}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </ChakraAlertDialog>
        );
    });

    return <Referer ref={alertDialogRef} />;
}

export default AlertDialogRef;