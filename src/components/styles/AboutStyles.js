import styled from 'styled-components';

const AboutStyles = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

  a {
    color: white;
    font-weight: bolder;

    :hover {
      color: white;
      text-decoration: underline;
    }
  }

  .about-section {
    margin-bottom: 4rem;
    padding: 0 1rem;
  }
`;

export default AboutStyles;
