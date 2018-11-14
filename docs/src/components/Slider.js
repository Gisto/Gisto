import React from 'react';

import colortTemesImage from '../images/colours2.png';

const images = [
  'https://camo.githubusercontent.com/5d6d4a596d8a290f34c3d4997314076d27c68683/68747470733a2f2f696d6775722e636f6d2f4a7838546339732e706e67',
  'https://camo.githubusercontent.com/167453afa79d0f2b3eee9b5436be08682976f5b9/68747470733a2f2f696d6775722e636f6d2f4f777365796b562e706e67',
  'https://camo.githubusercontent.com/7c6db3c04ccbc2b60b41a079016a40a3edc687b8/68747470733a2f2f696d6775722e636f6d2f7969454a524e742e706e67',
  'https://camo.githubusercontent.com/3ab6b0d1da376692ee05e5096cc0f1481c75563a/68747470733a2f2f696d6775722e636f6d2f4a7455437366492e706e67',
  'https://camo.githubusercontent.com/d878121736eb99225f5449cf3f5b8e65e324893c/68747470733a2f2f696d6775722e636f6d2f31796c695968522e706e67',
  'https://camo.githubusercontent.com/2a727b8251db908fa58552b631786e96c84a5019/68747470733a2f2f696d6775722e636f6d2f616f57355638452e706e67',
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
