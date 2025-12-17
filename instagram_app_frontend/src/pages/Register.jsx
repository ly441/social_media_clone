
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";




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