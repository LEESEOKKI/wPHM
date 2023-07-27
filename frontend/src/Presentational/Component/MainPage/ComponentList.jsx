import React, { useState, useMemo } from "react";
import styled from "styled-components";
import CreateTable from "../../common/CreateTable";
import HealthStatus from "./HealthStatus";

const ComponentList = ({ child, setSelectComponentData }) => {
  const [test, setTest] = useState(0); //component list idx 값 저장
  setSelectComponentData(child[test]);

  return (
    <div>
      <Small>
        <Font>COMPONENT LIST</Font>
        <Line/>
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
  border-radius: 20px;
  overflow-y: hidden;
`;

const Font = styled.div`
  margin : 10px 0px 10px 20px;
  font-family: "Segoe UI";
  font-size: 18px;
  color: #707070;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 600;

`;
const Line = styled.div`
  position: absolute;
  width: 430px;
  height: 0px;
  left: 15px;
  top: 45px;
  border: 1px solid #B7B7B7;
`;