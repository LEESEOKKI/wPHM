import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/reducer/authReducer";
import { newactions } from "../../redux/reducer/Reducer";
import { useSelector } from "react-redux";

const SideBar = () => {
  const dispatch = useDispatch();
  const isMaster = useSelector((state) => state.auth.type === "Master");
  let num = useSelector((state) => state.red.num);

  const handleNavClick = (navIndex) => {
    dispatch(newactions.setNum(navIndex));
  };

  return (
    <Side>
      <NavLink to="/" onClick={() => handleNavClick(0)}>
        <img src="image/logo.png" alt="" />
      </NavLink>

      <NavLink
        to="/"
        onClick={() => handleNavClick(0)}
        className={num === 0 ? "back_type" : "nav_item"}
      >
        <Menu>
          <div>
            <Icon icon="ion:extension-puzzle" width="35" />
          </div>
          <Font style={{textAlign:"center"}}>
            Machine
            <br />
            Health
          </Font>
        </Menu>
      </NavLink>

      <NavLink
        to="/vm"
        onClick={() => handleNavClick(1)}
        className={num === 1 ? "back_type" : "nav_item"}
      >
        <Menu>
          <div>
            <Icon icon="bi:globe" width="35" />
          </div>
          <Font2> VM</Font2>
        </Menu>
      </NavLink>

      {isMaster && (
        <NavLink
          to="/Admin"
          onClick={() => handleNavClick(2)}
          className={num === 2 ? "back_type" : "nav_item"}
        >
          <Menu>
            <div>
              <Icon icon="mdi:human-male" width="35" />
            </div>
            <Font2> Admin</Font2>
          </Menu>
        </NavLink>
      )}

      <NavLink to="/">
        <Logout onClick={() => dispatch(authActions.logOut())}>
          <Icon icon="ic:sharp-logout" />
          <Font2> Logout </Font2>
        </Logout>
      </NavLink>
    </Side>
  );
};

export default memo(SideBar);

const Side = styled.div`
  display: flex;
  flex-direction: column;
  width: 95px;
  height: 100vh;
  background-color: white;
  align-items: center;
  position: relative;
`;
const Menu = styled.div`
  padding: 15px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Font = styled.div`
  margin-top: 5px;
  font-size: small;
`;

const Font2 = styled.div`
  margin-top: 5px;
  font-size: small;
`;
const Logout = styled.button`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: small;
  background: none;
  border: none;
  cursor: pointer;
`;
