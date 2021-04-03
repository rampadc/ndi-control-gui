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
import "../styles/override.scss";

// Polyfills for IE11
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.array.fill";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.string.trim";
import "core-js/modules/es7.object.values";
import { Tooltip } from "carbon-components-react/lib/components/tooltip/tooltip";

import {
  getActiveCamera,
  getTempTint,
  setExposureBias,
  setZoom,
  startNDI,
  stopNDI,
} from "../utils/camera-service";

// markup
class IndexPage extends React.Component {
  state = {
    activeCamera: null,
    zoom: { min: 1, max: 16, current: 1 },
    exposure: { min: -8, max: 8, current: 0 },
    whiteBalance: {
      supportsAuto: true,
      supportsLocked: true,
      minTemp: 3000,
      maxTemp: 8000,
      minTint: -150,
      maxTint: 150,
    },
    isCurrentWbAuto: true,
    wb_currentTemp: 3000,
    wb_currentTint: -150,
    cameraName: "",
    isNDISending: false,
  };

  async componentDidMount() {
    let camera = await getActiveCamera();
    let wbTempTint = await getTempTint();

    console.log(camera);
    this.setState({
      activeCamera: camera,
      cameraName: camera.properties.localizedName,
      zoom: {
        min: camera.zoom.minAvailableZoomFactor,
        max: camera.zoom.maxAvailableZoomFactor,
        current: camera.zoom.videoZoomFactor,
      },
      exposure: {
        min: camera.exposure.minExposureTargetBias_EV,
        max: camera.exposure.maxExposureTargetBias_EV,
        current: camera.exposure.currentTargetBias_EV,
      },
      whiteBalance: {
        supportsAuto: camera.whiteBalance.isContinuousWhiteBalanceSupported,
        supportsLocked: camera.whiteBalance.isLockedWhiteBalanceSupported,
        minTemp: camera.whiteBalance.minTemp,
        maxTemp: camera.whiteBalance.maxTemp,
        minTint: camera.whiteBalance.minTint,
        maxTint: camera.whiteBalance.maxTint,
        isCurrentAuto:
          camera.whiteBalance.currentWhiteBalanceMode === "ContinuousAuto",
      },
      wb_currentTemp: Math.round(wbTempTint.temperature),
      wb_currentTint: Math.round(wbTempTint.tint),
    });
  }

  async updateTempTint() {
    let wbTempTint = await getTempTint();
    this.setState({
      wb_currentTemp: Math.round(wbTempTint.temperature),
      wb_currentTint: Math.round(wbTempTint.tint),
    });
  }

  render() {
    return (
      <Layout activeCamera={this.state.cameraName}>
        <Grid narrow style={{ marginLeft: "unset" }}>
          <Row>
            <Column md={2} lg={4}>
              <Form>
                <h4 style={{ marginBottom: "0.5rem" }}>NDI Configuration</h4>
                <FormGroup legendText="Shows configurations for NDI stream and recording">
                  <ContentSwitcher onChange={() => {}} disabled>
                    <Switch name="toggle-stream" text="Stream only" disabled />
                    <Switch
                      name="toggle-stream-record"
                      text="Stream & Record"
                      disabled
                    />
                  </ContentSwitcher>
                  <div style={{ marginBottom: "0.5rem" }}></div>
                  <Select
                    defaultValue="hd1920x1080"
                    id="ndi-quality-select"
                    labelText="Stream quality"
                    disabled
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
                  <Toggle
                    labelText="Stream audio"
                    defaultToggled
                    id="ndi-audio-toggle"
                    disabled
                  />
                  <div style={{ marginBottom: "1rem" }}></div>
                  <Select
                    defaultValue="hd1920x1080"
                    id="record-quality-select"
                    labelText="Record quality"
                    disabled
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
                  <Toggle
                    labelText="Record audio"
                    defaultToggled
                    id="record-audio-toggle"
                    disabled
                  />
                </FormGroup>
                <Button
                  onClick={async () => {
                    if (this.state.isNDISending) {
                      await stopNDI();
                      this.setState({ isNDISending: false });
                    } else {
                      await startNDI();
                      this.setState({ isNDISending: true });
                    }
                  }}
                  kind={this.state.isNDISending ? 'danger' : 'primary'}
                >
                  {this.state.isNDISending ? 'Stop' : 'Start'}
                </Button>
              </Form>
            </Column>
            <Column md={3} lg={5}>
              <h4 style={{ marginBottom: "0.5rem" }}>Camera Control</h4>
              <FormGroup legendText="Configure camera settings">
                <Slider
                  labelText="Zoom"
                  value={this.state.zoom.current}
                  min={this.state.zoom.min}
                  max={this.state.zoom.max}
                  step={0.1}
                  stepMultiplier={1}
                  onChange={({ value }) => {
                    setZoom(value);
                  }}
                />
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Slider
                  labelText="Exposure bias"
                  value={this.state.exposure.current}
                  min={this.state.exposure.min}
                  max={this.state.exposure.max}
                  step={0.1}
                  stepMultiplier={1}
                  onChange={({ value }) => {
                    setExposureBias(value);
                  }}
                />
                <div style={{ marginBottom: "1rem" }}></div>
                <FormLabel>
                  <Tooltip triggerText="White balance">
                    You can choose auto white balance or customise the
                    temperature and tint in 'locked' mode.
                  </Tooltip>
                </FormLabel>
                <div style={{ marginBottom: "0.5rem" }}></div>
                <ContentSwitcher
                  onChange={({ name }) => {
                    if (name === "locked-white-balance-select")
                      this.setState({ isCurrentWbAuto: false });
                    else {
                      this.setState({ isCurrentWbAuto: true });
                      this.updateTempTint();
                    }
                  }}
                >
                  <Switch
                    name="auto-white-balance-select"
                    text="Auto white balance"
                    disabled={!this.state.whiteBalance.supportsAuto}
                  />
                  <Switch
                    name="locked-white-balance-select"
                    text="Locked white balance"
                    disabled={!this.state.whiteBalance.supportsLocked}
                  />
                </ContentSwitcher>
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Slider
                  labelText="White balance temperature"
                  value={this.state.wb_currentTemp}
                  min={this.state.whiteBalance.minTemp}
                  max={this.state.whiteBalance.maxTemp}
                  step={1}
                  stepMultiplier={10}
                  disabled={this.state.isCurrentWbAuto}
                />
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Slider
                  labelText="White balance tint"
                  value={this.state.wb_currentTint}
                  min={this.state.whiteBalance.minTint}
                  max={this.state.whiteBalance.maxTint}
                  step={1}
                  stepMultiplier={10}
                  disabled={this.state.isCurrentWbAuto}
                />
                <div style={{ marginBottom: "1rem" }}></div>
                <FormLabel>
                  <Tooltip triggerText="Interactive focus">
                    You can choose auto white balance or customise the
                    temperature and tint in 'locked' mode.
                  </Tooltip>
                </FormLabel>
                <ContentSwitcher onChange={() => {}} disabled>
                  <Switch name="auto-focus-select" text="Auto focus" disabled />
                  <Switch
                    name="locked-focus-select"
                    text="Locked focus"
                    disabled
                  />
                </ContentSwitcher>
              </FormGroup>
            </Column>
            <Column md={3} lg={7}>
              <h4 style={{ marginBottom: "0.5rem" }}>Preview</h4>
            </Column>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

export default IndexPage;
