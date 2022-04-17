/** @type {import('./items').RequestHandler} */
export async function post({ request, locals }) {
    const telemetry = await request.json();

    if (!(telemetry.severity || telemetry.message)) {
        return {
            status: 400,
            body: {
                errors: [
                    "Invalid request body."
                ]
            }
        };
    }

    console.error(`REPORT ${telemetry.page}; ${telemetry.severity};`)
    console.log(telemetry.message)
    console.error(`END REPORT ${telemetry.page}; ${telemetry.severity}`)

    return {
        status: 204,
        body: {}
    };
}