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
  setWbModeAuto,
  setWbLockGrey,
  setWbModeLocked,
  setWbTempTint,
  setZoom,
  startNDI,
  stopNDI,
} from "../utils/camera-service";
// import Webcam from "react-webcam";
import WebcamCapture from "../components/webcam-capture";
import Webcam from "react-webcam";

// markup
class IndexPage extends React.Component {
  state = {
    activeCamera: null,
    zoom: { min: 1, max: 16, current: 1 },
    exposure: { min: -8, max: 8, current: 0 },
    whiteBalance: {
      supportsAuto: true,
      supportsCustomGain: true,
      minTemp: 3000,
      maxTemp: 8000,
      minTint: -150,
      maxTint: 150,
    },
    wb_isAuto: true,
    wb_currentTemp: 3000,
    wb_currentTint: -150,
    cameraName: "",
    isNDISending: false,
  };

  async componentDidMount() {
    let camera = await getActiveCamera();
    let wbTempTint = await getTempTint();

    if (
      // If current white balance is not continuous auto AND custom gains cannot be made AND grey white balance is not supported
      // then change the white balance mode is continuous auto
      camera.whiteBalance.currentWhiteBalanceMode !== "ContinuousAuto" &&
      !camera.whiteBalance.isCustomGainsSupportedInLockedMode &&
      !camera.whiteBalance.isGreyWhiteBalanceSupported
    ) {
      await setWbModeAuto();
    }

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
        supportsCustomGain:
          camera.whiteBalance.isLockedWhiteBalanceSupported &&
          camera.whiteBalance.isCustomGainsSupportedInLockedMode,
        supportsGrey:
          camera.whiteBalance.isLockedWhiteBalanceSupported &&
          camera.whiteBalance.isGreyWhiteBalanceSupported,
        minTemp: camera.whiteBalance.minTemp,
        maxTemp: camera.whiteBalance.maxTemp,
        minTint: camera.whiteBalance.minTint,
        maxTint: camera.whiteBalance.maxTint,
      },
      wb_currentTemp: Math.round(wbTempTint.temperature),
      wb_currentTint: Math.round(wbTempTint.tint),
      wb_isAuto:
        camera.whiteBalance.currentWhiteBalanceMode === "ContinuousAuto",
    });
  }

  async updateTempTint() {
    let wbTempTint = await getTempTint();
    this.setState({
      wb_currentTemp: Math.round(wbTempTint.temperature),
      wb_currentTint: Math.round(wbTempTint.tint),
    });
  }

  async setWbModeCustom() {
    await setWbModeLocked();
    this.setState({ wb_isAuto: false });
  }

  async setWbModeAuto() {
    await setWbModeAuto();
    this.setState({ wb_isAuto: true });
  }

  async setWbLockGrey() {
    await setWbModeLocked();
    await setWbLockGrey();

    setTimeout(() => {
      this.updateTempTint();
    }, 500); // arbitary number, it takes some time before the new temperature and tint values are ready
  }

  async setTempTint(temp, tint) {
    if (!this.state.wb_isAuto && this.state.whiteBalance.supportsCustomGain) {
      await setWbTempTint(temp, tint);
    }
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
                  kind={this.state.isNDISending ? "danger" : "primary"}
                >
                  {this.state.isNDISending ? "Stop" : "Start"}
                </Button>
              </Form>
            </Column>
            <Column md={3} lg={5}>
              <h4 style={{ marginBottom: "0.5rem" }}>Camera Control</h4>
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
                    temperature and tint, and lock to a grey reference card in
                    'custom' mode. If "Custom" is greyed out, choose another
                    camera.
                  </Tooltip>
                </FormLabel>
                <div style={{ marginBottom: "0.5rem" }}></div>
                <ContentSwitcher
                  selectedIndex={this.state.wb_isAuto ? 0 : 1}
                  onChange={({ name }) => {
                    this.updateTempTint();
                    if (name === "custom-white-balance-select") {
                      this.setWbModeCustom();
                    } else if (name === "auto-white-balance-select") {
                      this.setWbModeAuto();
                    }
                  }}
                >
                  <Switch
                    name="auto-white-balance-select"
                    text="Auto white balance"
                    disabled={!this.state.whiteBalance.supportsAuto}
                  />
                  <Switch
                    name="custom-white-balance-select"
                    text="Custom"
                    disabled={
                      !this.state.whiteBalance.supportsCustomGain ||
                      !this.state.whiteBalance.supportsGrey
                    }
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
                  disabled={
                    this.state.wb_isAuto ||
                    !this.state.whiteBalance.supportsCustomGain
                  }
                  onChange={({ value }) => {
                    this.setTempTint(value, this.state.wb_currentTint);
                  }}
                />
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Slider
                  labelText="White balance tint"
                  value={this.state.wb_currentTint}
                  min={this.state.whiteBalance.minTint}
                  max={this.state.whiteBalance.maxTint}
                  step={1}
                  stepMultiplier={10}
                  disabled={
                    this.state.wb_isAuto ||
                    !this.state.whiteBalance.supportsCustomGain
                  }
                  onChange={({ value }) => {
                    this.setTempTint(this.state.wb_currentTemp, value);
                  }}
                />
                <div style={{ marginBottom: "0.5rem" }}></div>
                <Button
                  disabled={
                    !this.state.whiteBalance.supportsGrey ||
                    this.state.wb_isAuto
                  }
                  onClick={() => {
                    this.setWbLockGrey();
                  }}
                >
                  Lock grey
                </Button>
                <div style={{ marginBottom: "1rem" }}></div>
                <FormLabel>
                  <Tooltip triggerText="Interactive focus">
                    You can choose auto white balance or customise the
                    temperature and tint in 'locked' mode.
                  </Tooltip>
                </FormLabel>
                <ContentSwitcher onChange={console.log} disabled>
                  <Switch name="auto-focus-select" text="Auto focus" disabled />
                  <Switch
                    name="locked-focus-select"
                    text="Locked focus"
                    disabled
                  />
                </ContentSwitcher>
            </Column>
            <Column md={3} lg={7}>
              <h4 style={{ marginBottom: "0.5rem" }}>Preview</h4>
              <WebcamCapture/>
            </Column>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

export default IndexPage;
