import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { FaCheck, FaSearch } from "react-icons/fa";
import api from "../../redux/api";

const Admin = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionData, setPermissionData] = useState({});
  const [defaultPermission, setDefaultPermission] = useState("Unknown");

  const collectionJSON = localStorage.getItem("collectionNames");
  const collectionNames = JSON.parse(collectionJSON);

  // console.log(collectionNames);
  useEffect(() => {
    const _dbTest = async () => {
      const res = await api.get("account/list");
      setData(res.data);
      // console.log(res.data);
    };
    _dbTest();
  }, []);

  // 이름 검색 부분
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data
    .filter((item) => {
      if (item && item.name && item.type) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => {
      if (a.type === "UnKnown") return -1;
      if (b.type === "UnKnown") return 1;
      if (a.type > b.type) return 1;
      if (a.type < b.type) return -1;
      return 0;
    });

  //권한 변경 부분

  const handleApplyAll = async (event) => {
    event.preventDefault();
    try {
      for (let index = 0; index < filteredData.length; index++) {
        const item = filteredData[index];

        if (
          permissionData[item.email] &&
          permissionData[item.email] !== "-------"
        ) {
          await api.put("account/typeUpdate", {
            email: item.email,
            type: permissionData[item.email],
          });

          setPermissionData((prevPermissionData) => ({
            ...prevPermissionData,
            [item.email]: "-------",
          }));
        }
      }
      alert("권한 변경 완료");
      const res = await api.get("account/list");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Box>
        <div className="table-container">
          <table className="table table-hover">
            <thead
              style={{
                fontSize: "20px",
                position: "sticky",
                fontFamily: "Inter",
                top: "0",
                zIndex: 1,
              }}
            >
              <tr>
                <StyledTh>ID</StyledTh>
                <StyledTh>H.P</StyledTh>
                <StyledTh>Name</StyledTh>
                <StyledTh>Permission</StyledTh>
                <StyledTh>Edit Permission</StyledTh>
              </tr>
            </thead>
            <tbody
              style={{
                position: "sticky",
                display: "block",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)",
                maxHeight: "380px",
              }}
            >
              {filteredData
                .filter((item) => item.type !== "Master")
                .map((item, index) => (
                  <tr key={item.email}>
                    <td
                      style={{
                        color: "blue",
                        fontSize: "21px",
                        textAlign: "center",
                        fontFamily: "Inter",
                      }}
                    >
                      {item.email}
                    </td>
                    <td
                      style={{
                        color: "#7f7f7f",
                        fontSize: "18px",
                        textAlign: "center",
                        fontFamily: "Inter",
                      }}
                    >
                      {item.phone}
                    </td>
                    <td
                      style={{
                        color: "#7f7f7f",
                        fontSize: "18px",
                        textAlign: "center",
                        fontFamily: "Inter",
                        paddingLeft: "25px",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        color: "#7f7f7f",
                        fontSize: "18px",
                        textAlign: "center",
                        fontFamily: "Inter",
                        paddingLeft: "33px",
                      }}
                    >
                      {item.type}
                    </td>
                    <td
                      style={{
                        color: "#7f7f7f",
                        fontSize: "18px",
                        textAlign: "center",
                        fontFamily: "Inter",
                      }}
                    >
                      <StyledFormSelect
                        as="select"
                        size="sm"
                        // 이메일로 permissionData를 조회합니다.
                        value={permissionData[item.email] || "-------"}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "-------") {
                            return; // 선택되지 않은 경우 함수 실행하지 않음
                          }
                          // 이메일에 해당하는 permissionData를 업데이트합니다.
                          setPermissionData((prevPermissionData) => ({
                            ...prevPermissionData,
                            [item.email]: selectedValue,
                          }));
                        }}
                      >
                        {/*로그인 시 장비 타입목록 받아와서 map으로 드롭다운 구현*/}
                        <option value="-------">-------</option>
                        <option value="Unknown">Unknown</option>
                        {collectionNames.map((data, index) => (
                          <option key={index}>{data}</option>
                        ))}
                      </StyledFormSelect>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Box>
      <Box2>
        <Form.Group>
          <Form.Label className="admin">Administer</Form.Label>
          <FaSearch className="searchicons" style={{ fontSize: "30px" }} />
          <input
            autoFocus={true}
            type="text"
            className="search"
            placeholder=" 이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px" }}
          />
        </Form.Group>
        <Applybtn
          className="btn btn-primary"
          type="submit"
          onClick={handleApplyAll}
        >
          <FaCheck style={{ marginRight: "5px" }} />
          Apply
        </Applybtn>
      </Box2>
    </div>
  );
};

export default Admin;

const Applybtn = styled.th`
  position: fixed;
  top: 150px;
  right: 85px;
`;

const ScrollableTable = styled.div`
  max-height: 480px;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1);
`;

const StyledTh = styled.th`
  font-family: "Inter", sans-serif;
  font-size: 25px;
  text-align: center;
`;
const StyledFormSelect = styled(Form.Control)`
  font-size: 16px;
  padding: 6px 12px;
  background-color: #7f7f7f;
  color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
  width: 70%;
  margin-left: 40px;
  font-family: "Inter";
`;

const Box = styled.div`
  position: absolute;
  top: 200px;
  left: 150px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 85%;
  height: 480px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-family: "Inter";

  .table-container {
    width: 100%;

    padding: 10px;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1);
  }

  table {
    width: max-content;
    table-layout: fixed;
  }

  th,
  td {
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th:first-child,
  td:first-child {
    width: 30%;
    max-width: 200px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 20%;
    max-width: 150px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 15%;
    max-width: 250px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 20%;
    max-width: 200px;
  }

  th:last-child,
  td:last-child {
    width: 20%;
    max-width: 200px;
  }
`;

const Box2 = styled.div`
  position: absolute;
  top: 10px;
  left: 150px;
  width: 40%;
  display: flex;
  align-items: center;
  font-family: "Inter" .admin {
    margin-right: 10px;
  }

  .search {
    width: 300px;
    margin-right: 10px;
  }
`;
