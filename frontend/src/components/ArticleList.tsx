import type { ArticleData } from "../models/ArticleOutput";

interface ArticleListProps {
  articles: ArticleData[];
  onUpdate: (article:ArticleData) => void; 
  onDelete: (id:number) => void; 
}


export const ArticleList = ({articles,onUpdate,onDelete}:ArticleListProps) => {

  const levelNames: Record<string, string> = {
  basic: "Fiskepass",
  plus: "Fiskeguide",
  full: "Mästerfiskare"
};

    return <>
    
        <ul className="space-y-2">
          {articles.map(article => (
            <li key={article.id} className="border-b py-2">
              <strong>{article.title}</strong> – nivå: {levelNames[article.levelRequired]}
              <button
              onClick={() => onUpdate(article)}>redigera</button>
              <button
              onClick={() => onDelete(article.id)}>ta bort</button>
            </li>
          ))}
        </ul>
      
        </>
};