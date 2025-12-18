
// Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import styled, { keyframes } from "styled-components";

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const RegisterCard = styled.div`
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
  color: #42b72a;
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
  background-color: #42b72a;
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

const Footer = styled.div`
  text-align: center;
  font-size: 12px;
  color: #555;
  & > p {
    margin: 5px 0;
  }
`;

const FooterLink = styled(Link)`
  color: #42b72a;
  text-decoration: none;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
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
    border-top: 4px solid #42b72a;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin: 0 auto 10px;
  }
`;

// Password Strength
const PasswordStrength = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #555;
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  margin-top: 4px;
`;

const StrengthFill = styled.div`
  height: 100%;
  border-radius: 3px;
  width: ${(props) => {
    switch (props.$strength) {
      case "weak": return "25%";
      case "fair": return "50%";
      case "good": return "75%";
      case "strong": return "100%";
      default: return "0%";
    }
  }};
  background-color: ${(props) => {
    switch (props.$strength) {
      case "weak": return "#e41e3f";
      case "fair": return "#f5a623";
      case "good": return "#42b72a";
      case "strong": return "#1877f2";
      default: return "#eee";
    }
  }};
  transition: width 0.3s ease;
`;

// Register Component
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const calculatePasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "weak";
    if (password.length < 8) return "fair";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong";
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) return "good";
    return "fair";
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.error || "Registration failed");
      } else {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        {loading && (
          <LoadingOverlay>
            <div>
              <div />
              <p>Creating your account...</p>
            </div>
          </LoadingOverlay>
        )}

        <Logo>
          <LogoTitle>Join SocialApp</LogoTitle>
          <LogoSubtitle>Create your account to get started</LogoSubtitle>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Icon><FiUser /></Icon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="username"
            />
          </FormGroup>

          <FormGroup>
            <Icon><FiMail /></Icon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup>
            <Icon><FiLock /></Icon>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>

            {formData.password && (
              <PasswordStrength>
                <div>Password strength: {passwordStrength}</div>
                <StrengthBar>
                  <StrengthFill $strength={passwordStrength} />
                </StrengthBar>
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Icon><FiLock /></Icon>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>

            {formData.confirmPassword && !passwordsMatch && (
              <div style={{ color: "#e41e3f", fontSize: "12px", marginTop: "4px" }}>
                Passwords do not match
              </div>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading || !passwordsMatch}>
            {loading ? "Creating Account..." : "Create Account"}
          </SubmitButton>
        </Form>

        <Footer>
          <p>
            Already have an account? <FooterLink to="/login">Log in</FooterLink>
          </p>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "16px" }}>
            By creating an account, you agree to our{" "}
            <Link to="/terms" style={{ color: "#42b72a" }}>Terms</Link> and{" "}
            <Link to="/privacy" style={{ color: "#42b72a" }}>Privacy Policy</Link>
          </p>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
