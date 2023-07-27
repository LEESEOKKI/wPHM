import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import EvalStatus from "./EvalStatus";

function CreateTable({ setTest, data, test, child }) {
  const [selected, setSelected] = useState(test);
  const [selectedComponentData, setSelectedComponentData] = useState();
  
  const idxHandler = (idx) => {
    setSelected(idx);
    setTest(idx);
  };
  
  const idxClickHandler = () => {
    setSelectedComponentData(child[selected]);
  };
  
  const dataTable = data?.map((elem, idx) => {
    if (elem.value < 0.3) {
      elem.eval = "UNACCEPTABLE";
    } else if (elem.value < 0.5) {
      elem.eval = "UNSATISFACTORY";
    } else if (elem.value < 0.8) {
      elem.eval = "SATISFACTORY";
    } else {
      elem.eval = "GOOD";
    }
    
    return (
      <tr
      className={`tableBody ${idx === selected ? "selected" : ""}`}
      key={idx}
      onClick={() => idxHandler(idx)}
      >
        <td style={{ width: "30px" }}>
          <input
            type="radio"
            checked={idx === selected}
            onChange={() => {}}
            onClick={idxClickHandler}
            />
        </td>
        <StyledTd>{elem.name}</StyledTd>
        <StyledTd style={{ position: "relative", left: "20px" }}>
          <EvalStatus evalValue={elem.eval} />
        </StyledTd>
        <StyledTd>{parseFloat(elem.value).toFixed(2)}</StyledTd>
      </tr>
    );
  });

  return (
    <Styles>
      <table className="table">
        <thead>
          <tr className="tableHeader">
            <td style={{ width: "30px" }}></td>
            <td>Component</td>
            <td style={{ paddingLeft: "50px" }}>Status</td>
            <td>AssetScore</td>
          </tr>
        </thead>
          <tbody style={{verticalAlign: 'middle', maxHeight:"384px"}}>{dataTable}</tbody>

      </table>
    </Styles>
  );
}

export default CreateTable;


const StyledTd = styled.td`
  font-family: "Noto Sans KR", sans-serif;
  font-style: normal;
  font-size: 12px;
  color: #707070;
`;
const Styles = styled.div`
  table {
    border-spacing: 0;
    width: 100%;
    height: 100%
    border: none;

    td {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      font-family: "Segoe UI";
      color: #707070;
      border: none;
    }

    .tableHeader {
      font-weight: 700;
      font-family: "Segoe UI";
      color: #707070;
      font-size: 14px;
    }

    .tableBody {
      cursor: pointer;

      &:hover {
        background-color: #ddd;
      }

      input[type="radio"]:checked {
        background-color: #2196f3;
        color: white;
      }
    }
  }
`;