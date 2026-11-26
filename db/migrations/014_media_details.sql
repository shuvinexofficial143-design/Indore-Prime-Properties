ALTER TABLE property_media DROP CONSTRAINT property_media_kind_check;
ALTER TABLE property_media ADD CONSTRAINT property_media_kind_check CHECK(kind IN ('photo','floor_plan','brochure','model','panorama','video'));
ALTER TABLE property_media ADD COLUMN room_label text NOT NULL DEFAULT '' CHECK(length(room_label)<=80);
ALTER TABLE property_media ADD COLUMN caption text NOT NULL DEFAULT '' CHECK(length(caption)<=500);
ALTER TABLE property_media ADD COLUMN is_cover boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX property_media_one_cover ON property_media(organization_id,property_id) WHERE is_cover;
