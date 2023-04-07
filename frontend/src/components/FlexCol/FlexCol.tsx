import { styled } from '@mui/system';

interface FlexColProps {
  flex?: number;
}

export const FlexCol = styled('div')<FlexColProps>(({ flex }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: flex,
}));