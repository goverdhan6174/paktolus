import { Card, GameSlotStatus } from 'src/models/game_slot';
import { getRndInteger } from './random';

const CardIcon = {
  0: 'club',
  1: 'diamond',
  2: 'heart',
  3: 'spade'
};

export const cardCombination = (
  fakeWin = false
): { status: GameSlotStatus; combination: Card[]; amount: number } => {
  // combination -> [♠♠♠]
  let isSpadeWin = Math.random() < 0.2;
  if (isSpadeWin || fakeWin) {
    return {
      status: 'win',
      combination: [CardIcon[3], CardIcon[3], CardIcon[3]] as Card[],
      amount: 5
    };
  }

  // combination -> [xyz]
  let isLose = Math.random() < 0.6;
  if (isLose) {
    let firstNumber = getRndInteger(0, 3);
    let secondNumber = getRndInteger(0, 3);
    let thirdNumber = getRndInteger(0, 3);

    while (firstNumber === secondNumber) {
      secondNumber = getRndInteger(0, 3);
    }

    while (firstNumber === thirdNumber || secondNumber === thirdNumber) {
      thirdNumber = getRndInteger(0, 3);
    }

    return {
      status: 'lose',
      combination: [
        CardIcon[firstNumber],
        CardIcon[secondNumber],
        CardIcon[thirdNumber]
      ],
      amount: 2
    };
  }

  // combination -> [xxx]
  let isWin = Math.random() < 0.4;
  if (isWin) {
    let winNumber = getRndInteger(0, 3);
    return {
      status: 'neutral',
      combination: [
        CardIcon[winNumber],
        CardIcon[winNumber],
        CardIcon[winNumber]
      ],
      amount: 2
    };
  }

  // combination -> [xxy] [xyx] [yxx]
  let firstNumber = getRndInteger(0, 3);
  let secondNumber = getRndInteger(0, 3);
  let thirdNumber = getRndInteger(0, 2);

  while (firstNumber === secondNumber) {
    secondNumber = getRndInteger(0, 3);
  }

  let neutralCombination = new Array(3).fill(CardIcon[firstNumber]);
  neutralCombination[thirdNumber] = CardIcon[secondNumber];
  return { status: 'neutral', combination: neutralCombination, amount: 0.5 };
};
