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
import { getActiveCamera, getAllCameras } from "../utils/camera-service";
import * as _ from "lodash";

class CamerasPage extends React.Component {
  state = {
    cameras: [],
    activeCameraUniqueID: "",
    previewCameraUniqueID: ""
  };

  componentDidMount() {
    getAllCameras().then((cameras) => {
      this.setState({cameras: cameras});
    });

    getActiveCamera().then((activeCamera) => {
      this.setState({activeCameraUniqueID: activeCamera.properties.uniqueID});
      this.setState({previewCameraUniqueID: activeCamera.properties.uniqueID});
    });
  }

  render() {
    return (
      <Layout>
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
                  onChange={(value) => {this.setState({previewCameraUniqueID: value})}}
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
              <Button>Switch</Button>
            </Column>
            <Column lg={12}>
              <CodeSnippet type="multi">{JSON.stringify(_.find(this.state.cameras, (c) => {
                return c.properties.uniqueID === this.state.previewCameraUniqueID;
              }), null, 2)}</CodeSnippet>
            </Column>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

export default CamerasPage;
