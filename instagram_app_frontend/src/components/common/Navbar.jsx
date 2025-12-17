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
