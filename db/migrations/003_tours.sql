ALTER TABLE property_media ADD CONSTRAINT property_media_tenant_property_id UNIQUE(organization_id,property_id,id);
CREATE TABLE panorama_hotspots(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,
 source_id uuid NOT NULL,target_id uuid NOT NULL,label text NOT NULL CHECK(length(label) BETWEEN 1 AND 80),
 yaw numeric NOT NULL CHECK(yaw BETWEEN -180 AND 180),pitch numeric NOT NULL CHECK(pitch BETWEEN -85 AND 85),
 CHECK(source_id<>target_id),
 FOREIGN KEY(organization_id,property_id,source_id) REFERENCES property_media(organization_id,property_id,id),
 FOREIGN KEY(organization_id,property_id,target_id) REFERENCES property_media(organization_id,property_id,id)
);
CREATE INDEX panorama_hotspots_property_idx ON panorama_hotspots(organization_id,property_id);
