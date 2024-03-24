import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools"
import "./fonts.scss";
import "./styles.scss";

// 2. Update the breakpoints as key-value pairs
// {{ sm: , md: , lg: }}
export const breakpoints = {
    base: 0,
    sm: 320,
    md: 768,
    lg: 960,
    xl: 1200,
    "2xl": 1536,
};


// 3. Extend the theme
const AppTheme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    breakpoints: (function () {
        const obj: any = {}
        for (const [k, v] of Object.entries(breakpoints))
            obj[k] = `${v}px`
        return obj
    })(),
    fonts: {
        heading: `"Barlow", "Roboto", "Open Sans", sans-serif`,
        body: `"Barlow", "Roboto", "Montserrat","Fira Code",Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    },
    colors: {
        white: {
            50: "#444",
            100: "#bbb",
            500: "#fff",
        },
        black: {
            50: "#231f20",
            100: "#262522",
            500: "#222",
        },
    },
    components: {
        Stack: defineStyleConfig({
            baseStyle: defineStyle(props => {
                return {
                    bg: mode(`white.50`, `black.50`)(props)
                }
            }),
        }),
    },
})

export default AppTheme