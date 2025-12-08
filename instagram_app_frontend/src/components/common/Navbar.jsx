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

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #1877f2;
  text-decoration: none;

  &:hover {
    color: #166fe5;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 0 1 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px 8px 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #f0f2f5;
  font-size: 14px;

  &:focus {
    outline: none;
    background: white;
    border-color: #1877f2;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #65676b;
`;

const NavIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavIcon = styled(Link)`
  position: relative;
  color: #65676b;
  font-size: 20px;
  text-decoration: none;

  &:hover {
    color: #1877f2;
  }

  &.active {
    color: #1877f2;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e41e3f;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;

  &:hover {
    background: #f0f2f5;
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  text-decoration: none;
  color: #1c1e21;

  &:hover {
    background: #f0f2f5;
  }
`;

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
              <DropdownItem as="button" onClick={handleLogout}>
                <FiLogOut /> Logout
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserMenu>
      </NavIcons>
    </NavbarContainer>
  );
};

export default Navbar;
