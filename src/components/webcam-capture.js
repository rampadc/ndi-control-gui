import { Select, SelectItem } from "carbon-components-react";
import React from "react";
import Webcam from "react-webcam";
import { highlight } from "../utils/camera-service";

const WebcamCapture = () => {
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);
  const [webcamViewer, setWebcamViwer] = React.useState({});

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
    setWebcamViwer(document.getElementById('webcam-view'));
  }, [handleDevices]);

  return (
    <>
      <Webcam
        audio={false}
        videoConstraints={{ deviceId: deviceId }}
        onUserMediaError={console.log}
        style={{width: '100%'}}
        onClick={(event) => {
          let rect = webcamViewer.getBoundingClientRect();
          let highlightX = (event.pageX - rect.x)/rect.width;
          let highlightY = (event.pageY - rect.y)/rect.height;
          highlight(highlightX, highlightY);
        }}
        id='webcam-view'
      />
      <Select
        helperText="Select a webcam to preview NDI stream, requires NDI tools to be installed."
        id="camera-select"
        invalidText="A valid value is required"
        labelText="Webcam"
        onChange={({ nativeEvent }) => {
          let value = nativeEvent.target.value;
          setDeviceId(value);
        }}
      >
        {devices.map((device, key) => {
          return (
            <SelectItem text={device.label} value={device.deviceId} key={key} />
          );
        })}
      </Select>
    </>
  );
};

export default WebcamCapture;
