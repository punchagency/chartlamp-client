import React from 'react'; // Add import statement for React

import { Box, Dialog, DialogContent } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import DialogTitleWithCloseIcon from './DialogTitleWithCloseIcon';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  headline?: string;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  content: React.ReactNode;
  actions?: React.ReactNode;
  hideBackdrop?: boolean;
  hasCloseIcon?: boolean;
  subText?: string;
   maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false; // max width can only be 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

const dialogPaperSx: SxProps<Theme> = {
  borderRadius: 150,
};

const actionsSx: SxProps<Theme> = (theme) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
});

/**
 * A Wrapper around the Dialog component to create centered
 * Login, Register or other Dialogs.
 */
function FormDialog({
  open,
  onClose,
  loading = false,
  headline,
  onFormSubmit,
  content,
  actions,
  subText,
  hideBackdrop = false,
  hasCloseIcon = true,
  maxWidth = 'md',
  ...dialogProps
}: FormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={loading}
      maxWidth={maxWidth} // or provide a valid Breakpoint value or remove the prop if not needed
      PaperProps={{
        sx: dialogPaperSx,
        style: { borderRadius: 15 },
      }}
      hideBackdrop={hideBackdrop}
      {...dialogProps}
    >
      {hasCloseIcon && (
        <DialogTitleWithCloseIcon
          title={headline || ''}
          onClose={onClose}
          disabled={loading}
          subText={subText}
        />
      )}
      <DialogContent
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
          backgroundColor: 'background.paper',
        }}
      >
        <form onSubmit={onFormSubmit}>
          <Box width="100%">{content}</Box>
          <Box width="100%" sx={actionsSx}>
            {actions}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
