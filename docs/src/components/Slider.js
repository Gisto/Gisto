import React from 'react';

import colortTemesImage from '../images/colours2.png';

const images = [
  'https://imgur.com/Jx8Tc9s.png',
  'https://imgur.com/OwseykV.png',
  'https://imgur.com/yiEJRNt.png',
  'https://imgur.com/JtUCsfI.png',
  'https://imgur.com/1yliYhR.png',
  'https://imgur.com/aoW5V8E.png',
  'https://imgur.com/Aac48m9.png',
  'https://imgur.com/LW6SFg2.png',
  'https://imgur.com/bXySAUt.png',
  colortTemesImage
];

class Slider extends React.Component {
  state = {
    current: images[0]
  };

  setImage = (current) => this.setState({ current });

  render() {
    return (
      <React.Fragment>
        <div id="app-image" className="shadow">
          <img alt="Gisto"
               className="opaque"
               width="460"
               height="288"
               src={ this.state.current }/>
        </div>
        <p id="app-image-controls">
          { images.map((name, index) => (
            <React.Fragment key={ name }>
              <span className={ this.state.current === images[index] ? 'selected' : '' }
                    onClick={ () => this.setImage(images[index]) }/>
              &nbsp;
            </React.Fragment>
          )) }
        </p>
      </React.Fragment>
    );
  }
}

export default Slider;
