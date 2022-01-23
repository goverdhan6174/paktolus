import { useMemo, useContext } from 'react';
import { Card } from '@mui/material';
import PropTypes from 'prop-types';

import GameRecordTable from './GameRecordTable';
import { DataContext } from 'src/contexts/DataContext';

function GameRecord({ onlyUser }) {
  const {
    user: { name },
    game: { record }
  } = useContext(DataContext);

  const gameSlots = useMemo(() => {
    if (onlyUser) return record.filter((record) => record.username === name);
    return record;
  }, [onlyUser]);

  return (
    <Card>
      <GameRecordTable gameSlots={gameSlots} />
    </Card>
  );
}

export default GameRecord;

GameRecord.propTypes = {
  onlyUser: PropTypes.bool.isRequired
};

GameRecord.defaultProps = {
  onlyUser: false
};
