import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import React from 'react';

interface DialogTitleWithCloseIconProps {
  paddingBottom?: number;
  onClose: () => void;
  disabled?: boolean;
  title: string;
  subText?: string;
  disablePadding?: boolean;
}

const DialogTitleWithCloseIcon: React.FC<DialogTitleWithCloseIconProps> = (props) => {
  const { paddingBottom, onClose, disabled, title, disablePadding } = props;
  const theme = useTheme();

  const sx: SxProps<Theme> = {
    paddingBottom: paddingBottom
      ? paddingBottom && disablePadding
        ? 0
        : paddingBottom
      : theme.spacing(3),
    paddingLeft: disablePadding ? 0 : null,
    paddingRight: disablePadding ? 0 : null,
    paddingTop: disablePadding ? 0 : theme.spacing(2),
    width: '100%',
    backgroundColor: 'background.paper',
  };

  return (
    <DialogTitle sx={sx}>
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          style={{ marginRight: -12, marginTop: -10, zIndex: 1000 }}
          disabled={disabled}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {props.subText && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          {props.subText}
        </Typography>
      )}
    </DialogTitle>
  );
};

export default DialogTitleWithCloseIcon;