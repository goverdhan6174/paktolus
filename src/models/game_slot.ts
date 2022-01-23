export type GameSlotStatus = 'win' | 'lose' | 'neutral';

export enum Card {
  club = 'club',
  diamond = 'diamond',
  heart = 'heart',
  spade = 'spade'
}

export interface GameSlot {
  id: number;
  status: GameSlotStatus;
  username: string;
  gameDate: number;
  gameID: string;
  combination: Card[];
  amount: number;
}
