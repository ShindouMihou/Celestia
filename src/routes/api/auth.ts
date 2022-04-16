import configuration from "$lib/configuration";
import cookieSignature from 'cookie-signature';

export async function post({ request, locals }) {
    const body = await request.json();

    if (!body.token) return {
        status: 400,
        body: {
            errors: [
                "Invalid body request."
            ]
        }
    }

    if (body.token !== configuration('ACCESS_TOKEN')) return {
        status: 401,
        body: {
            errors: [
                "Invalid access token."
            ]
        }
    }

    const signed = cookieSignature.sign(body.token, configuration('APP_SIGNATURE'));

    return {
        status: 204,
        body: {},
        headers: {
            'set-cookie': `firefly=${signed}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}`
        }
    }
}