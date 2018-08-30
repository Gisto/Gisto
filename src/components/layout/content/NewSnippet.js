import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  set, findIndex, map, filter, isEmpty
} from 'lodash/fp';
import uuid from 'uuid';
import { withRouter } from 'react-router-dom';

import * as snippetActions from 'actions/snippets';
import { DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';
import { prepareFiles } from 'utils/snippets';

import Input from 'components/common/controls/Input';
import Editor from 'components/common/controls/Editor';
import Icon from 'components/common/Icon';
import { baseAppColor } from 'constants/colors';
import ExternalLink from 'components/common/ExternalLink';
import Button from 'components/common/controls/Button';
import Checkbox from 'components/common/controls/Checkbox';

const StyledInput = styled(Input)`
  margin: 0;
  text-indent: 10px;
  width: 100%;
`;

const StyledCheckbox = styled(Checkbox)`
  margin: 0 10px 0 0;
`;

const Section = styled.div`
  margin: 20px 0;
`;

const FileSection = styled(Section)`
  border: 1px solid ${baseAppColor};
  padding: 20px;
  border-radius: 3px;
`;

const StyledButton = styled(Button)`
  margin: 0 10px 0 0;
`;

const H1 = styled.h1`
  font-weight: 300;
  font-size: 22px;
`;

const Dropzone = styled.div`
  border: 1px dashed ${baseAppColor};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

export class NewSnippet extends React.Component {
  state = {
    public: false,
    description: '',
    files: [],
    dragOver: false,
    progress: {}
  };

  setDescription = (description) => {
    this.setState({ description });
  };


  setFileData = (value, id, type) => {
    const { files } = this.state;
    const indexofFile = findIndex({ uuid: id }, files);
    const newFiles = set([indexofFile, type], value, files);

    this.setState({ files: newFiles });
  };

  togglePublic = () => {
    this.setState((prevState) => ({
      public: !prevState.public
    }));
  };

  addFile = (name = '', content = '') => {
    const fileStructure = {
      uuid: uuid.v4(),
      name,
      content
    };

    this.setState((prevState) => ({
      files: [...prevState.files, fileStructure]
    }));
  };

  deleteFile = (id) => {
    const { files } = this.state;
    const updatedfiles = filter((file) => file.uuid !== id, files);

    this.setState({ files: updatedfiles });
  };

  save = () => {
    this.props.createSnippet({
      description: this.state.description,
      isPublic: this.state.public,
      files: prepareFiles(this.state.files),
      history: this.props.history
    });
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
          this.addFile(file.name, reader.result);
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
    return (
      <div>

        <Dropzone onDrop={ this.handleOnDrop }
                  onDragOver={ this.handleDragOver }
                  onDragEnter={ this.handleDragOver }
                  onDragLeave={ this.handleDragLeave }>
          { this.state.dragOver ? 'Drop now' : 'Drag file(s) over here to add' }

          { this.state.progress.max && (
            <p>
              <progress max={ this.state.progress.max } value={ this.state.progress.value }/>
            </p>
          ) }
        </Dropzone>

        <H1><strong>New { this.state.public ? 'public' : 'private' } snippet:</strong> { this.state.description }</H1>

        <Section>
          <StyledInput type="text"
                       onChange={ (event) => this.setDescription(event.target.value) }
                       placeholder={ `Description (default ${DEFAULT_SNIPPET_DESCRIPTION})` }/>
        </Section>

        <Section>
          <StyledCheckbox checked={ this.state.public }
                          onChange={ () => this.togglePublic() }/>
          &nbsp;
          <span>
          Public snippet
            &nbsp;
            <ExternalLink href="https://help.github.com/articles/about-gists/#types-of-gists">
              <Icon type="info" size="16" color={ baseAppColor }/>
            </ExternalLink>
          </span>
        </Section>

        { map((file) => (
          <FileSection key={ file.uuid }>
            <StyledInput type="text"
                         value={ file.name }
                         onChange={ (event) => this.setFileData(event.target.value, file.uuid, 'name') }
                         placeholder="file.ext"/>
            <br/>
            <br/>

            <Editor file={ file }
                    isNew
                    id={ file.uuid }
                    onChange={ (value) => this.setFileData(value, file.uuid, 'content') }/>

            <br/>

            <StyledButton icon="delete"
                          invert
                          onClick={ () => this.deleteFile(file.uuid) }>
              <strong>Remove</strong> { file.name }
            </StyledButton>
          </FileSection>
        ), this.state.files) }

        <Section>
          <StyledButton icon="success"
                        onClick={ () => this.save() }
          disabled={ isEmpty(this.state.files) }>
            Save
          </StyledButton>

          <StyledButton invert
                        icon="add"
                        onClick={ () => this.addFile() }>
            Add file
          </StyledButton>
        </Section>
      </div>
    );
  }
}

NewSnippet.propTypes = {
  createSnippet: PropType.func,
  history: PropType.object
};

export default connect(null, {
  createSnippet: snippetActions.createSnippet
})(withRouter(NewSnippet));
