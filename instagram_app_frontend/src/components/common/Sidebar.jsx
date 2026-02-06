import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
import styled from "styled-components";

// ===== Styled Components =====
const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UserSection = styled.div`
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-weight: bold;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #666;
`;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 8px;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  text-decoration: none;
  font-size: 14px;

  &.active {
    font-weight: bold;
    color: #42b72a;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const Shortcuts = styled.div`
  margin-bottom: 20px;
  background-color:rgb(141, 138, 138);
`;

const ShortcutList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ShortcutItem = styled.li`
  margin-bottom: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color:rgb(3, 13, 1);
  }
  text-color: black;
`;

const SidebarFooter = styled.div`
  font-size: 12px;
  color: black;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  font-size: 12px;
  color: #aaa;
`;

// ===== Sidebar Component =====
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
      <div>
        <UserSection>
          <UserInfo>
            <UserAvatar
              src={
                user?.profile_picture ||
                "https://www.pinterest.com/pin/296956169204723884/"
              }
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
      </div>

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
