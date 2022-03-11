import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import ShareModal from '../src/views/ShareModal';

it('renders the share modal correctly', () => {
  let root: ReactTestRenderer = create(<div />);

  act(() => {
    root = create(<ShareModal showModal={false} closeModal={jest.fn} />);
  });

  expect(root.toJSON()).toMatchSnapshot();
});
