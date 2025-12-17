
// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import styled, { keyframes } from "styled-components";

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled.div`
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const LogoTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #1877f2;
`;

const LogoSubtitle = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #555;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
`;

const Icon = styled.div`
  margin-right: 10px;
  font-size: 18px;
  color: #555;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
`;

const SubmitButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #1877f2;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 15px 0;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #ddd;
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

const DividerText = styled.span`
  background-color: #fff;
  padding: 0 10px;
  color: #555;
`;

const AlternativeButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #42b72a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  font-size: 12px;
  color: #555;
  & > p {
    margin: 5px 0;
  }
`;

const FooterLink = styled(Link)`
  color: #1877f2;
  text-decoration: none;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    text-align: center;
  }

  div > div {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1877f2;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin: 0 auto 10px;
  }
`;

// Login Component
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(formData.username, formData.password);

      if (!result.success) {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({ username: "demo", password: "demo123" });
    setLoading(true);
    try {
      await login("demo", "demo123");
    } catch {
      setError("Demo login failed. Please try manual login.");
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        {loading && (
          <LoadingOverlay>
            <div>
              <div />
              <p>Logging in...</p>
            </div>
          </LoadingOverlay>
        )}

        <Logo>
          <LogoTitle>SocialApp</LogoTitle>
          <LogoSubtitle>Connect with friends and the world around you</LogoSubtitle>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Icon>
              <FiMail />
            </Icon>
            <Input
              type="text"
              name="username"
              placeholder="Username or email"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </FormGroup>

          <FormGroup>
            <Icon>
              <FiLock />
            </Icon>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </SubmitButton>
        </Form>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

        <AlternativeButton onClick={handleDemoLogin} disabled={loading}>
          Try Demo Account
        </AlternativeButton>

        <Footer>
          <p>
            Don't have an account? <FooterLink to="/register">Sign up</FooterLink>
          </p>
          <p>
            <FooterLink to="/forgot-password">Forgot password?</FooterLink>
          </p>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
