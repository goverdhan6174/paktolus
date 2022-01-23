let allChars =
  '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let alphaNumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const randomString = (length = 12, allCharacter = false): string => {
  let chars = alphaNumeric;
  if (allCharacter) chars = allChars;

  let password = '';
  for (let i = 0; i <= length; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
};


let firstNameArray = [
  'Harry',
  'Ross',
  'Bruce',
  'Cook',
  'Carolyn',
  'Morgan',
  'Albert',
  'Walker',
  'Randy',
  'Reed',
  'Larry',
  'Barnes',
  'Lois',
  'Wilson',
  'Jesse',
  'Campbell',
  'Ernest',
  'Rogers',
  'Theresa',
  'Patterson',
  'Henry',
  'Simmons',
  'Michelle',
  'Perry',
  'Frank',
  'Butler',
  'Shirley'
];

let middleNameArray = [
  'Brooks',
  'Rachel',
  'Edwards',
  'Christopher',
  'Perez',
  'Thomas',
  'Baker',
  'Sara',
  'Moore',
  'Chris',
  'Bailey',
  'Roger',
  'Johnson',
  'Marilyn',
  'Thompson',
  'Anthony',
  'Evans',
  'Julie',
  'Hall',
  'Paula',
  'Phillips',
  'Annie',
  'Hernandez',
  'Dorothy',
  'Murphy',
  'Alice',
  'Howard'
];

let lastNameArray = [
  'Ruth',
  'Jackson',
  'Debra',
  'Allen',
  'Gerald',
  'Harris',
  'Raymond',
  'Carter',
  'Jacqueline',
  'Torres',
  'Joseph',
  'Nelson',
  'Carlos',
  'Sanchez',
  'Ralph',
  'Clark',
  'Jean',
  'Alexander',
  'Stephen',
  'Roberts',
  'Eric',
  'Long',
  'Amanda',
  'Scott',
  'Teresa',
  'Diaz',
  'Wanda',
  'Thomas'
];

export const randomName = (): string => {
  return (
    firstNameArray[Math.floor(Math.random() * firstNameArray.length)] +
    ' ' +
    middleNameArray[Math.floor(Math.random() * middleNameArray.length)] +
    ' ' +
    lastNameArray[Math.floor(Math.random() * lastNameArray.length)]
  );
};

export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
