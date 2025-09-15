import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthSuccess } from "../utils/auth";
import { authApi } from "../api/authApi";

export default function SignUp() {
  const [form, setForm] = useState({
    memberId: "",
    nickname: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      const data = await authApi.signup(form);
      alert(data.member.nickname + "님 환영합니다. :)");
      handleAuthSuccess(data, navigate);
    } catch (error) {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <h2>LoopCa</h2>
      </header>

      <h3 className="auth-title">회원가입</h3>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="memberId"
          placeholder="아이디"
          value={form.memberId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm"
          placeholder="비밀번호 확인"
          value={form.confirm}
          onChange={handleChange}
        />
        <button type="submit" className="auth-btn">Sign Up</button>
      </form>

      <p className="auth-footer">
        이미 계정이 있나요? <a href="/login">로그인</a>
      </p>
    </div>
  );
}
