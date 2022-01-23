import { GameSlot } from 'src/models/game_slot';
import { randomName, randomString } from './random';
import { cardCombination } from './cardCombination';
import { subDays } from 'date-fns';

export default function gameRecordSeeds(arrLength = 20): GameSlot[] {
  let records: GameSlot[] = [];

  for (let i = 1; i <= arrLength; i++) {
    let statusAndCombination = cardCombination(i === arrLength / 2);
    let record = {
      id: i,
      username: randomName(),
      gameDate: subDays(new Date(), i).getTime(),
      ...statusAndCombination,
      gameID: randomString(8)
    } as GameSlot;
    records.push(record);
  }

  return records;
}
