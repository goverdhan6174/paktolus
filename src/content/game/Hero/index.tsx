import { useRef, useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { useDataContext } from 'src/contexts/DataContext';
import {
  Card as GameCard,
  GameSlot,
  GameSlotStatus
} from 'src/models/game_slot';
import { cardCombination } from 'src/utils/cardCombination';
import { randomString } from 'src/utils/random';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapperSuccess = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(16)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const LabelWrapperWarning = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.warning.main};
    color: ${theme.palette.warning.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(16)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const LabelWrapperError = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.error.main};
    color: ${theme.palette.error.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(16)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const GameIconBox = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(16)};
    height: ${theme.spacing(16)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(1)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const getCombinationIcons = (combination: GameCard[]): JSX.Element[] => {
  return combination.map((comb, index) => {
    return (
      <Grid key={index} item xs={12} md={4}>
        <GameIconBox>
          <img
            src={`/static/images/placeholders/illustrations/${comb}.svg`}
            alt={`${comb} icon`}
          />
        </GameIconBox>
      </Grid>
    );
  });
};

function Hero() {
  const [open, setOpen] = useState(false);
  const [gameResult, setGameResult] = useState({
    status: '',
    combination: [],
    amount: 0
  });
  const gameTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (gameTimeout.current) clearTimeout(gameTimeout.current);
    };
  }, []);

  const {
    auth: { isAuthenticated },
    addRecord
  } = useDataContext();

  const handleClickOpen = (win = false) => {
    setOpen(true);
    let combination = cardCombination(win);
    setGameResult(combination);
    addRecord({ ...combination, gameID: randomString() });
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            Slot Game
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, mb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            Play and Earn
          </TypographyH2>

          {!isAuthenticated && (
            <Typography variant="body2" color="text.secondary" noWrap my={4}>
              You are playing as a Guest
            </Typography>
          )}
          <Button
            size="large"
            variant="contained"
            onClick={(_e) => handleClickOpen()}
          >
            Play
          </Button>
          <Button
            sx={{ ml: 2 }}
            size="large"
            variant="outlined"
            onClick={(_e) => handleClickOpen(true)}
          >
            Fake Win
          </Button>
        </Grid>
      </Grid>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        data-testid="dialog-testid"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container my={10} spacing={2}>
            {getCombinationIcons(gameResult.combination)}
          </Grid>

          <Grid container justifyContent="center" sx={{ mb: 2 }}>
            {gameResult.status === 'win' && (
              <LabelWrapperSuccess data-testid="inside-testid">
                Yeah, you won ${gameResult.amount} 👌
              </LabelWrapperSuccess>
            )}
            {gameResult.status === 'neutral' && (
              <LabelWrapperWarning data-testid="inside-testid">
                😊 you win ${gameResult.amount}
              </LabelWrapperWarning>
            )}
            {gameResult.status === 'lose' && (
              <LabelWrapperError data-testid="inside-testid">
                Try Again, You lost ${gameResult.amount}
              </LabelWrapperError>
            )}
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </Container>
  );
}

export default Hero;
