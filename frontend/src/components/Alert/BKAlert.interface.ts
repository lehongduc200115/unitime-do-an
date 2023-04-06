export interface IAlertProps {
  severity: "info" | "warning" | "success" | "error",
  title?: string,
  children: React.ReactNode,
  open: boolean,
  onClose: () => void,
}