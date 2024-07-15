export interface BlogPostInfo {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly date: string;
  readonly description: string;
}

export type TableRowData = readonly string[][];
