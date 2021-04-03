import React from "react";
import AppHeader from "./header";
import { Content } from 'carbon-components-react';

export default function Layout({ children }) {
  console.log(children);
  return (
    <div>
      <AppHeader></AppHeader>
      <Content>
        {children}
      </Content>
    </div>
  );
}
