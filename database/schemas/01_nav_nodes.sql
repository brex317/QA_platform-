-- ===================================================================
-- QA-Platform ERP - Navigation Nodes Schema
-- ===================================================================
-- Purpose: Dynamic, database-driven hierarchical navigation structure
-- Version: 1.0
-- Created: 2026-09-08
-- ===================================================================

-- Drop table if exists (for clean re-creation)
DROP TABLE IF EXISTS nav_nodes CASCADE;

-- Create nav_nodes table
CREATE TABLE nav_nodes (
    id BIGSERIAL PRIMARY KEY,
    node_key VARCHAR(150) NOT NULL UNIQUE,
    parent_id BIGINT REFERENCES nav_nodes(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    route_url VARCHAR(255),
    icon VARCHAR(80),
    display_order INT DEFAULT 0,
    depth INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT chk_nav_depth CHECK (depth > 0),
    CONSTRAINT chk_nav_display_order CHECK (display_order >= 0)
);

-- Create indexes for performance
CREATE INDEX idx_nav_nodes_parent ON nav_nodes(parent_id);
CREATE INDEX idx_nav_nodes_key ON nav_nodes(node_key);
CREATE INDEX idx_nav_nodes_active ON nav_nodes(is_active);
CREATE INDEX idx_nav_nodes_depth ON nav_nodes(depth);
CREATE INDEX idx_nav_nodes_display_order ON nav_nodes(display_order);

-- Add comments for documentation
COMMENT ON TABLE nav_nodes IS 'Stores hierarchical navigation menu structure for the entire application';
COMMENT ON COLUMN nav_nodes.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN nav_nodes.node_key IS 'Unique identifier for the node (e.g., "hrms.payroll.dashboard")';
COMMENT ON COLUMN nav_nodes.parent_id IS 'Self-referencing foreign key for hierarchical structure';
COMMENT ON COLUMN nav_nodes.title IS 'Display name in the navigation menu';
COMMENT ON COLUMN nav_nodes.route_url IS 'Angular route path (null for parent nodes)';
COMMENT ON COLUMN nav_nodes.icon IS 'Icon identifier/class name';
COMMENT ON COLUMN nav_nodes.display_order IS 'Sort order within parent group';
COMMENT ON COLUMN nav_nodes.depth IS 'Level in hierarchy (1 = root, 2 = child, etc.)';
COMMENT ON COLUMN nav_nodes.is_active IS 'Soft delete flag';

-- ===================================================================
-- Verification Query
-- ===================================================================
-- Run this query to verify table creation:
-- SELECT table_name, column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'nav_nodes'
-- ORDER BY ordinal_position;
-- ===================================================================
