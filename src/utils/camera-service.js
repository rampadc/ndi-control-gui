import fetch from 'isomorphic-fetch';

const baseUrl = 'http://192.168.1.154';

function handleErrors(response) {
    if (response.status === 400) {
        throw new Error("400 Bad Request");
    } else if (response.status === 500) {
        throw new Error("500 Internal Server Error");
    } else if (response.status === 501) {
        throw new Error("501 Not Implemented");
    } else if (response.status === 503) {
        throw new Error("503 Service Unavailable");
    } else {
        throw new Error(`Unexpected HTTP status code ${response.status}`);
    }
}

export async function getActiveCamera() {
    var activeCamera = null;

    try {
        let response = await fetch(`${baseUrl}/cameras/active`);
        if (response.status !== 200) {
            handleErrors(response);
        } else {
            activeCamera = await response.json();
            return activeCamera;
        }
    } catch(error) {
        throw new Error('Cannot get active cameras')
    }
}

export async function getTempTint() {
    try {
        let response = await fetch(`${baseUrl}/camera/white-balance/temp-tint`);
        if (response.status !== 200) {
            handleErrors(response);
        } else {
            let tempTint = await response.json();
            return tempTint;
        }
    } catch(error) {
        throw new Error('Cannot get temperature and tint')
    }
}

export async function getAllCameras() {
    try {
        let response = await fetch(`${baseUrl}/cameras`);
        if (response.status !== 200) {
            handleErrors(response);
        } else {
            let cameras = await response.json();
            return cameras;
        }
    } catch(error) {
        throw new Error('Cannot get list of cameras')
    }
}

export async function setZoom(zoom) {
    let form = new URLSearchParams();
    form.append('zoomFactor', zoom);
    try {
        let response = await fetch(`${baseUrl}/camera/zoom`, {
            method: 'POST',
            body: form
        });
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot zoom');
    }   
}

export async function setExposureBias(bias) {
    let form = new URLSearchParams();
    form.append('bias', bias);
    try {
        let response = await fetch(`${baseUrl}/camera/exposure/bias`, {
            method: 'POST',
            body: form
        });
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot zoom');
    }   
}

export async function startNDI() {
    try {
        let response = await fetch(`${baseUrl}/ndi/start`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot get list of cameras')
    }
}

export async function stopNDI() {
    try {
        let response = await fetch(`${baseUrl}/ndi/stop`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot get list of cameras')
    }
}

export async function switchCamera(uniqueID) {
    let form = new URLSearchParams();
    form.append('uniqueID', uniqueID);
    try {
        let response = await fetch(`${baseUrl}/cameras/select`, {
            method: 'POST',
            body: form
        });
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot zoom');
    }   
}

export async function setWbModeLocked() {
    try {
        let response = await fetch(`${baseUrl}/camera/white-balance/mode/locked`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot get lock white balance mode')
    }
}

export async function setWbModeAuto() {
    try {
        let response = await fetch(`${baseUrl}/camera/white-balance/mode/auto`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        throw new Error('Cannot get switch to auto white balance')
    }
}

export async function setWbTempTint(temperature, tint) {
    let form = new URLSearchParams();
    form.append('temperature', parseFloat(temperature));
    form.append('tint', parseFloat(tint));

    try {
        let response = await fetch(`${baseUrl}/camera/white-balance/temp-tint`, {
            method: 'POST',
            body: form
        });
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        console.error(error);
        // throw new Error('Cannot set temp/tint');
    }   
}

export async function setWbLockGrey() {
    try {
        let response = await fetch(`${baseUrl}/camera/white-balance/grey`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        console.error(error); 
    }
}

export async function getNDIStatus() {
    try {
        let response = await fetch(`${baseUrl}/ndi/status`);
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
          let hasStarted = await response.json();
          return hasStarted.started;
        }
    } catch(error) {
        console.error(error); 
    }
}

export async function highlight(x, y) {
    let form = new URLSearchParams();
    form.append('x', x);
    form.append('y', y);

    try {
        let response = await fetch(`${baseUrl}/camera/focus`, {
            method: 'POST',
            body: form
        });
        if (response.status !== 200) {
            handleErrors(response);
            return false;
        } else {
            return true;
        }
    } catch(error) {
        console.error(error);
    }   
}