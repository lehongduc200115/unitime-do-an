import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/Alert';
import { IAlertProps } from './BKAlert.interface';

export const BKAlert = (props: IAlertProps) => {
  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClose={props.onClose}>
      <Alert severity={props.severity}>
        {/* <AlertTitle>{props.title}</AlertTitle> */}
        {props.children}
      </Alert>
    </Snackbar>
  )
}