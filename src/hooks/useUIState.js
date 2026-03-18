import { useState } from 'react';

export function useUIState() {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [addTenderOpen, setAddTenderOpen] = useState(false);
  const [sundayAIOpen, setSundayAIOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  return {
    datePickerOpen, setDatePickerOpen,
    addTenderOpen, setAddTenderOpen,
    sundayAIOpen, setSundayAIOpen,
    commentsOpen, setCommentsOpen,
    helpOpen, setHelpOpen,
    snackbar, setSnackbar,
  };
}
