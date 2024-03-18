import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState, createContext, useContext } from 'react';
import { grey, cyan } from '@mui/material/colors';

const AppThemeContext = createContext();

export function useAppTheme() {
    return useContext(AppThemeContext);
}

export default function AppThemeProvider({ children }) {
    const [mode, setMode] = useState("light");

    const theme = useMemo(() => {
        let customTheme = createTheme({
            palette: {
                primary: {
                    main: cyan[500],
                },
                secondary: {
                    main: grey[700],
                },
                background: {
                    main: grey[100],
                },
                light: {
                    main: "#fff"
                },
                mode,
                ...(mode === "light"
                    ? {
                        site: { primary: cyan[500], secondary: grey[100], text: grey[700] }
                    }
                    : {
                        site: { primary: grey[900], secondary: grey[900], text: "#fff" }
                    }),
            },
            typography: {
                fontFamily: ["Lora Variable", "sans-serif"].join(","),
            },
        });
        customTheme = responsiveFontSizes(customTheme);
        return customTheme;
    }, [mode]);

    return (
        <AppThemeContext.Provider value={{ mode, setMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppThemeContext.Provider>
    );
}
