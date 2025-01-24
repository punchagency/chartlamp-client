"use client";
import { PRIMARY, pxToRem } from '@/theme';
import { Divider, FormControlLabel, Stack, styled, Switch, SwitchProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import React from 'react';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  margin: theme.spacing(1),
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? "#FFFFFF" : '#000000',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface NotificationItemProps {
  title: string;
  description: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, description }) => (
  <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
    <Stack direction="column" spacing={1}>
      <Typography variant="h4" color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Stack>
    <FormControlLabel control={<IOSSwitch defaultChecked />} label="Push" />
  </Stack>
);

export default function NotificationTab() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    router.push('/dashboard/home');
  };

  const notifications = [
    { title: "Comments", description: "These are notification for comments on any case" },
    { title: "New case upload", description: "These are notification if any new case is uploaded" },
    { title: "New team member", description: "These are notification if any new case is uploaded" },
    { title: "Invite accepted", description: "These are notification if any new case is uploaded" },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderLeft: `1px solid ${PRIMARY['10']}`,
        mt: 2,
        minHeight: '85vh',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h2">
          Manage notification settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We may still send you important notifications about your account outside of your notification settings.
        </Typography>
      </Box>
      <Divider />
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ m: 2, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: pxToRem(610) }}>
        {notifications.map((notification, index) => (
          <NotificationItem key={index} title={notification.title} description={notification.description} />
        ))}
      </Box>
    </Box>
  );
}