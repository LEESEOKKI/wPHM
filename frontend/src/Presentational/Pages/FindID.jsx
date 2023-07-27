import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../redux/api";

const FindID = () => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = handleSubmit(({ name, phone }) => {
    api
      .post("/account/findid", JSON.stringify({ name, phone }))
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
          <div className="bold_header">아이디 찾기</div>
          <Form.Group>
            <Form.Label htmlFor="name"> 이름</Form.Label>
            <Form.Control
              autoFocus={true}
              htmlSize={50}
              id="name"
              type="text"
              placeholder="Enter your Name"
              aria-invalid={
                !isDirty ? undefined : errors.name ? "true" : "false"
              }
              {...register("name", {
                required: "이름은 필수 입력입니다.",
                pattern: {
                  value: /^[가-힣a-zA-Z0-9]+$/,
                  message: "한글, 영어만 사용 가능합니다.",
                },
              })}
            />
            {errors.name && <small role="alert">{errors.name.message}</small>}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="phonenumber" className="mt-3">
              전화번호
            </Form.Label>

            <Form.Control
              id="phone"
              type="text"
              placeholder="Enter your Phone-Number"
              aria-invalid={
                !isDirty ? undefined : errors.phone ? "true" : "false"
              }
              {...register("phone", {
                required: "전화번호는 필수 입력입니다.",
                pattern: {
                  value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                  message:
                    "알맞은 전화번호 형태를 입력해주세요 EX) 010-9994-2223",
                },
                minLength: {
                  value: 13,
                  message:
                    "알맞은 전화번호 형태를 입력해주세요. EX) 010-9994-2223",
                },
              })}
            />
            {errors.phone && <small role="alert">{errors.phone.message}</small>}
          </Form.Group>
          <div className=" d-grid gap-2 mt-4">
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="button"
            >
              다음
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

export default FindID;
