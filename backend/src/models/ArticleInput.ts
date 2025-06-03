export interface ArticleInput {
  id?:number;
  title: string;
  content: string;
  levelRequired: "basic" | "plus" | "full";
  createdAt?:string
}