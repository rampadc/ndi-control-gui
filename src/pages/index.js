import * as React from "react";
import Layout from "../components/layout";
import {
  Button,
  Column,
  ContentSwitcher,
  FormGroup,
  FormLabel,
  Grid,
  Loading,
  Row,
  Select,
  SelectItem,
  Slider,
  Switch,
  Toggle,
  TextInput,
  Modal,
  InlineNotification
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
  getNDIStatus,
  testUrl,
  setBaseUrl,
} from "../utils/camera-service";
import WebcamCapture from "../components/webcam-capture";
import {Connect16} from '@carbon/icons-react';

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
    waitingForNdiStateChange: false,
    poiHighlightSupported: false,
    serverUrl: '',
    showErrorCameraServer: false,
    showErrorInvalidFormatCameraServerUrl: false,
    isConnectingToCameraServerUrl: false,
    showErrorInvalidCameraServerUrl: false,
    modalRequested: false,
    modalClosable: false
  };

  async prepareUI() {
    let hasNdiStarted = await getNDIStatus();
    this.setState({
      isNDISending: hasNdiStarted
    });
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
      poiHighlightSupported: camera.autoFocus.isFocusPointOfInterestSupported || camera.exposure.isExposurePointOfInterestSupported
    });
  }

  async componentDidMount() {
    // Get server url from local storage
    const localServerUrl = JSON.parse(localStorage.getItem('serverUrl'));
    if (localServerUrl) {
      this.setServerUrl(localServerUrl.serverUrl);
    } else {
      return;
    }
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

  setServerUrl(url) {
    localStorage.setItem('serverUrl', JSON.stringify({
      serverUrl: url
    }));
    this.setState({
      serverUrl: url,
      modalRequested: false,
      modalClosable: true
    }, () => {
      setBaseUrl(url);
      this.prepareUI();
    });
  }

  async connectToCameraServer(url) {
    // disable the connect and close button, add loading animation
    this.setState({
      isConnectingToCameraServerUrl: true
    });
    
    let connectButton = document.querySelectorAll('.bx--modal-footer .bx--btn')[0];
    if (connectButton != null) {
      // disable it for now
      connectButton.disabled = true;
    }

    // connect to server
    // check if this is a valid server by querying an endpoint
    try {
      let _ = await testUrl(url);
      
      // if yes, end loading animation, load the url into camera-service and prepareUI()
      this.setState({
        isConnectingToCameraServerUrl: false
      });
      if (connectButton != null) {
        connectButton.disabled = false;
      }
      this.setServerUrl(url);
    } catch (error) {
      if (error) {
        // if no, end loading animation, tell user it's doesn't look like the app is running or on the same network
        this.setState({
          showErrorInvalidCameraServerUrl: true,
          isConnectingToCameraServerUrl: false
        });
        if (connectButton != null) {
          connectButton.disabled = false;
        }
      }
    }    
  }

  checkCameraServerUrl() {
    let value = document.getElementById('serverUrlInput').value;
    if (value.trim().length === 0) {
      this.setState({
        showErrorCameraServer: true
      });
      return;
    }

    if (value.trim().length !== 0) {
      this.setState({
        showErrorCameraServer: false
      });
    }
    if (value.match(/^http[s]?:\/\/[\.0-9a-zA-Z]+:?[0-9]*\/?$/) == null) {
      this.setState({
        showErrorInvalidFormatCameraServerUrl: true
      });
    } else {
      this.setState({
        showErrorInvalidFormatCameraServerUrl: false
      });
      this.connectToCameraServer(value);
    }
  }

  render() {
    return (
      <Layout activeCamera={this.state.cameraName}>
        <Modal
          open={this.state.serverUrl.trim().length === 0 || this.state.modalRequested || !this.state.modalClosable}
          modalHeading="Add a camera server"
          modalLabel="Camera server"
          primaryButtonText="Connect"
          onRequestClose={() => {
            if (this.state.serverUrl.trim().length === 0) {
              // show inline error that the user needs to have a camera server to use this
              this.setState({ showErrorCameraServer: true });
            } else {
              this.setState({ 
                showErrorCameraServer: false,
                modalRequested: false
              });
            }
          }}
          onRequestSubmit={() => {
            this.checkCameraServerUrl();
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            This URL will be shown everytime your app launches in the bottom
            left corner. Please include the 'http://'.
          </p>
          <TextInput
            data-modal-primary-focus
            id="serverUrlInput"
            labelText="Server URL"
            placeholder={`e.g. http://iPhone.local, http://192.168.1.2${this.state.serverUrl.trim.length > 0 ? `, ${this.state.serverUrl}` : ''}`}
            style={{ marginBottom: "1rem" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                this.checkCameraServerUrl();
              }
            }}
          />
          <div hidden={!this.state.showErrorCameraServer}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle="A camera server URL must be provided to use the controls"
            />
          </div>
          <div hidden={!this.state.showErrorInvalidFormatCameraServerUrl}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle="Invalid web server URL detected. The expected RegEx pattern is /^http[s]?:\/\/[\.0-9a-zA-Z]+:?[0-9]*\/?$/"
            />
          </div>
          <div hidden={!this.state.showErrorInvalidCameraServerUrl}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle="Cannot find a valid NDI camera server at the URL provided. Make sure the this browser is running on the same network as the NDI camera."
            />
          </div>
          <div hidden={!this.state.isConnectingToCameraServerUrl}>
            <Loading
              description="Connecting..."
              withOverlay={false}
              small={true}
            />
          </div>
        </Modal>
        <Grid narrow style={{ marginLeft: "unset" }}>
          <Row>
            <Column md={2} lg={4}>
              <h4 style={{ marginBottom: "0.5rem" }}>NDI Configuration</h4>
              <FormGroup legendText="Shows configurations for NDI stream and recording">
                <Button
                  size="sm"
                  renderIcon={Connect16}
                  iconDescription="Icon Description"
                  onClick = { () => {
                    this.setState({
                      modalRequested: true
                    })
                  }}
                >
                  Connect to camera server
                </Button>
                <div style={{ margin: "1rem" }}></div>
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
                  this.setState({ waitingForNdiStateChange: true });
                  if (this.state.isNDISending) {
                    await stopNDI();
                    this.setState({ isNDISending: false });
                  } else {
                    await startNDI();
                    this.setState({ isNDISending: true });
                  }
                  this.setState({ waitingForNdiStateChange: false });
                }}
                kind={this.state.isNDISending ? "danger" : "primary"}
                disabled={this.state.waitingForNdiStateChange}
              >
                <Loading
                  description="Configuring NDI"
                  withOverlay={false}
                  small={true}
                  hidden={!this.state.waitingForNdiStateChange}
                  style={{ marginRight: "1rem" }}
                />
                {this.state.isNDISending ? "Stop" : "Start"}
              </Button>
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
                  You can choose auto white balance or customise the temperature
                  and tint, and lock to a grey reference card in 'custom' mode.
                  If "Custom" is greyed out, choose another camera.
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
                  !this.state.whiteBalance.supportsGrey || this.state.wb_isAuto
                }
                onClick={() => {
                  this.setWbLockGrey();
                }}
              >
                Lock grey
              </Button>
              <div style={{ marginBottom: "1rem" }}></div>
              <FormLabel>
                <Tooltip triggerText="If point-of-interest focus and exposure are supported. You can click on the preview to highlight the point of interest.">
                  If they are not supported, choose another camera.
                </Tooltip>
              </FormLabel>
              <p>
                Point of interest highlight is{" "}
                {this.state.poiHighlightSupported
                  ? "supported"
                  : "not supported"}
              </p>
            </Column>
            <Column md={3} lg={7}>
              <h4 style={{ marginBottom: "0.5rem" }}>Preview</h4>
              <WebcamCapture />
            </Column>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

export default IndexPage;
