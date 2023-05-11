import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import api from "../../redux/api";
import "react-datepicker/dist/react-datepicker.css";
import Condition from "../Component/MainPage/Condition";

const GraphParam = ({ nameList, handleParamsCall }) => {
  const [activeNames, setActiveNames] = useState(new Set());

  const toggleName = (name, color) => {
    setActiveNames((prevActiveNames) => {
      const newActiveNames = new Set([...prevActiveNames]);
      if (newActiveNames.has(name)) {
        newActiveNames.delete(name);
      } else {
        newActiveNames.add(name);
      }
      return newActiveNames;
    });
    handleParamsCall(name, color);
  };

  const isNameActive = (name) => {
    return activeNames.has(name);
  };

  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
  ];

  const [nameColors, setNameColors] = useState([]);
  const [usedColors, setUsedColors] = useState(new Set());

  const getColorForName = (name, index) => {
    const nameIndex = nameList.indexOf(name);
    return nameIndex !== -1
      ? nameColors[nameIndex]
      : colors[index % colors.length];
  };

  useEffect(() => {
    if (handleParamsCall) {
      handleParamsCall(getColorForName);
    }
  }, [handleParamsCall, getColorForName]);

  useEffect(() => {
    if (nameColors.length !== nameList.length) {
      const newNameColors = nameList.map(() => {
        let newColor;
        do {
          newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (usedColors.has(newColor));
        setUsedColors(
          (prevUsedColors) => new Set([...prevUsedColors, newColor])
        );
        return newColor;
      });
      setNameColors(newNameColors);
    }
  }, [nameList, usedColors]);

  return (
    <div>
      <ParamBox>
        {nameList &&
          nameList.map((name, index) => {
            const isActive = isNameActive(name);
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleName(name, getColorForName)}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: nameColors[index],
                    marginRight: "10px",
                    marginLeft: "15px",
                  }}
                />
                <span
                  style={{
                    color: nameColors[index],
                    textDecoration: isActive ? "none" : "line-through",
                  }}
                >
                  {" " + name}
                </span>
              </div>
            );
          })}
      </ParamBox>
    </div>
  );
};

export default GraphParam;

const ParamBox = styled.div`
  position: absolute;
  top: 90px;
  left:700px;
  background: #ffffff;
  /* border: 1px solid rgba(0, 0, 0, 0.2); */
  width: 180px;
  height: 360px;
  /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
  /* border-radius: 20px; */
  /* display: flex; */
  /* align-items: center; */
  overflow-y: auto;
`;
