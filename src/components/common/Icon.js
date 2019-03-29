import styled, { keyframes, css } from 'styled-components';
import { iconsMap } from 'constants/iconsMap';
import { getSetting } from 'utils/settings';

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const spinAnimationProps = css`
  ${spin} 2s linear 0s infinite;
`;

const Icon = styled.span`
  background-color: ${(props) => props.color || props.theme.lightText};
  display: inline-block;
  vertical-align: middle;
  width: ${(props) => props.size || 22}px;
  height: ${(props) => props.size || 22}px;
  mask-image: url('src/icons/${getSetting('settings-icons', 'ionic')}/${(props) =>
  iconsMap[props.type || 'warning']}');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  ${(props) => (props.rotate ? `transform: rotate(${props.rotate});` : '')}
  ${(props) => (props.clickable ? 'cursor: pointer;' : '')}
  
  ${(props) =>
    props.spin
      ? css`
          :hover {
            animation: ${spinAnimationProps};
          }
        `
      : ''}
`;

export default Icon;
