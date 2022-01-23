import {
  FC,
  createContext,
  useMemo,
  useCallback,
  useReducer,
  useContext
} from 'react';
import { Card, GameSlotStatus, GameSlot } from 'src/models/game_slot';
import genGameRecords from 'src/utils/gameRecordSeed';
import { randomString, getRndInteger } from 'src/utils/random';

export type Auth = {
  isAuthenticated: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export type User = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImg: string;
  balance: number;
};

export interface State {
  auth: {
    isAuthenticated: boolean;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  };
  user: User;
  game: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    record: GameSlot[];
  };
}

let initialAuth: Auth = {
  isAuthenticated: false,
  isError: false,
  isLoading: false,
  isSuccess: true
};

let initialUser: User = {
  id: '',
  name: '',
  description: '',
  avatar: '',
  coverImg: '',
  balance: 0
};

const localUser = localStorage.getItem('paktous_user');

if (localUser) {
  initialAuth = {
    isAuthenticated: true,
    isError: false,
    isLoading: false,
    isSuccess: true
  };
  initialUser = JSON.parse(localUser) as User;
}

let localRecords = localStorage.getItem('paktous_record');
let initialRecords: GameSlot[];
if (!localRecords) {
  initialRecords = genGameRecords();
  localStorage.setItem('paktous_record', JSON.stringify(initialRecords));
} else {
  initialRecords = JSON.parse(localRecords);
}

const initialState: State = {
  auth: initialAuth,
  user: initialUser,
  game: {
    isLoading: false,
    isError: false,
    isSuccess: true,
    record: initialRecords
  }
};

type Action =
  | { type: 'SIGN_OUT' }
  | {
      type: 'ADD_USER';
      name: string;
    }
  | {
      type: 'SET_NEW_GAME_RECORD';
      payload: GameSlot;
    };

function dataReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_USER': {
      let user: User = {
        id: randomString(),
        name: action.name,
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officiis nam atque?',
        avatar: `/static/images/avatars/${getRndInteger(1, 5)}.jpg`,
        coverImg: `/static/images/placeholders/covers/${getRndInteger(
          1,
          3
        )}.jpg`,
        balance: 9.99
      };

      localStorage.setItem('paktous_user', JSON.stringify(user));
      localStorage.setItem('paktous_record', JSON.stringify(state.game.record));

      return {
        ...state,
        auth: {
          isAuthenticated: true,
          isError: false,
          isLoading: false,
          isSuccess: true
        },
        user
      };
    }
    case 'SIGN_OUT': {
      localStorage.removeItem('paktous_user');
      localStorage.setItem('paktous_record', JSON.stringify(state.game.record));

      return {
        ...state,
        auth: {
          isAuthenticated: false,
          isError: false,
          isLoading: false,
          isSuccess: true
        },
        user: {
          id: '',
          name: '',
          description: '',
          avatar: '',
          coverImg: '',
          balance: 0
        }
      };
    }
    case 'SET_NEW_GAME_RECORD': {
      let { gameDate, status, gameID, combination, amount } = action.payload;

      let newBalance = amount;
      let username = 'Guest';

      if (state.auth.isAuthenticated) {
        if (status === 'lose') {
          newBalance = state.user.balance - amount;
        } else {
          newBalance = state.user.balance + amount;
        }
        username = state.user.name;
      }

      let newRecords = [
        {
          id: state.game.record.length + 1,
          username,
          gameDate,
          status,
          gameID,
          combination,
          amount
        },
        ...state.game.record
      ];

      let user = { ...state.user, balance: newBalance };
      localStorage.setItem('paktous_user', JSON.stringify(user));
      localStorage.setItem('paktous_record', JSON.stringify(newRecords));
      return {
        ...state,
        user,
        game: {
          ...state.game,
          record: newRecords
        }
      };
    }
    default:
      return state;
  }
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DataContext = createContext<DataContextInterface>(
  {} as DataContextInterface
);

export const DataProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const addUser = useCallback(
    (name) => dispatch({ type: 'ADD_USER', name }),
    [dispatch]
  );

  const addRecord = useCallback(
    ({
      combination,
      gameID,
      status,
      amount
    }: {
      combination: Card[];
      gameID: string;
      status: GameSlotStatus;
      amount: number;
    }) =>
      dispatch({
        type: 'SET_NEW_GAME_RECORD',
        payload: {
          id: 1,
          username: 'Guest',
          gameDate: new Date().getTime(),
          status,
          gameID,
          combination,
          amount
        }
      }),
    [dispatch]
  );

  const signOut = useCallback(() => dispatch({ type: 'SIGN_OUT' }), [dispatch]);

  const value = useMemo<DataContextInterface>(
    () => ({
      ...state,
      addUser,
      addRecord,
      signOut
    }),
    [state]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export type DataContextInterface = State & {
  addUser: (name: string) => void;
  addRecord: (obj: {
    combination: Card[];
    gameID: string;
    status: GameSlotStatus;
    amount: number;
  }) => void;
  signOut: () => void;
};
export const useDataContext = () => useContext(DataContext);
