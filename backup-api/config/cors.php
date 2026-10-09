<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['POST', 'DELETE'],

    // Exact origins allowed to call this API — the Vite dev server and the
    // app's production domain. Comma-separated via env so it's editable
    // without a code change on the server.
    'allowed_origins' => array_values(array_filter(
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173'))
    )),

    // Vercel preview deployments get a unique *.vercel.app URL per build,
    // so they're matched by pattern instead of being listed individually.
    'allowed_origins_patterns' => array_values(array_filter(
        explode(',', env('CORS_ALLOWED_ORIGIN_PATTERNS', ''))
    )),

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
