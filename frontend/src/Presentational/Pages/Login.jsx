import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authActions } from "../../redux/reducer/authReducer";
import { newactions } from '../../redux/reducer/Reducer'
import jwtDecode from "jwt-decode";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../redux/api";

const Login = () => {

  const dispatch = useDispatch();

  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = handleSubmit(({ email, password }) => {
    api
      .post("/account/login", JSON.stringify({ email, password }))
      .then((response) => {
        // console.log(response.data);
        const collotionJSON = JSON.stringify(response.data.collectionNames)
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("collectionNames", collotionJSON);
        const data_ = jwtDecode(response.data.token);
        dispatch(authActions.settype( response.data.type ));
        // console.log(collotionJSON)

        dispatch(authActions.logIn({ data: data_ }));
        dispatch(newactions.setNum(0));

      })
      .catch((error) => {
        alert(error.response.data)

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
          <div className="bold_header">
            로그인
          </div>
          <Form.Group>
            <Form.Label htmlFor="email">아이디</Form.Label>
            <Link to="/FindID" className="btn2">
              아이디 찾기
            </Link>
            <Form.Control
              autoFocus={true}
              htmlSize={50}
              id="email"
              type="text"
              placeholder="balamia@wonik.co.kr"
              aria-invalid={!isDirty ? undefined : errors.email ? "true" : "false"}
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
              })}
            />
            {errors.email && <small role="alert">{errors.email.message}</small>}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="password" className="mt-3">
              비밀번호
              <Link to="/FindPassword" className="btn4">
                {" "}
                비밀번호 찾기{" "}
              </Link>
            </Form.Label>
            <Form.Control
              id="password"
              type="password"
              placeholder="Enter your password"
              aria-invalid={!isDirty ? undefined : errors.password ? "true" : "false"}
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                minLength: {
                  value: 8,
                  message: "8자리 이상 비밀번호를 사용하세요.",
                },
              })}
            />
            {errors.password && <small role="alert">{errors.password.message}</small>}
          </Form.Group>
          <div className=" d-grid gap-2 mt-4">
            <Button size="lg" type="submit" disabled={isSubmitting} className="button">
              로그인
            </Button>

            <Link to="/signup" className="btn">
              회원가입
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
