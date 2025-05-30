import { useState, type ChangeEvent, type FormEvent } from "react";
import { useArticle } from "../hooks/useArticle";
import type { ArticleData, FormType } from "../models/ArticleOutput";
import { ArticleList } from "../components/Articlelist";

export const AdminArticlepage = () => {
  const { articles, isloading, createNewArticle, UpdateArticle, DeleteArticle } = useArticle();
  const [openUpdate, setOpenupdate] = useState<boolean>(false);
  const [UpdateId, setUpdateId] = useState<number>(0);
  const [formData, setFormData] = useState<FormType>({
    title: "",
    content: "",
    levelRequired: "basic",
  });

  const handelUpdate = (article:ArticleData) => {   
    setFormData({
        title: article.title,
        content: article.content,
        levelRequired:article.levelRequired
    })
    setUpdateId(article.id)
    setOpenupdate(true)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(Article => ({ ...Article, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (openUpdate) {
        UpdateArticle(UpdateId,formData)
        }else {
        createNewArticle(formData)
        
        }
    } catch (error) {
      console.error("Kunde inte skapa artikel:", error);
    } finally {
        setFormData({ title: "", content: "", levelRequired: "basic" });
        setOpenupdate(false)
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-lime-500">
      <h1 className="text-2xl font-bold mb-4">Admin – Artiklar</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Titel</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Innehåll</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Åtkomstnivå</label>
          <select
            name="levelRequired"
            value={formData.levelRequired}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="basic">Basic</option>
            <option value="plus">Plus</option>
            <option value="full">Full</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
         {!openUpdate ? "Skapa artikel" : "updatera"}
        </button>
      </form>

      {isloading ? (
        <p>Laddar artiklar...</p>
      ) : 
        <ArticleList articles={articles} onUpdate={handelUpdate} onDelete={DeleteArticle}/>
      }
    </div>
  );
};
