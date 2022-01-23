import { forwardRef, Ref, useState, ReactElement, useContext } from 'react';
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import LoadingButton from '@mui/lab/LoadingButton';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import UserCircleTwoToneIcon from '@mui/icons-material/SupervisedUserCircleTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import Logo from 'src/components/Logo';
import timer from 'src/utils/timer';
import { useDataContext } from 'src/contexts/DataContext';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-container {
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
    }
`
);

const InputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
);

function HeaderSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { addUser } = useDataContext();

  const handleClickSignIn = async (event: any): Promise<void> => {
    setHasError(false);
    setLoading(false);
    if (username && password === 'Paktolus') {
      setLoading(true);
      await timer(2000);
      setLoading(false);
      addUser(username);
      handleDialogClose();
    } else {
      setHasError(true);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Box>
        <Button color="primary" fullWidth onClick={handleDialogOpen}>
          <LockTwoToneIcon sx={{ mr: 1 }} />
          Sign in
        </Button>
      </Box>

      <DialogWrapper
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleDialogClose}
      >
        <DialogTitleWrapper>
          <Box
            display="flex"
            justifyContent="center"
            py={5}
            alignItems="center"
          >
            <Logo />
          </Box>
          <InputWrapper
            value={username}
            autoFocus={true}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <UserCircleTwoToneIcon />
                </InputAdornment>
              )
            }}
            placeholder="Enter Username..."
            fullWidth
            label="Username"
          />
          <Box style={{ margin: '20px' }} />
          <InputWrapper
            value={password}
            autoFocus={true}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VisibilityTwoToneIcon />
                </InputAdornment>
              )
            }}
            placeholder="Password is Paktolus..."
            fullWidth
            label="Password"
          />
        </DialogTitleWrapper>

        {hasError && (
          <>
            <Divider />
            <DialogContent>
              <Box sx={{ pt: 0 }} display="flex" justifyContent="center">
                <Typography variant="body2" component="span" color="error">
                  Username or password is incorrect
                </Typography>
              </Box>
            </DialogContent>
            <Divider sx={{ mt: 1 }} />
          </>
        )}
        <DialogTitleWrapper>
          <Box flex="1" sx={{ textAlign: 'center' }}>
            <LoadingButton
              fullWidth
              onClick={handleClickSignIn}
              loading={isLoading}
            >
              Sign in
            </LoadingButton>
          </Box>
        </DialogTitleWrapper>
      </DialogWrapper>
    </>
  );
}

export default HeaderSignIn;
