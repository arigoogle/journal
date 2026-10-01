-- Optional coordinates captured (best-effort, via the browser's
-- Geolocation API) once, when a journal entry is first created — so you can
-- later see roughly where an entry was written. Never backfilled or
-- overwritten on subsequent edits of the same entry.

alter table journal_entries add column location_lat double precision;
alter table journal_entries add column location_lng double precision;
