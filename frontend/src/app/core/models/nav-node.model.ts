export interface NavNode {
  id: number;
  nodeKey: string;
  parentId: number | null;
  name?: string;  // Alias for title
  title: string;
  routeUrl: string | null;
  icon: string | null;
  displayOrder: number;
  depth: number;
  isActive: boolean;
  children: NavNode[];
}
