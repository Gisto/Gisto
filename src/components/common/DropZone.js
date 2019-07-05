import React from 'react';
import PropType from 'prop-types';
import styled from 'styled-components';

const Zone = styled.div`
  border: 1px dashed ${(props) => props.theme.baseAppColor};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

export class DropZone extends React.Component {
  state = {
    dragOver: false,
    progress: {}
  };

  handleOnDrop = (event) => {
    event.preventDefault();

    this.setState({ dragOver: false });

    // eslint-disable-next-line no-restricted-syntax
    for (const index in event.dataTransfer.items) {
      if (event.dataTransfer.items[index].kind === 'file') {
        const file = event.dataTransfer.items[index].getAsFile();
        const reader = new FileReader();

        reader.readAsText(file);
        // eslint-disable-next-line no-shadow
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            this.setState({
              progress: {
                max: event.total,
                value: event.loaded
              }
            });
          }
        };

        reader.onload = () => {
          this.props.onAddFile(file.name, reader.result);
          this.setState({
            progress: {}
          });
        };
      }
    }
  };

  handleDragOver = (event) => {
    event.preventDefault();
    this.setState({ dragOver: true });

    return false;
  };

  handleDragLeave = (event) => {
    event.preventDefault();
    this.setState({ dragOver: false });

    return false;
  };

  render() {
    const { dragOver, progress } = this.state;

    return (
      <Zone
        className={ this.props.className }
        onDrop={ this.handleOnDrop }
        onDragOver={ this.handleDragOver }
        onDragEnter={ this.handleDragOver }
        onDragLeave={ this.handleDragLeave }>
        {dragOver ? 'Drop now' : 'Drag file(s) over here to add'}

        {progress.max && (
          <p>
            <progress max={ progress.max } value={ progress.value }/>
          </p>
        )}
      </Zone>
    );
  }
}

DropZone.propTypes = {
  onAddFile: PropType.func.isRequired,
  className: PropType.string
};

export default DropZone;
