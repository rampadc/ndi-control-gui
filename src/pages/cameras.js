import {
  Button,
  CodeSnippet,
  Column,
  FormGroup,
  Grid,
  RadioButtonGroup,
  Row,
} from "carbon-components-react";
import { RadioButton } from "carbon-components-react/lib/components/radiobutton/radiobutton";
import React from "react";
import Layout from "../components/layout";

const CamerasPage = () => {
  return (
    <Layout>
      
      <Grid narrow style={{ marginLeft: "unset", marginRight: "unset" }}>
        <Row>
          <Column lg={4}>
          <h4 style={{ marginBottom: "1.5rem" }}>Available cameras</h4>
          <FormGroup
  legendText="Select a camera below to preview its properties"
>
  <RadioButtonGroup
    defaultSelected="default-selected"
    legend="Group Legend"
    name="radio-button-group"
    valueSelected="default-selected"
   orientation='vertical'>
    <RadioButton
      id="radio-1"
      labelText="Radio button label"
      value="standard"
    />
    <RadioButton
      id="radio-2"
      labelText="Radio button label"
      value="default-selected"
    />
    <RadioButton
      id="radio-3"
      labelText="Radio button label"
      value="disabled"
    />
  </RadioButtonGroup>
</FormGroup>
<Button>Switch</Button>
            </Column>
          <Column lg={12}>
            <CodeSnippet type="multi"></CodeSnippet>
          </Column>
        </Row>
      </Grid>
    </Layout>
  );
};

export default CamerasPage;
