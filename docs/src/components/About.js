import React from 'react';
import { Link } from 'gatsby';
import Logo from './Logo';

const About = () => (
  <div className="w-container">
    <div className="w-row">

      <div className="w-col w-col-4 w-clearfix">
        <h3><b>why</b></h3>

        <p>
          <Logo/> started by fulfilling a lack of a syntax highlighted and cloud
          synchronized code
          snippet solution.
        </p>
      </div>

      <div className="w-col w-col-4 w-clearfix the-who">
        <h3><b>who</b></h3>

        <p>
          <Logo/> is developed by a team of two web developers on their spare
          time.
        </p>

        <p>
          We appreciate any suggestions or contributions to make <Logo/> better.
        </p>

      </div>

      <div className="w-col w-col-4 w-clearfix">
        <h3><b>how</b></h3>

        <p>
          <Logo/> is built using the open web technologies using several open
          source projects such as
          React, Electron, Monaco Editor and many more
        </p>
      </div>

    </div>
  </div>
);

export default About;
