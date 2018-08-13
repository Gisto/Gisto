import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  set, findIndex, map, filter 
} from 'lodash/fp';
import uuid from 'uuid';

import * as snippetActions from 'actions/snippets';
import { DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';
import { prepareFiles } from 'utils/snippets';

import Input from 'components/common/Input';
import Editor from 'components/common/Editor';
import Icon from 'components/common/Icon';
import { baseAppColor } from 'constants/colors';
import ExternalLink from 'components/common/ExternalLink';
import Button from 'components/common/Button';

const StyledInput = styled(Input)`
  margin: 0;
  text-indent: 10px;
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

export class NewSnippet extends React.Component {
  state = {
    public: false,
    description: '',
    files: []
  };

  componentDidMount() {
    this.addFile();
  }


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

  addFile = () => {
    const fileStructure = {
      uuid: uuid.v4(),
      name: '',
      content: ''
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
      files: prepareFiles(this.state.files)
    });
  };

  render() {
    return (
      <div>
        <H1><strong>New { this.state.public ? 'public' : 'private' } snippet:</strong> { this.state.description }</H1>

        <Section>
          <StyledInput type="text"
                       onChange={ (event) => this.setDescription(event.target.value) }
                       placeholder={ `Description (default ${DEFAULT_SNIPPET_DESCRIPTION})` }/>
        </Section>

        <Section>
          <input type="checkbox"
                 checked={ this.state.public }
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
                         onChange={ (event) => this.setFileData(event.target.value, file.uuid, 'name') }
                         placeholder="file.ext"/>
            <br/>
            <br/>

            <Editor file={ file }
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
                        onClick={ () => this.save() }>
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
  createSnippet: PropType.func
};

export default connect(null, {
  createSnippet: snippetActions.createSnippet
})(NewSnippet);
