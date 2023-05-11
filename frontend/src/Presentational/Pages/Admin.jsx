import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

import { FaSearch } from "react-icons/fa";
import api from "../../redux/api";

const Admin = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionData, setPermissionData] = useState([]);
  const [defaultPermission, setDefaultPermission] = useState("Unknown");

  const collectionJSON = localStorage.getItem('collectionNames')
  const collectionNames = JSON.parse(collectionJSON)

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

  const filteredData = data.filter((item) => {
    if (item && item.name && item.type) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  }).sort((a, b) => {
    if (a.type === "UnKnown") return -1;
    if (b.type === "UnKnown") return 1;
    if (a.type > b.type) return 1;
    if (a.type < b.type) return -1;
    return 0;
  });

  //권한 변경 부분
  const handleApply = async (event, email, type) => {
    event.preventDefault();
      try {
        const res = await api.put("account/typeUpdate", {
          email: email,
          type: type,
        });
        // console.log(res.data);
        alert(res.data);
        const res2 = await api.get("account/list");
        setData(res2.data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
  };

  return (
    <div>
      <Box>
        <div className="table-container">
          <table className="table table-hover">
            <thead
              style={{
                fontSize: "40px",
                position: "sticky",
                top: "0",
                zIndex: 1,
              }}
            >
              <tr>
                <th>ID</th>
                <th>H.P</th>
                <th>Name</th>
                <th>Permission</th>
                <th>Edit Permission</th>
              </tr>
            </thead>
            <tbody style={{ position: "sticky" }}>
              {filteredData
                .filter((item) => item.type !== "Master")
                .map((item, index) => (
                  <tr key={item.email}>
                    <td style={{ color: "blue", fontSize: "23px" }}>
                      {item.email}
                    </td>
                    <td style={{ fontSize: "20px" }}>{item.phone}</td>
                    <td style={{ fontSize: "20px" }}>{item.name}</td>
                    <td style={{ fontSize: "20px" }}>{item.type}</td>
                    <td style={{ fontSize: "20px" }}>
                      <Form.Select
                        size="sm"
                        value={permissionData[index] || "-------"}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "-------") {
                            return; // 선택 안할 시 함수 실행하지 않음
                          }
                          setPermissionData((prevPermissionData) => {
                            const newPermissionData = [...prevPermissionData];
                            newPermissionData[index] = selectedValue;
                            return newPermissionData;
                          });
                        }}
                      >
                        {/*로그인 시 장비 타입목록 받아와서 map으로 드롭다운 구현*/}
                        <option value="-------">-------</option>
                        <option value="Unknown">Unknown</option>
                        {collectionNames.map((data, index)=> (
                        <option key={index}>{data}</option>
                        ))}
                      </Form.Select>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={(e) => {
                          if (permissionData[index]) {
                            handleApply(e, item.email, permissionData[index]);
                          }
                        }}
                      >
                        Apply
                      </button>
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
      </Box2>
    </div>
  );
};

export default Admin;

const Box = styled.div`
  position: absolute;
  top: 200px;
  left: 150px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 80%;
  height: 70%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const Box2 = styled.div`
  position: absolute;
  top: 10px;
  left: 150px;
  width: 40%;
  display: flex;
  align-items: center;
`;