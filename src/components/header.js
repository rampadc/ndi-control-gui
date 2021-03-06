import React from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  SkipToContent,
} from "carbon-components-react";
import { Link } from "gatsby";

const AppHeader = ({activeCamera}) => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="NDI Camera Control">
        <SkipToContent />
        <HeaderName element={Link} to="/" prefix="NDI">
          Camera Control
        </HeaderName>
        <HeaderNavigation aria-label="Camera Control">
          <HeaderMenuItem element={Link} to="/cameras">Active camera: {activeCamera}</HeaderMenuItem>
        </HeaderNavigation>
      </Header>
    )}
  />
);

export default AppHeader;
