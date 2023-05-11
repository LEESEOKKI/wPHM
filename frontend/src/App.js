import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import VirtualMetrology from "./Presentational/Pages/VirtualMetrology";
import Mainpage from "./Presentational/Pages/MainPage";
import SideBar from "./Presentational/common/SideBar";
import styled from "styled-components";
import Login from "./Presentational/Pages/Login";
import SignUp from "./Presentational/Pages/SignUp";
import { useSelector } from "react-redux";
import FindID from "./Presentational/Pages/FindID";
import FindPassword from "./Presentational/Pages/FindPassword";
import Admin from "./Presentational/Pages/Admin";
import Changepw from './Presentational/Pages/Changepw';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { authActions } from './redux/reducer/authReducer';
import Graphtest from './Presentational/Pages/Graphtest';

function App() {

  const dispatch = useDispatch();
  
  const isLoggedIn = useSelector((state) => state.auth.isLogined);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const data_ = jwtDecode(token);
      dispatch(authActions.logIn({data:data_}))
      
    }
  },[dispatch])
  return (
    <Back>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Mainpage /> : <Login />}/>
        <Route path="/FindPassword" element={<FindPassword />} />
        <Route path="/FindID" element={<FindID />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Mainpage />} />
        <Route path="/vm" element={<VirtualMetrology />} />
       
        <Route path="/Admin" element={<Admin />} />
        <Route path="/changepw" element={ <Changepw/>} />
        <Route path="/Graphtest" element={<Graphtest/>} />
      </Routes>
      {isLoggedIn && <SideBar />}
    </Back>
  );
}

export default App;

const Back = styled.div`
  background-color: #eff1f5;
  position: relative;
`;
