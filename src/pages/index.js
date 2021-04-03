import * as React from "react";
import Layout from "../components/layout";
import {
  Button,
  Column,
  ContentSwitcher,
  Form,
  FormGroup,
  FormLabel,
  Grid,
  Row,
  Select,
  SelectItem,
  Slider,
  Switch,
  Toggle,
} from "carbon-components-react";

// Polyfills for IE11
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.array.fill";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.string.trim";
import "core-js/modules/es7.object.values";
import { Tooltip } from "carbon-components-react/lib/components/tooltip/tooltip";

// markup
const IndexPage = () => {
  return (
    <Layout>
      <Grid narrow>
        <Row>
          <Column sm={1} md={2} lg={4}>
            <Form>
              <h4 style={{ marginBottom: "0.5rem" }}>NDI Configuration</h4>
              <FormGroup>
              <ContentSwitcher onChange={() => { }}>
                <Switch name="toggle-stream" text="Stream only"/>
                <Switch name="toggle-stream-record" text="Stream & Record"/>
              </ContentSwitcher>
              <div style={{ marginBottom: "0.5rem" }}></div>
                <Select
                  defaultValue="hd1920x1080"
                  id="ndi-quality-select"
                  labelText="Stream quality"
                >
                  <SelectItem
                    value="qHD960x540"
                    text="qHD 960x540"
                  ></SelectItem>
                  <SelectItem
                    value="hd1280x720"
                    text="HD 1280x720"
                  ></SelectItem>
                  <SelectItem
                    value="hd1920x1080"
                    text="HD 1920x1080"
                  ></SelectItem>
                  <SelectItem
                    value="hd4K3840x2160"
                    text="4K 3840x2160"
                  ></SelectItem>
                </Select>
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Toggle labelText="Stream audio" defaultToggled id="ndi-audio-toggle" />
                <div style={{ marginBottom: "1rem" }}></div>
                <Select
                  defaultValue="hd1920x1080"
                  id="record-quality-select"
                  labelText="Record quality"
                >
                  <SelectItem
                    value="qHD960x540"
                    text="qHD 960x540"
                  ></SelectItem>
                  <SelectItem
                    value="hd1280x720"
                    text="HD 1280x720"
                  ></SelectItem>
                  <SelectItem
                    value="hd1920x1080"
                    text="HD 1920x1080"
                  ></SelectItem>
                  <SelectItem
                    value="hd4K3840x2160"
                    text="4K 3840x2160"
                  ></SelectItem>
                </Select>
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Toggle labelText="Record audio" defaultToggled id="record-audio-toggle" />
              </FormGroup>
              <Button>Start</Button>
            </Form>
          </Column>
          <Column sm={1} md={2} lg={4}>
            <h4 style={{ marginBottom: "0.5rem" }}>Camera Control</h4>
            <FormGroup>
              <Slider
                labelText="Zoom"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                noValidate
                style={{ width: '100%' }}
              />
              <div style={{ marginBottom: "0.5rem" }}></div>
              <Slider
                labelText="Exposure bias"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                noValidate
              />
              <div style={{ marginBottom: "1rem" }}></div>
              <FormLabel>
                <Tooltip triggerText="White balance">
                  You can choose auto white balance or customise the temperature and tint in 'locked' mode.
                </Tooltip>
              </FormLabel>
              <div style={{ marginBottom: "0.5rem" }}></div>
              <ContentSwitcher onChange={() => { }}>
                <Switch name="one" text="Auto white balance"/>
                <Switch name="two" text="Locked white balance"/>
              </ContentSwitcher>
              <div style={{ marginBottom: "0.5rem" }}></div>
              <Slider
                labelText="White balance temperature"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                noValidate
              />
              <div style={{ marginBottom: "0.5rem" }}></div>
              <Slider
                labelText="White balance tint"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                noValidate
              />
              <div style={{ marginBottom: "1rem" }}></div>
              <FormLabel>
                <Tooltip triggerText="Interactive focus">
                  You can choose auto white balance or customise the temperature and tint in 'locked' mode.
                </Tooltip>
              </FormLabel>
              <ContentSwitcher onChange={() => { }}>
                <Switch name="one" text="Auto focus"/>
                <Switch name="two" text="Locked focus"/>
              </ContentSwitcher>
            </FormGroup>
          </Column>
          <Column sm={2} md={4} lg={8}>
            <h4 style={{ marginBottom: "0.5rem" }}>Preview</h4>
          </Column>
        </Row>
      </Grid>
    </Layout>
  );
};

export default IndexPage;
