import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {CaptureButton} from '../src/views/CaptureButton';

it('renders the capture button correctly', () => {
  let root: ReactTestRenderer = create(<div />);

  const capturePhotos = jest.fn();

  act(() => {
    root = create(
      <CaptureButton
        flash={'off'}
        setIsPressingButton={jest.fn}
        enabled={false}
        capturePhotos={capturePhotos}
      />,
    );
  });

  expect(root.toJSON()).toMatchSnapshot();
});
