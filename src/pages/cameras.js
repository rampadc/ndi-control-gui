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
import { getActiveCamera, getAllCameras, switchCamera } from "../utils/camera-service";
import * as _ from "lodash";

class CamerasPage extends React.Component {
  state = {
    cameras: [],
    cameraName: "",
    activeCameraUniqueID: "",
    previewCameraUniqueID: ""
  };

  async componentDidMount() {
    let cameras = await getAllCameras();
    this.setState({cameras: cameras});

    let active = await getActiveCamera();
    this.setState({
      activeCameraUniqueID: active.properties.uniqueID,
      previewCameraUniqueID: active.properties.uniqueID,
      cameraName: active.properties.localizedName
    });
  }

  preformatCameraJson(uniqueID) {
    let cameraHtml = JSON.stringify(_.find(this.state.cameras, (c) => {
      return c.properties.uniqueID === uniqueID;
    }), null, 2);
    return cameraHtml;
  }

  switchCamera() {
    switchCamera(this.state.previewCameraUniqueID);
    this.setState({
      activeCameraUniqueID: this.state.previewCameraUniqueID
    });
  }

  render() {
    return (
      <Layout activeCamera={this.state.cameraName}>
        <Grid narrow style={{ marginLeft: "unset", marginRight: "unset" }}>
          <Row>
            <Column lg={4}>
              <h4 style={{ marginBottom: "1.5rem" }}>Available cameras</h4>
              <FormGroup legendText="Select a camera below to preview its properties. Click Switch to change camera.">
                <RadioButtonGroup
                  defaultSelected="default-selected"
                  legend="Group Legend"
                  name="radio-button-group"
                  orientation="vertical"
                  id="cameras-list-radio-group"
                  valueSelected={this.state.activeCameraUniqueID}
                  onChange={(value) => {
                    this.preformatCameraJson(value);
                    this.setState({previewCameraUniqueID: value});
                  }}
                >
                  {this.state.cameras.map((camera) => (
                    <RadioButton
                      id={camera.properties.uniqueID}
                      labelText={camera.properties.localizedName}
                      key={camera.properties.uniqueID}
                      value={camera.properties.uniqueID}
                    ></RadioButton>
                  ))}
                </RadioButtonGroup>
              </FormGroup>
              <Button onClick={() => {
                this.switchCamera();
              }}>Switch</Button>
            </Column>
            <Column lg={12}>
              <CodeSnippet type="multi" showMoreText>{this.preformatCameraJson(this.state.previewCameraUniqueID)}</CodeSnippet>
            </Column>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

export default CamerasPage;
