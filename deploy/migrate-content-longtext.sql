-- Run once on existing MilesWeb DB if site_content.payload is still JSON type.
-- Removes JSON_VALID constraint that caused error #4025 on large PRD content imports.

ALTER TABLE site_content MODIFY payload LONGTEXT NOT NULL;
