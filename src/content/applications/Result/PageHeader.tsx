import { Typography, Grid } from '@mui/material';
import { useDataContext } from 'src/contexts/DataContext';

function PageHeader() {
  const { user } = useDataContext();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Results , {user.name}
        </Typography>
        <Typography variant="subtitle2">
          These are the Slot game results
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
