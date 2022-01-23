import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Grid, Container } from '@mui/material';
import { useDataContext } from 'src/contexts/DataContext';

import ProfileCover from './ProfileCover';
import SignInButton from 'src/components/Button/SignIn';
import GameRecord from 'src/components/Table/GameRecord';

function ManagementUserProfile() {
  const {
    auth: { isAuthenticated },
    user
  } = useDataContext();

  return (
    <>
      <Helmet>
        <title>User Details - Management</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        {!isAuthenticated && <SignInButton />}
        {isAuthenticated && (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <ProfileCover user={user} />
            </Grid>
            <Grid item xs={12}>
              <GameRecord onlyUser />
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
