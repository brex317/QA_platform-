

-- Recreate fresh, parents before children
CREATE TABLE nav_nodes (
    id           BIGSERIAL PRIMARY KEY,
    key          VARCHAR(150) NOT NULL UNIQUE,
    parent_id    BIGINT REFERENCES nav_nodes(id) ON DELETE CASCADE,
    node_type    VARCHAR(20) NOT NULL,
    name         VARCHAR(150) NOT NULL,
    depth        INT NOT NULL,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ,
    created_by   VARCHAR(100),
    updated_by   VARCHAR(100),
    CONSTRAINT chk_nav_node_type CHECK (node_type IN ('MODULE','SUBMODULE','FEATURE')),
    CONSTRAINT chk_nav_depth CHECK (depth > 0)
);
CREATE INDEX idx_nav_nodes_parent ON nav_nodes(parent_id);
CREATE INDEX idx_nav_nodes_key ON nav_nodes(key);
CREATE INDEX idx_nav_nodes_type ON nav_nodes(node_type);

CREATE TABLE help_headers (
    id            BIGSERIAL PRIMARY KEY,
    node_id       BIGINT NOT NULL REFERENCES nav_nodes(id) ON DELETE CASCADE,
    context_key   VARCHAR(50) NOT NULL DEFAULT 'page',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ,
    created_by    VARCHAR(100),
    updated_by    VARCHAR(100),
    CONSTRAINT uk_help_header UNIQUE (node_id, context_key)
);
CREATE INDEX idx_help_headers_node ON help_headers(node_id);
CREATE INDEX idx_help_headers_node_context ON help_headers(node_id, context_key);

CREATE TABLE help_steps (
    id               BIGSERIAL PRIMARY KEY,
    help_header_id   BIGINT NOT NULL REFERENCES help_headers(id) ON DELETE CASCADE,
    step_number      INT NOT NULL,
    step_text        TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_help_step_number CHECK (step_number > 0),
    CONSTRAINT uk_help_step UNIQUE (help_header_id, step_number)
);
CREATE INDEX idx_help_steps_header ON help_steps(help_header_id);

COMMIT;