import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FlexCol } from '../FlexCol/FlexCol';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface IBKTabProps {
  children: React.ReactNode[],
  tabLabels?: string[]
}

export function BKTab(props: IBKTabProps) {
  const {tabLabels, children} = props
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {
            children.map((_, index) => {
              return (
                <Tab label={tabLabels ? tabLabels[index] : `Item ${index}`} {...a11yProps(index)} />
              )
            })
          }
        </Tabs>
      </Box>
      {
        children.map((it, index) => {
          return (
            <TabPanel value={value} index={index}>
              {it}
            </TabPanel>
          )
        })
      }
    </Box>
  );
}