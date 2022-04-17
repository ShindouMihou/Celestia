import type { AxiosError } from "axios";
import axios from "axios";

export const reportTelemetry = (window: Window & typeof globalThis, message: Object, severity: Number) => {
    axios.post('/api/telemetry', {
        message: message,
        page: window ? window.location.href : 'not applicable',
        severity: severity
    }); // Ignore the result since it shouldn't send a result.
}

export const catchAxiosError = (window: Window & typeof globalThis, err: AxiosError) => {
    if (err.response) {
        reportTelemetry(window, {
            error: err,
            response: err.response
        }, 2);
        switch(err.response.status) {
            case 401: setTimeout(() => window.location.href = '/gateway', 1500);
            case 500: {
                console.error(err.response)
            };
        }
    } else {
        reportTelemetry(window, err, 2);
        console.error(err);
    }
}