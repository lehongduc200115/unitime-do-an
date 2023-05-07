import { Container, TextField } from "@mui/material";

interface IBKSearch {
  onChange: any
}

export const BKSearch = ({ onChange }: IBKSearch) => {
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <TextField type="search" id="search" label="Search" sx={{ width: 600 }} onChange={onChange} />
      </Container>
    </>
  )
};