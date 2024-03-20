import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Typography } from '@mui/material';

export default function AlertSnackBar({ errors, showAlert, setShowAlert }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowAlert(false);
    };

    return (
        <Snackbar open={showAlert} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={3000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity="warning"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {errors.map(error => <Typography key={error}>{error}</Typography>)}
            </Alert>
        </Snackbar>
    );
}
