import React,{useState,useEffect} from 'react'
import styled from "styled-components";


const Conbox = ({ mstate ,width,fontsize}) => {
  let [color,setcolor] = useState("");

  useEffect(() => {
    if (mstate === "unacceptable") {
      setcolor("#FF5172") 
    }
    else if (mstate === "unsatisfactory") {
      setcolor("#FFEE32")
    }
    else if (mstate === "satisfactory") {
      setcolor("#30ADF3")
    }
    else{
      setcolor("#A5FF32")
    }
    // else {
    //   setcolor("#bbbbbb")
    // }

  },[mstate])


  return (
    <Con color={color} width={width}>
      <Font fontsize={fontsize}>{mstate}</Font>
    </Con>
  )
}

export default Conbox

const Con =styled.div`
  background: ${(props) =>(props.color)};
  width: ${(props) =>(props.width)}px;
  height: 50px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Font = styled.div`
  font-family: "Domine";
  font-style: normal;
  font-size: ${(props) =>(props.fontsize)}px;
  color: #ffffff;
  `
