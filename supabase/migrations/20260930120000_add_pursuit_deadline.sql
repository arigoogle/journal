-- Optional target deadline for a pursuit. Distinct from started_at/ended_at,
-- which track the pursuit's actual lifecycle; deadline_at is just the date
-- the user is aiming for, if any.

alter table pursuits add column deadline_at date;
