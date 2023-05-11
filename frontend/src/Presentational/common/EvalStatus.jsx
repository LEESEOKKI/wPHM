import React from 'react';
import styled from 'styled-components';

const EvalStatus = ( { evalValue } ) => {
    let color;
    let background;

    switch (evalValue) {
        case 'unacceptable':
          color = 'white';
          background = 'red';
          break;
        case 'unsatisfactory':
          color = 'white';
          background = 'yellow';
          break;
        case 'satisfactory':
          color = 'white';
          background = 'blue';
          break;
        case 'Good':
          color = 'white';
          background = 'green';
          break;
        default:
          break;
      }

    const StyledStatus = styled.span`
        color: ${color};
        background: ${background};
        text-align: center;
        display: inline-block;
        width: 100px;
        border-radius: 20px;
    `;
  
    return <StyledStatus>{evalValue}</StyledStatus>;
};

export default EvalStatus;
