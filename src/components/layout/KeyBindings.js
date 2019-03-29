import React from 'react';
import styled from 'styled-components';

const Keys = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 9;
  background: rgba(255, 255, 255, 0.97);
  display: flex;
  justify-content: center;
  align-items: center;

  kbd {
    -moz-border-radius: 3px;
    -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
    -webkit-border-radius: 3px;
    -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
    color: #333;
    display: inline-block;
    font-family: monaco, monospace, sans-serif;
    font-size: 11px;
    line-height: 14px;
    text-transform: uppercase;
    margin: 0 0.1em;
    padding: 0.1em 0.6em;
    text-shadow: 0 1px 0 #fff;
    vertical-align: text-top;
  }
`;

const KeyBindings = () => (
  <Keys>
    <div>
      <h3>Available keys</h3>
      <p>
        <kbd>Comand/Ctrl</kbd>+<kbd>f</kbd> - Super search
      </p>
      <p>
        <kbd>?</kbd> - This key binding doc
      </p>
    </div>
  </Keys>
);

export default KeyBindings;
