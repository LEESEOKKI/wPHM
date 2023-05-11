import React, { useState, useMemo } from "react";
import styled from "styled-components";
import CreateTable from "../../common/CreateTable";
import HealthStatus from "./HealthStatus";

const ComponentList = ({ child, setSelectComponentData }) => {
  const [test, setTest] = useState(); //component list idx 값 저장
  // console.log(test);
  // console.log(child);
  setSelectComponentData(child[test]);

  return (
    <div>
      <Small>
        <Font>COMPONENT LIST</Font>
        <CreateTable setTest={setTest} data={child} test={test} child={child} />
      </Small>
      <HealthStatus componentData={child} />
    </div>
  );
};

export default ComponentList;

const Small = styled.div`
  position: absolute;
  top: 260px;
  left: 120px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 460px;
  height: 470px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  overflow-y: auto;
`;

const Font = styled.div`
  margin : 10px 0px 10px 20px;
  font-family: "Inter";
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: #707070;
`;
