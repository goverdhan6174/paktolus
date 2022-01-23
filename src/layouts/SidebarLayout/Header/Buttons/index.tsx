import { Box } from '@mui/material';
import SignInButton from 'src/components/Button/SignIn';

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <SignInButton />
    </Box>
  );
}

export default HeaderButtons;
