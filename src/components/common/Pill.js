import styled from 'styled-components';

export const Pill = styled.span`
  border: 1px solid ${(props) => props.theme.headerBgLightest};
  color: ${(props) => props.theme.baseAppColor};
  padding: 5px;
  border-radius: 3px;
  position: relative;
  text-overflow: clip;
  overflow: hidden;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'not-allowed')};
  text-align: left;
  line-height: 15px;

  &:hover {
    ${(props) => props.clickable && `border: 1px solid ${props.theme.baseAppColor};`};
  }

  &:after {
    content: '';
    width: 30px;
    height: 20px;
    position: absolute;
    top: 3px;
    right: 0;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0%, rgba(255, 255, 255, 0)),
      color-stop(56%, rgba(255, 255, 255, 1)),
      color-stop(100%, rgba(255, 255, 255, 1))
    );
    background: -webkit-linear-gradient(
      left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 56%,
      rgba(255, 255, 255, 1) 100%
    );
  }
`;

Pill.defaultProps = {
  clickable: true
};
