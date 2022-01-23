import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Avatar,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  CardHeader
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import Label from 'src/components/Label';
import {
  Card as GameCard,
  GameSlot,
  GameSlotStatus
} from 'src/models/game_slot';

interface GameRecordTableProps {
  className?: string;
  gameSlots: GameSlot[];
}

interface Filters {
  status?: GameSlotStatus;
}

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.error};
`
);

const AvatarWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.main};
      color: ${theme.palette.warning.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.warning};
`
);

const GameIconBox = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    border-radius: ${theme.general.borderRadius};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
`
);

const getStatusLabel = (gameSlotStatus: GameSlotStatus): JSX.Element => {
  const map = {
    lose: {
      text: 'Lose',
      color: 'error'
    },
    win: {
      text: 'Win',
      color: 'success'
    },
    neutral: {
      text: 'Neutral',
      color: 'warning'
    }
  };

  const { text, color }: any = map[gameSlotStatus];

  return <Label color={color}>{text}</Label>;
};

const getTrendingAvatar = (gameSlotStatus: GameSlotStatus): JSX.Element => {
  switch (gameSlotStatus) {
    case 'win':
      return (
        <AvatarSuccess>
          <TrendingUp fontSize="large" />
        </AvatarSuccess>
      );
    case 'neutral':
      return (
        <AvatarWarning>
          <TrendingFlat fontSize="large" />
        </AvatarWarning>
      );
    case 'lose':
      return (
        <AvatarError>
          <TrendingDown fontSize="large" />
        </AvatarError>
      );
  }
};

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

const applyFilters = (gameSlots: GameSlot[], filters: Filters): GameSlot[] => {
  return gameSlots.filter((gameSlot) => {
    let matches = true;

    if (filters.status && gameSlot.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  gameSlots: GameSlot[],
  page: number,
  limit: number
): GameSlot[] => {
  return gameSlots.slice(page * limit, page * limit + limit);
};

const GameRecordTable: FC<GameRecordTableProps> = ({ gameSlots }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'win',
      name: 'Win'
    },
    {
      id: 'neutral',
      name: 'Neutral'
    },
    {
      id: 'lose',
      name: 'Lose'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredGameSlots = applyFilters(gameSlots, filters);
  const paginatedGameSlots = applyPagination(filteredGameSlots, page, limit);

  return (
    <Card>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        title="Recent Orders"
      />

      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No.</TableCell>
              <TableCell>PlayerName</TableCell>
              <TableCell>Game ID</TableCell>
              <TableCell>Combination</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGameSlots.map((gameSlot, index) => {
              return (
                <TableRow hover key={gameSlot.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {page * limit + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {gameSlot.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(gameSlot.gameDate, 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {gameSlot.gameID}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container>
                      {getCombinationIcons(gameSlot.combination)}
                    </Grid>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {getStatusLabel(gameSlot.status)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {numeral(gameSlot.amount).format('$0,0.00')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getTrendingAvatar(gameSlot.status)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredGameSlots.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

GameRecordTable.propTypes = {
  gameSlots: PropTypes.array.isRequired
};

GameRecordTable.defaultProps = {
  gameSlots: []
};

export default GameRecordTable;
