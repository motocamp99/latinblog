// Hardcoded credentials (replace with env vars later)
const TEST_EMAIL = 'artoris99@gmail.com';
const TEST_PASSWORD = 'ddgs@@ddfd@@we@@234ffgd.df';

export default defineEventHandler(async (event) => {
    // 1. Make the raw POST request to the external API (identical to your client-side version)
    const response = await $fetch.raw('https://bknd.motocamp99.workers.dev/api/auth/password/login', {
        method: 'POST',
        headers:{
            'Accept':'application/json'
        },
        body: {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        },
        // Ensure headers/cookies are preserved
        ignoreResponseError: true,  // Prevents Nuxt from throwing on non-2xx responses
    });

    // 2. Extract the response data and cookies
    const cookies = response.headers.get('Set-Cookie');
    const responseData = response._data;
    console.log('coookies', cookies)

    // 3. Manually set the cookies on the client (browser)
    /*
    if (cookies) {
        setResponseHeader(event, 'Set-Cookie', cookies);
    }*/

    // 4. Return the SAME structure as your client-side version
    return {
        data: responseData,
        cookies: cookies,  // Explicitly expose cookies in the response
    };
});


