import styled from 'styled-components';

const ChoroplethSliderStyles = styled.div`
  position: absolute;
  bottom: 2rem;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);

  input {
    -webkit-appearance: none;
    width: 100%;
    height: 0.5rem;
    border-radius: 0.5rem;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: orange;
      cursor: pointer;
    }
  }
`;

export default ChoroplethSliderStyles;
