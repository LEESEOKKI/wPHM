import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import api from "../../redux/api";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm();

  const password = useRef();
  password.current = watch("password");

  const onSubmit = handleSubmit(({ email, name, password, phone }) => {
    api
      .post("/account/join", JSON.stringify({ email, name, password, phone}))
      .then((response) => {
        alert(response.data)
        navigate("/")
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  });

  if (!isMounted) {
    return null;
  }
  return (
    <Row className="g-0">
      <Col>
        <div className="middle">
          <div className="logo">WPHM</div>
        </div>
      </Col>
      <Col>
        <div className="signup_back">
          <Form onSubmit={onSubmit}>
            <div className="bold_header">회원가입</div>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">아이디</Form.Label>
              <Form.Control
                autoFocus={true}
                htmlSize={50}
                id="email"
                type="email"
                placeholder="balamia@wonik.co.kr"
                aria-invalid={!isDirty ? undefined : errors.email ? "true" : "false"}
                {...register("email", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /^\S+@\S+\.\S+/,
                    message: "이메일 형식에 맞지 않습니다.",
                  },
                })}
              />
              {errors.email && <Alert>{errors.email.message}</Alert>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                id="password"
                type="password"
                placeholder="********"
                aria-invalid={!isDirty ? undefined : errors.password ? "true" : "false"}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "8자리 이상 비밀번호를 사용하세요.",
                  },
                })}
              />
              {errors.password && <small role="alert">{errors.password.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                id="password_conform"
                type="password"
                className="form-control"
                placeholder="********"
                aria-invalid={!isDirty ? undefined : errors.password_conform ? "true" : "false"}
                {...register("password_conform", {
                  required: true,
                  validate: (value) => value === password.current,
                })}
              />
              {errors.password_conform && errors.password_conform.type ==="validate" && <Alert>The passwords do not match</Alert>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                id="name"
                type="text"
                className="form-control"
                placeholder="Enter name"
                aria-invalid={!isDirty ? undefined : errors.name ? "true" : "false"}
                {...register("name", {
                  required: "이름은 필수 입력입니다.",
                  pattern: {
                    value: /^[가-힣a-zA-Z0-9]+$/,
                    message: "한글, 영어만 사용 가능합니다.",
                  },
                })}
              />
              {errors.name && <Alert>{errors.name.message}</Alert>}

            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                id="phone"
                type="text"
                placeholder="010-0000-0000"
                aria-invalid={!isDirty ? undefined : errors.phone ? "true" : "false"}
                {...register("phone", {
                  required: "전화번호는 필수 입력입니다.",
                  pattern: {
                    value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                    message: "알맞은 전화번호 형태를 입력해주세요 EX) 010-9994-2223",
                  },
                  minLength: {
                    value: 13,
                    message: "알맞은 전화번호 형태를 입력해주세요. EX) 010-9994-2223",
                  },
                })}
              />
               {errors.phone && <Alert role="alert">{errors.phone.message}</Alert>}
            </Form.Group>
            <div className=" d-grid gap-2 mt-4">
              <Button size="lg" type="submit" disabled={isSubmitting} className="button">
                회원가입
              </Button>
              <Link to="/" className="btn">
                취소
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default SignUp;

const Alert = styled.div`
  color : red
`
