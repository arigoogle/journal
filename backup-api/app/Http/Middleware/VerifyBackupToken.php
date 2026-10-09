<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class VerifyBackupToken
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $expected = Config::get('services.backup.token');
        $given = $request->bearerToken();

        if (! $expected || ! $given || ! hash_equals($expected, $given)) {
            abort(401, 'Invalid or missing backup token.');
        }

        return $next($request);
    }
}
