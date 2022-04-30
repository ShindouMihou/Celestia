
import configuration from '$lib/configuration';
import cookie from 'cookie';
import cookieSignature from 'cookie-signature';

export async function handle({ event, resolve }) {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '')
    const token = cookies.firefly;
    let signed = false;

    let url = new URL(event.request.url);

    console.log(`${event.request.method} ${url.href}; ${event.request.headers.get('user-agent')};`)

    event.locals = {
        authenticated: false
    }

    // Making sure that the cookie is signed from us.
    if (token && !url.pathname.includes('/api/auth')) {
        const unsigned = cookieSignature.unsign(token, configuration('APP_SIGNATURE'));
        if (!unsigned || unsigned !== configuration('ACCESS_TOKEN')) {
            signed = false;
        } else {
            signed = true;
            event.locals = {
                authenticated: true
            }
        }
    }
    const response = await resolve(event);

    if (token && !signed) {
        response.headers.append('Set-Cookie', 'firefly=; Path=/; Max-Age=-1');
    }

    const origin = url.protocol + "//" + url.host;
    
    if (!signed && (url.pathname.includes('/dashboard') || (url.pathname.includes('/api') && !url.pathname.includes('/api/auth')))) {
        return new Response('', { status: 303, headers: {
            Location: origin+"/gateway",
            'Set-Cookie': 'firefly=; Path=/; Max-Age=-1'
        }});
    }

    if (signed && (url.pathname.includes('/gateway') || url.pathname === '/')) {
        return new Response('', { status: 303, headers: {
            Location: origin+"/dashboard"
        }});
    }

    return response;
}

export async function getSession(event) {
    return {
        url: event.locals.url
    }
}