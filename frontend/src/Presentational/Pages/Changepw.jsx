import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../redux/api";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Changepw = () => {
  const email = useSelector((state) => state.auth.email.email);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const password = useRef();
  password.current = watch("password");

  const onSubmit = handleSubmit(({ password }) => {
    api
      .put("/account/changepw", JSON.stringify({ email, password }))
      .then((response) => {
        alert(response.data);
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert("일치하는 아이디가 존재하지 않습니다.");
        } else {
          alert("요청한 페이지가 존재하지 않습니다.");
        }
      });
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="middle">
      <div className="logo">WPHM</div>

      <div className="login_back">
        <Form onSubmit={onSubmit}>
          <div className="bold_header">비밀번호 변경</div>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email"> 아이디</Form.Label>
            <Form.Control htmlSize={50} id="email" type="text" value={email} disabled={true} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              autoFocus={true}
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
          <Form.Group className="mt-3">
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
            {errors.password_conform && errors.password_conform.type === "validate" && (
              <Alert>The passwords do not match</Alert>
            )}
          </Form.Group>
          <div className=" d-grid gap-2 mt-4">
            <Button size="lg" type="submit" disabled={isSubmitting} className="button">
              확인
            </Button>
            <Link to="/" className="btn">
              취소
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Changepw;

const Alert = styled.div`
  color: red;
`;
