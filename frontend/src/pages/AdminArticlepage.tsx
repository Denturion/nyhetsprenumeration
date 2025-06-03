import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useArticle } from "../hooks/useArticle";
import type { ArticleData, FormType } from "../models/ArticleOutput";
import { ArticleList } from "../components/ArticleList";


export const AdminArticlepage = () => {
  const { articles, isloading,totalPages, createNewArticle, UpdateArticle, DeleteArticle, getallArticles } = useArticle();
  const [openUpdate, setOpenupdate] = useState<boolean>(false);
  const [UpdateId, setUpdateId] = useState<number>(0);
  const [pagenumber,setPagenumber] = useState<number>(1)
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState<FormType>({
    title: "",
    content: "",
    levelRequired: "basic",
  });
  
   useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue)
      getallArticles(1,undefined,inputValue)
    }, 800);
    return () => clearTimeout(timeout);
  }, [inputValue]);



const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newLevel = e.target.value;
  setSelectedLevel(newLevel)
  getallArticles(1,newLevel,searchQuery);
};

 const handlePage = (direction: 'prev' | 'next') => {
  if (pagenumber === totalPages && direction === "next"){
    return
  }
  setPagenumber(prev => {
    const nextPage = direction === 'next' ? prev + 1 : Math.max(1, prev - 1);
    getallArticles(nextPage,selectedLevel,searchQuery);
    return nextPage;
  });
 };



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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 max-w-4xl mx-auto">
  <h1 className="text-2xl font-bold mb-6 text-white text-center">Admin – Artiklar</h1>

  <form
    onSubmit={handleSubmit}
    className="bg-gray-800 shadow-md p-6 rounded-lg mb-6 space-y-4"
  >
    <div>
      <label className="block mb-1 font-medium text-gray-200">Titel</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-200">Innehåll</label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        required
        className="w-full h-64 bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-200">Åtkomstnivå</label>
      <select
        name="levelRequired"
        value={formData.levelRequired}
        onChange={handleChange}
        className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
      >
        <option value="basic">Fiskepass</option>
        <option value="plus">Fiskeguide</option>
        <option value="full">Mästerfiskare</option>
      </select>
    </div>

    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
    >
      {!openUpdate ? "Skapa artikel" : "Uppdatera"}
    </button>
  </form>

  {isloading ? (
    <p className="text-gray-400">Laddar artiklar...</p>
  ) : (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row gap-4 mb-4">
        <select
          name="sort-passes"
          id="sort-passes"
          onChange={handleLevelChange}
          className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
        >
          <option value="">--Filter--</option>
          <option value="basic">Fiskepass</option>
          <option value="plus">Fiskeguide</option>
          <option value="full">Mästerfiskare</option>
        </select>
        <input
          placeholder="Sök på titel"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {articles.length === 0 ? (
        <p className="text-red-400">Kunde inte hitta några artiklar</p>
      ) : (
        <ArticleList articles={articles} onUpdate={handelUpdate} onDelete={DeleteArticle} />
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePage("prev")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Föregående
        </button>
        <button
          onClick={() => handlePage("next")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Nästa
        </button>
      </div>
    </div>
  )}
</div>

  );
};
