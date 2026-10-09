<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EntryController extends Controller
{
    /**
     * Upsert a journal entry by date. This is a best-effort mirror of the
     * primary app's data — called after the real save already succeeded —
     * so it never needs to be more sophisticated than "replace what's here
     * for this date".
     */
    public function store(Request $request): Response
    {
        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'content' => ['required', 'string'],
            'location_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'location_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'image_url' => ['nullable', 'url', 'max:2048'],
        ]);

        $entry = JournalEntry::withTrashed()->firstOrNew(['date' => $data['date']]);
        if ($entry->trashed()) {
            $entry->restore();
        }

        $entry->content = $data['content'];
        $entry->location_lat = $data['location_lat'] ?? $entry->location_lat;
        $entry->location_lng = $data['location_lng'] ?? $entry->location_lng;

        $incomingImageUrl = $data['image_url'] ?? null;
        $previousImagePath = $entry->image_path;

        if ($incomingImageUrl && $incomingImageUrl !== $entry->image_url) {
            $path = $this->downloadImage($incomingImageUrl, $data['date']);
            if ($path) {
                $entry->image_path = $path;
                if ($previousImagePath) {
                    Storage::disk('public')->delete($previousImagePath);
                }
            }
            $entry->image_url = $incomingImageUrl;
        } elseif (! $incomingImageUrl) {
            $entry->image_url = null;
            $entry->image_path = null;
            if ($previousImagePath) {
                Storage::disk('public')->delete($previousImagePath);
            }
        }

        $entry->save();

        return response()->noContent(201);
    }

    public function destroy(string $date): Response
    {
        JournalEntry::where('date', $date)->first()?->delete();

        return response()->noContent();
    }

    /**
     * Fetches the entry's current image and stores a local copy. Failures
     * are logged, not thrown — a missed image copy shouldn't fail the
     * whole backup write, since the text content is the priority.
     */
    private function downloadImage(string $url, string $date): ?string
    {
        try {
            $response = Http::timeout(15)->get($url);
            if (! $response->successful()) {
                Log::warning("Backup image fetch failed for {$date}: HTTP {$response->status()}");

                return null;
            }

            $contentType = $response->header('Content-Type', '');
            $extension = match (true) {
                str_contains($contentType, 'png') => 'png',
                str_contains($contentType, 'webp') => 'webp',
                str_contains($contentType, 'gif') => 'gif',
                default => 'jpg',
            };

            $relativePath = "entries/{$date}-".Str::random(8).".{$extension}";
            Storage::disk('public')->put($relativePath, $response->body());

            return $relativePath;
        } catch (\Throwable $e) {
            Log::warning("Backup image fetch threw for {$date}: {$e->getMessage()}");

            return null;
        }
    }
}
