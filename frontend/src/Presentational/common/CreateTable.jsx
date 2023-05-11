import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EvalStatus from './EvalStatus';

function CreateTable({ setTest, data, test, child }) {
  const [selected, setSelected] = useState(test);
  const [selectedComponentData, setSelectedComponentData] = useState();

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const idxHandler = (idx) => {
    setSelected(idx);
    setTest(idx);
  }

  const idxClickHandler = () => {
    setSelectedComponentData(child[selected]);
  }

  const dataTable = data?.map((elem, idx) => {
    if (elem.value < 0){
      elem.eval = "unacceptable";
    }
    else if (elem.value < 0.03){
      elem.eval = "unsatisfactory";
    }
    else if (elem.value < 0.3){
      elem.eval = "satisfactory";
    }
    else {
      elem.eval = "Good";
    }
    
    return (
      <tr className='tableBody' key={idx}>
        <td style={{ width: '30px' }}><input type="radio" checked={idx === selected} onChange={() => idxHandler(idx)} onClick={idxClickHandler}/></td>
        <td>{elem.name}</td>
        <td>
          <EvalStatus evalValue={elem.eval}/>
        </td>
        <td>{elem.value}</td>
      </tr>
    );
  });
  
  // Render the UI for your table
  return (
    <Styles>
      <table className="table">
        <thead>
          <tr className='tableHeader'>
            <td style={{ width: '30px' }}></td>
            <td>Component</td>
            <td>Status</td>
            <td>AssetScore</td>
          </tr>
        </thead>
        <tbody>
          {dataTable}
        </tbody>
      </table>
    </Styles>
  );
}

export default CreateTable;

const Styles = styled.div`
  table {
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;

    td {
      text-align: center;
      font-size: 12px;
      font-family: 'Inter';
      font-style: normal;
      color: #707070;
    }

    .tableHeader {
      font-weight: bold;
      background-color: #ffffff;
    }

    .tableBody {
      cursor: pointer;

      &:hover {
        background-color: #ddd;
      }

      input[type='radio']:checked {
        background-color: #2196f3;
        color: white;
      }
    }
  }
`;