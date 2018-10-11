import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  set, findIndex, map, filter, isEmpty
} from 'lodash/fp';
import uuid from 'uuid';

import * as snippetActions from 'actions/snippets';
import { DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';
import { prepareFiles } from 'utils/snippets';

import Input from 'components/common/controls/Input';
import Editor from 'components/common/controls/Editor';
import Icon from 'components/common/Icon';
import { baseAppColor, bg, boxShadow } from 'constants/colors';
import ExternalLink from 'components/common/ExternalLink';
import Button from 'components/common/controls/Button';
import Checkbox from 'components/common/controls/Checkbox';
import DropZone from 'components/common/DropZone';
import { gaPage } from 'utils/ga';
import { getSetting } from 'utils/settings';
import { HashRouter as Router, Link } from 'react-router-dom';

const StyledInput = styled(Input)`
  margin: 0;
  text-indent: 10px;
  width: 100%;
  z-index: 1;
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
  
  > div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0px 0px -20px 0px;
  }
  
  &:last-of-type {
    margin-bottom: 70px;
  }
`;

const StyledButton = styled(Button)`
  margin: 0 10px 0 0;
`;

const StyledDeleteButton = styled(StyledButton)`
  line-height: 21px;
  margin: 0 0 0 20px;
  width: auto;
  white-space: nowrap;
`;

const H1 = styled.h1`
  font-weight: 300;
  font-size: 22px;
`;

const ButtonsSection = styled.section`
  position: fixed;
  bottom: 0;
  padding: 20px;
  margin: 0 0 0 -25px;
  background: ${bg};
  box-shadow: 0 -1px 2px ${boxShadow};
  display: flex;
  justify-content: space-between;
  width: calc(100vw - 25px);
`;

const StyledLink = styled(Link)`
  color: ${baseAppColor};
  text-decoration: none;
  line-height: 25px;
`;

export class NewSnippet extends React.Component {
  state = {
    public: getSetting('defaultNewIsPublic', false),
    description: '',
    files: []
  };

  componentDidMount() {
    gaPage('Add new');
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
      files: prepareFiles(this.state.files)
    });
  };

  render() {
    return (
      <div>

        <DropZone onAddFile={ this.addFile }/>

        <H1><strong>New { this.state.public ? 'public' : 'private' } snippet:</strong> { this.state.description }</H1>

        <Section>
          <StyledInput type="text"
                       onChange={ (event) => this.setDescription(event.target.value) }
                       placeholder={ `Description (default ${DEFAULT_SNIPPET_DESCRIPTION})` }/>
        </Section>

        <Section>
          <StyledCheckbox checked={ this.state.public }
                          value={ getSetting('defaultNewIsPublic', false) }
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
            <div>
              <StyledInput type="text"
                           value={ file.name }
                           onChange={ (event) => this.setFileData(event.target.value, file.uuid, 'name') }
                           placeholder="file.ext"/>
              <StyledDeleteButton icon="delete"
                                  invert
                                  onClick={ () => this.deleteFile(file.uuid) }>
                <strong>Remove</strong> { file.name }
              </StyledDeleteButton>
            </div>
            <br/>
            <br/>

            <Editor file={ file }
                    isNew
                    id={ file.uuid }
                    onChange={ (value) => this.setFileData(value, file.uuid, 'content') }/>

          </FileSection>
        ), this.state.files) }

        <ButtonsSection>

          <Router>
            <StyledButton icon="arrow-left" invert>
              <StyledLink to="/">Back to list</StyledLink>
            </StyledButton>
          </Router>

          <StyledButton invert
                        icon="add"
                        onClick={ () => this.addFile() }>
            Add file
          </StyledButton>

          <StyledButton icon="success"
                        onClick={ () => this.save() }
                        disabled={ isEmpty(this.state.files) }>
            Save
          </StyledButton>

        </ButtonsSection>
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
