-- ===================================================================
-- QA-Platform ERP - Contextual Help Schema
 

DROP TABLE IF EXISTS help_details CASCADE;
DROP TABLE IF EXISTS help_headers CASCADE;

CREATE TABLE help_headers (
    id BIGSERIAL PRIMARY KEY,
    node_id BIGINT NOT NULL REFERENCES nav_nodes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Quick steps',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uk_help_header_node UNIQUE (node_id)
);

CREATE INDEX idx_help_headers_node ON help_headers(node_id);
CREATE INDEX idx_help_headers_active ON help_headers(is_active);

CREATE TABLE help_details (
    id BIGSERIAL PRIMARY KEY,
    help_header_id BIGINT NOT NULL REFERENCES help_headers(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    step_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_help_step_number CHECK (step_number > 0),
    CONSTRAINT uk_help_detail_step UNIQUE (help_header_id, step_number)
);

CREATE INDEX idx_help_details_header ON help_details(help_header_id);
