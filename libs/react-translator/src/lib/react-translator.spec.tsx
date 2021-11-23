import { render } from '@testing-library/react';

import ReactTranslator from './react-translator';

describe('ReactTranslator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactTranslator />);
    expect(baseElement).toBeTruthy();
  });
});
