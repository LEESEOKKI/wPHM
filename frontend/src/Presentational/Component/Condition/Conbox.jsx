import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";

const Conbox = ({ mstate, width, fontsize }) => {
  let [scolor, setscolor] = useState("");
  let [color, setcolor] = useState("");
  let [icon, seticon] = useState("");

  useEffect(() => {
    if (mstate === "unacceptable") {
      setscolor("#f0051e");
      setcolor("#FF3E53");
      seticon("icon-park-solid:bad-two");
    } else if (mstate === "unsatisfactory") {
      setscolor("#f0de9c");
      setcolor("#f0d05b");
      seticon(
        "streamline:mail-smiley-sad-face-chat-message-smiley-emoji-sad-face-unsatisfied"
      );
    } else if (mstate === "satisfactory") {
      setscolor("#09e8e1");
      setcolor("#2bbfba");
      seticon("teenyicons:mood-smile-solid");
    } else {
      setscolor("#1FDD6C");
      setcolor("#1DA754");
      seticon("icon-park-solid:good-two");
    }
    // else {
    //   setcolor("#bbbbbb")
    // }
  }, [mstate]);

  return (
    <Con scolor={scolor}  color={color} width={width}>
      <Icon icon={icon} color="white" width={fontsize} style={{ margin: 4 }} />
      <Font fontsize={fontsize}>{mstate}</Font>
    </Con>
  );
};

export default Conbox;

const Con = styled.div`
  background: linear-gradient(90deg,${(props) => props.scolor} 0%,${(props) => props.color} 100% );
  width: ${(props) => props.width}px;
  margin: 20px 0px 0px 0px;
  height: 50px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index :1;
`;

const Font = styled.div`
  font-family: "Domine";
  font-style: normal;
  font-size: ${(props) => props.fontsize}px;
  color: #ffffff;
`;
