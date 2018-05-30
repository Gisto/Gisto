import styled from 'styled-components';
import { baseAppColor } from 'constants/colors';
import { iconsMap } from 'constants/iconsMap';


const Icon = styled.span`
  background-color: ${(props) => props.color || baseAppColor};
  display: inline-block;
  vertical-align: middle;
  width: ${(props) => props.size || 22}px;
  height: ${(props) => props.size || 22}px;
  -webkit-mask-image: url('../src/icons/${(props) => iconsMap[props.type || 'warning']}');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  ${(props) => props.rotate ? `transform: rotate(${props.rotate});` : ''}
`;

export default Icon;
