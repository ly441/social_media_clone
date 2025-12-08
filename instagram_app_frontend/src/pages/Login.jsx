import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1877f2;
  margin: 0 0 8px 0;
`;

const LogoSubtitle = styled.p`
  color: #65676b;
  font-size: 14px;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #1877f2;
  }

  &::placeholder {
    color: #999;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: #666;
  }
`;

const SubmitButton = styled.button`
  background: #1877f2;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #166fe5;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 20px 0;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: #e0e0e0;
  }
`;

const DividerText = styled.span`
  background: white;
  padding: 0 16px;
  color: #65676b;
  font-size: 14px;
  position: relative;
`;

const AlternativeButton = styled.button`
  background: #42b72a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #36a420;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
`;

const FooterLink = styled(Link)`
  color: #1877f2;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #e41e3f;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`;

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setFormData({
      username: "demo",
      password: "demo123",
    });

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
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #1877f2",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 10px",
                }}
              />
              <p>Logging in...</p>
            </div>
          </LoadingOverlay>
        )}

        <Logo>
          <LogoTitle>SocialApp</LogoTitle>
          <LogoSubtitle>
            Connect with friends and the world around you
          </LogoSubtitle>
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
            Don't have an account?{" "}
            <FooterLink to="/register">Sign up</FooterLink>
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
