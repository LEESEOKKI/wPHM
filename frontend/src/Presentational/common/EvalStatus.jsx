import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";

const EvalStatus = ({ evalValue }) => {
  let color;
  let scolor;
  let background;
  let icon;
  let width;

  switch (evalValue) {
    case "UNACCEPTABLE":
      color = "white";
      scolor = "#f0051e";
      background = "#FF3E53";
      icon = "icon-park-solid:bad-two";
      width = "115px";
      break;
    case "UNSATISFACTORY":
      color = "white";
      scolor ="#f0de9c"
      background = "#f0d05b";
      icon =
        "streamline:mail-smiley-sad-face-chat-message-smiley-emoji-sad-face-unsatisfied";
      width = "150px";
      break;
    case "SATISFACTORY":
      color = "white";
      scolor="#09e8e1"
      background = "#2bbfba";
      icon = "teenyicons:mood-smile-solid";
      width = "110px";
      break;
    case "GOOD":
      color = "white";
      scolor="#1FDD6C"
      background = "#1DA754";
      icon = "icon-park-solid:good-two";
      width = "60px";
      break;
    default:
      break;
  }

  const StyledStatus = styled.span`
    color: ${color};
    background: linear-gradient(90deg,${scolor} 0%,${background} 100% );
    text-align: center;
    display: inline-block;
    width: calc(${width} + 7px);
    border-radius: 20px;
    font-weight: bold;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  `;

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <StyledStatus>
        <Icon icon={icon} color="white" style={{ margin: 2 }} />
        {evalValue}
      </StyledStatus>
    </div>
  );
};

export default EvalStatus;