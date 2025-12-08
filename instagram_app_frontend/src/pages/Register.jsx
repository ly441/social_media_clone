
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

const SuccessMessage = styled.div`
  background: #e6ffe6;
  color: #42b72a;
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

const PasswordStrength = styled.div`
  margin-top: 8px;
  font-size: 12px;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  background: ${(props) => {
    if (props.strength === "weak") return "#e41e3f";
    if (props.strength === "fair") return "#ff9800";
    if (props.strength === "good") return "#4caf50";
    if (props.strength === "strong") return "#2196f3";
    return "#e0e0e0";
  }};
  width: ${(props) => {
    if (props.strength === "weak") return "25%";
    if (props.strength === "fair") return "50%";
    if (props.strength === "good") return "75%";
    if (props.strength === "strong") return "100%";
    return "0%";
  }};
  transition: all 0.3s ease;
`;

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
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 8) return "fair";
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "strong";
    }
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) {
      return "good";
    }
    return "fair";
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
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
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
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
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #42b72a",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 10px",
                }}
              />
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
            <Icon>
              <FiUser />
            </Icon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </FormGroup>

          <FormGroup>
            <Icon>
              <FiMail />
            </Icon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
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

            {formData.password && (
              <PasswordStrength>
                <div>Password strength: {passwordStrength}</div>
                <StrengthBar>
                  <StrengthFill strength={passwordStrength} />
                </StrengthBar>
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Icon>
              <FiLock />
            </Icon>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>

            {formData.confirmPassword && !passwordsMatch && (
              <div
                style={{ color: "#e41e3f", fontSize: "12px", marginTop: "4px" }}
              >
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
            <Link to="/terms" style={{ color: "#1877f2" }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" style={{ color: "#1877f2" }}>
              Privacy Policy
            </Link>
          </p>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;