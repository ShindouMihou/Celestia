import logger from "$lib/logger";

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

    logger.error({
        errors: [
            {
                message: telemetry.message,
                page: telemetry.page,
                severity: telemetry.severity
            }
        ]
    })

    return {
        status: 204,
        body: {}
    };
}