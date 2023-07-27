import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TestIDs = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);

    if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
      setNameError('한글, 영어만 사용 가능합니다.');
    } else {
      setNameError('');
    }
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    setPhoneNumber(value);

    if (!/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/.test(value)) {
      setPhoneNumberError('알맞은 전화번호 형태를 입력해주세요 EX) 010-9994-2223');
    } else {
      setPhoneNumberError('');
    }
  };

  const canSubmit = nameError === '' && phoneNumberError === '';

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/api/TestIDs/test', {
        name: name,
        phoneNumber: phoneNumber,
      });

      // console.log(res);
      alert(`당신의 아이디는 ${res.data}입니다.`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="middle">
      <div className="logo">WPHM</div>

      <div className="login_back">
        <Form onSubmit={onSubmit}>
          <div className="login">
            <h1>아이디 찾기</h1>
          </div>
          <Form.Group>
            <Form.Label htmlFor="name"> 이름</Form.Label>
            <Form.Control
              autoFocus={true}
              htmlSize={50}
              id="name"
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={handleNameChange}
              aria-invalid={nameError !== ''}
            />
            {nameError && <small role="alert">{nameError}</small>}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="phonenumber" className="mt-3">
              전화번호
            </Form.Label>

            <Form.Control
              id="phonenumber"
              type="text"
              placeholder="Enter your Phone-Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              aria-invalid={phoneNumberError !== ""}
            />
            {phoneNumberError && <small role="alert">{phoneNumberError}</small>}
          </Form.Group>
          <div className=" d-grid gap-2 mt-4">
            <Button size="lg" type="submit" disabled={!canSubmit} className="button">
              다음
            </Button>
            <Link to="/" className="btn">
              취소
            </Link>
          </div>
        </Form>
      </div>
    </div>
)}
export default TestIDs;