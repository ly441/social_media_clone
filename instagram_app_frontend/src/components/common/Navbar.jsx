import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiSearch,
  FiHome,
  FiUser,
  FiBell,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { CgAddR } from "react-icons/cg";
import styled from "styled-components";

// ===== Styled Components =====
const NavbarContainer = styled.nav`
  width: 100%;
  height: 60px;
  background-color: #42b72a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 5px 10px;
  color: #555;
`;

const SearchIcon = styled(FiSearch)`
  margin-right: 8px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavIcon = styled(Link)`
  color: white;
  font-size: 20px;
  position: relative;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 50%;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
`;

const UserAvatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  color: #555;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  text-decoration: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonDropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  width: 100%;
  border: none;
  background: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// ===== Navbar Component =====
const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <NavbarContainer>
      <Logo to="/">SocialApp</Logo>

      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder="Search users..." />
      </SearchContainer>

      <NavIcons>
        <NavIcon to="/" title="Home">
          <FiHome />
        </NavIcon>

        <NavIcon to="/explore" title="Explore">
          <CgAddR />
        </NavIcon>

        <NavIcon to="/messages" title="Messages">
          <FiMessageSquare />
          <Badge>3</Badge>
        </NavIcon>

        <NavIcon to="/notifications" title="Notifications">
          <FiBell />
          <Badge>5</Badge>
        </NavIcon>

        <UserMenu>
          <UserButton onClick={() => setShowDropdown(!showDropdown)}>
            <UserAvatar
              src={user?.profile_picture || "https://via.placeholder.com/150"}
              alt={user?.username}
            />
          </UserButton>

          {showDropdown && (
            <DropdownMenu>
              <DropdownItem to={`/profile/${user?.id}`}>
                <FiUser /> Profile
              </DropdownItem>
              <ButtonDropdownItem onClick={handleLogout}>
                <FiLogOut /> Logout
              </ButtonDropdownItem>
            </DropdownMenu>
          )}
        </UserMenu>
      </NavIcons>
    </NavbarContainer>
  );
};

export default Navbar;
