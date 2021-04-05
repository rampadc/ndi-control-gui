import { Select, SelectItem } from "carbon-components-react";
import React from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      <Webcam
        audio={false}
        videoConstraints={{ deviceId: deviceId }}
        onUserMediaError={console.log}
        style={{width: '100%'}}
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
