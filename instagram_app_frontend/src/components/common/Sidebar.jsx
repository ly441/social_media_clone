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
