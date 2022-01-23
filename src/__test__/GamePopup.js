import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameDialogContainer from 'src/content/game/Hero/index';

test('test material ui react dialog', () => {
  const { getByTestId } = render(<GameDialogContainer />);

  userEvent.click(screen.getByText('Fake Win'));

  expect(getByTestId('inside-testid')).toHaveTextContent(
    'Try Again, You lost $2'
  );
});
