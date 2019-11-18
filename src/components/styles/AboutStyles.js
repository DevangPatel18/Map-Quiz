import styled from 'styled-components';

const AboutStyles = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

  a {
    color: white;
    text-decoration: underline;

    :hover {
      color: white;
    }
  }

  .about-section {
    margin-bottom: 4rem;
    padding: 0 1rem;
  }

  .reference-section {
    ul {
      padding: 0;
      list-style-type: none;
    }
    padding-top: 1em;
  }
`;

export default AboutStyles;
