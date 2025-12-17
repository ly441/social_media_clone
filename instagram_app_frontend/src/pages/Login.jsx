import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";



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
