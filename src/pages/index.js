import * as React from "react";
import Layout from "../components/layout";
import {
  Button,
  Column,
  Form,
  FormGroup,
  Grid,
  Row,
  Select,
  SelectItem,
  Slider,
  TextInput,
  Toggle,
} from "carbon-components-react";

// Polyfills for IE11
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.array.fill";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.string.trim";
import "core-js/modules/es7.object.values";

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
                <Select style={{marginBottom: '16px'}}
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
                <Toggle labelText="Audio" defaultToggled id="ndi-audio-toggle"  style={{marginBottom: '16px'}}/>
              </FormGroup>
              <Button>Start stream</Button>
            </Form>
          </Column>
          <Column sm={2} md={3} lg={6}>
            <h4 style={{ marginBottom: "0.5rem" }}>Camera Control</h4>
            <FormGroup>
              <Slider
                labelText="Zoom"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                novalidate
                style={{width: '100%'}}
              />
              <Slider
                labelText="Exposure bias"
                value={50}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                novalidate
              />
            </FormGroup>
          </Column>
          <Column sm={1} md={3} lg={6}>
            <h4 style={{ marginBottom: "0.5rem" }}>Preview</h4>
          </Column>
        </Row>
      </Grid>
    </Layout>
  );
};

export default IndexPage;
