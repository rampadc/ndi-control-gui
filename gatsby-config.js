module.exports = {
  siteMetadata: {
    title: "NDI Camera Control",
    baseUrl: "http://192.168.1.154",
    getAllCameras: "http://192.168.1.154/cameras",
    getActiveCamera: "http://192.168.1.154/cameras/active",
    switchCamera: "http://192.168.1.154/cameras/select",
    zoom: "http://192.168.1.154/camera/zoom",
    changeExposureBias: "http://192.168.1.154/camera/exposure/bias",
    enableAutoWhiteBalance: "http://192.168.1.154/camera/white-balance/mode/auto",
    enableCustomWhiteBalance: "http://192.168.1.154/camera/white-balance/mode/locked",
    getWbTemperatureAndTint: "http://192.168.1.154/camera/white-balance/temp-tint",
    setWbTemperatureAndTint: "http://192.168.1.154/camera/white-balance/temp-tint",
    setWbOnRefGrey: "http://192.168.1.154/camera/white-balance/grey",
    hideControlsOnScreen: "http://192.168.1.154/controls/hide",
    showControlsOnScreen: "http://192.168.1.154/controls/show",
    startNDI: "http://192.168.1.154/ndi/start",
    stopNDI: "http://192.168.1.154/ndi/stop",
  },
  plugins: ["gatsby-plugin-sass"],
};
