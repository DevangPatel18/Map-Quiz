import styled from 'styled-components';

const ChoroplethSliderStyles = styled.div`
  position: absolute;
  bottom: 3rem;
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

export const SliderTickStyles = styled.span`
  position: absolute;
  top: 5px;
  left: ${props => props.left};
  transform: translateX(-50%);
  color: white;
  font-weight: bolder;
  text-shadow: 0 0 5px black;
`;

export const SliderYearStyles = styled.span`
  position: absolute;
  right: 0;
  transform: translate3d(120%, -24px, 0);
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: bolder;  
`

export default ChoroplethSliderStyles;
