export interface NavNode {
  id: number;
  key?: string;
  nodeKey: string;
  parentId: number | null;
  nodeType?: string;
  name?: string;
  title: string;
  depth: number;
  isActive: boolean;
  routeUrl?: string | null;
  icon?: string | null;
  displayOrder?: number;
  children: NavNode[];
}
