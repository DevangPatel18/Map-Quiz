import styled from 'styled-components';

const DirectionPadStyles = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "b up b" "left b right" "b down b";

  .ui.icon.button {
    margin: 0;
  }
`;

export default DirectionPadStyles;
