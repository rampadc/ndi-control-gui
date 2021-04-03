import React from "react";
import AppHeader from "./header";
import { Content } from 'carbon-components-react';

export default function Layout(props) {
  return (
    <div>
      <AppHeader activeCamera={props.activeCamera}></AppHeader>
      <Content style={{background: 'unset', paddingLeft: 0}}>
        {props.children}
      </Content>
    </div>
  );
}
