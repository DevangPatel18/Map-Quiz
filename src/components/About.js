import React from 'react';
import AboutStyles from './styles/AboutStyles';
import aboutLinks from '../assets/aboutLinks';

const About = () => {
  return (
    <AboutStyles>
      <div className="about-section">
        <h1>About</h1>
        <p>
          Map Quiz is a site for learning and testing geography, including
          country and subdivision names, capitals, and flags.
        </p>
      </div>
      <div className="about-section">
        <h1>References</h1>
        <p>Sources of data obtained for app.</p>
        {Object.keys(aboutLinks).map((sectionName, idx) => (
          <div className="reference-section" key={idx}>
            <h3>{sectionName}</h3>
            <ul>
              {aboutLinks[sectionName].map((link, jdx) => (
                <li key={jdx}>
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AboutStyles>
  );
};

export default About;
