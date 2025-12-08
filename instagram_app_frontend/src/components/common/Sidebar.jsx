import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiVideo,
  FiCalendar,
  FiBookmark,
  FiFlag,
  FiSettings,
  FiHelpCircle,
  FiMoon,
} from "react-icons/fi";
import { RiAdvertisementLine } from "react-icons/ri";

const SidebarContainer = styled.aside`
  width: 250px;
  background: white;
  border-right: 1px solid #e0e0e0;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: 0;
  overflow-y: auto;
  padding: 20px 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserSection = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;

  &:hover {
    background: #f0f2f5;
  }
`;

const UserAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div``;

const Username = styled.div`
  font-weight: 600;
  color: #1c1e21;
  font-size: 15px;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: #65676b;
`;

const NavSection = styled.div`
  padding: 0 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  color: #65676b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-left: 10px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 4px;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  text-decoration: none;
  color: #1c1e21;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #f0f2f5;
  }

  &.active {
    background: #e7f3ff;
    color: #1877f2;
    font-weight: 600;

    svg {
      color: #1877f2;
    }
  }

  svg {
    font-size: 20px;
    color: #65676b;
  }
`;

const Shortcuts = styled.div`
  padding: 0 20px;
`;

const ShortcutList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ShortcutItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #1c1e21;
  cursor: pointer;

  &:hover {
    background: #e4e6eb;
  }
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const FooterLink = styled.a`
  font-size: 12px;
  color: #65676b;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Copyright = styled.p`
  font-size: 12px;
  color: #65676b;
  margin: 0;
`;

const Sidebar = () => {
  const { user } = useAuth();

  const mainNavItems = [
    { to: "/", icon: <FiHome />, label: "Home" },
    { to: `/profile/${user?.id}`, icon: <FiUser />, label: "Profile" },
    { to: "/friends", icon: <FiUsers />, label: "Friends" },
    { to: "/watch", icon: <FiVideo />, label: "Watch" },
    { to: "/events", icon: <FiCalendar />, label: "Events" },
    { to: "/saved", icon: <FiBookmark />, label: "Saved" },
  ];

  const exploreNavItems = [
    { to: "/explore", icon: <RiAdvertisementLine />, label: "Explore" },
    { to: "/groups", icon: <FiUsers />, label: "Groups" },
    { to: "/pages", icon: <FiFlag />, label: "Pages" },
  ];

  const settingsNavItems = [
    { to: "/settings", icon: <FiSettings />, label: "Settings" },
    { to: "/help", icon: <FiHelpCircle />, label: "Help & Support" },
    { to: "/dark-mode", icon: <FiMoon />, label: "Dark Mode" },
  ];

  return (
    <SidebarContainer>
      <UserSection>
        <UserInfo>
          <UserAvatar
            src={user?.profile_picture || "https://via.placeholder.com/150"}
            alt={user?.username}
          />
          <UserDetails>
            <Username>{user?.username}</Username>
            <UserEmail>{user?.email}</UserEmail>
          </UserDetails>
        </UserInfo>
      </UserSection>

      <NavSection>
        <NavList>
          {mainNavItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled to={item.to} end={item.to === "/"}>
                {item.icon}
                {item.label}
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>Explore</SectionTitle>
        <NavList>
          {exploreNavItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled to={item.to}>
                {item.icon}
                {item.label}
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <Shortcuts>
        <SectionTitle>Shortcuts</SectionTitle>
        <ShortcutList>
          <ShortcutItem>Programming</ShortcutItem>
          <ShortcutItem>Music</ShortcutItem>
          <ShortcutItem>Travel</ShortcutItem>
          <ShortcutItem>Sports</ShortcutItem>
          <ShortcutItem>+ Add</ShortcutItem>
        </ShortcutList>
      </Shortcuts>

      <NavSection>
        <SectionTitle>Settings</SectionTitle>
        <NavList>
          {settingsNavItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled to={item.to}>
                {item.icon}
                {item.label}
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <SidebarFooter>
        <FooterLinks>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Advertising</FooterLink>
          <FooterLink href="#">Cookies</FooterLink>
          <FooterLink href="#">More</FooterLink>
        </FooterLinks>
        <Copyright>© {new Date().getFullYear()} SocialApp</Copyright>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
