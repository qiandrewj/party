import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import imgIlFullxfull583331023062SzRemovebgPreview6 from "../assets/food.png";
import Chat from "../Chat";
import { Recipe } from "../types";

export function InputPage() {
  const navigate = useNavigate();
  const [themeWords, setThemeWords] = useState("");
  const [keyword1, setKeyword1] = useState("");
  const [keyword2, setKeyword2] = useState("");
  const [length, setLength] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [useLlm, setUseLlm] = useState<boolean | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => setUseLlm(data.use_llm))
      .catch(() => setUseLlm(false));
  }, []);

  const handleSearch = async (value: string): Promise<void> => {
    if (value.trim() === "") {
      setRecipes([]);
      return;
    }
    const response = await fetch(
      `/api/recipes?name=${encodeURIComponent(value)}`,
    );
    const data: Recipe[] = await response.json();
    setRecipes(data);
  };

  const handleGetHosting = () => {
    navigate("/loading");
  };

  return (
    <div
      className="bg-[#fffef9] relative size-full min-h-screen px-4 sm:px-0"
      data-name="input screen"
    >
      <p className="absolute font-alatsi leading-[normal] left-4 sm:left-[143px] not-italic text-[#d43c00] text-[40px] sm:text-[50px] top-[80px] sm:top-[120px] tracking-[-0.5px] whitespace-nowrap">
        BRING THE PARTY
      </p>

      <div className="absolute font-source-serif font-normal leading-[0] left-4 sm:left-[143px] text-[#623926] text-[0px] text-[20px] sm:text-[30px] top-[140px] sm:top-[190px] right-4 sm:w-[900px]">
        <p className="mb-0">
          <span className="font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[#623926]">
            "
          </span>
          <span className="leading-[28px] sm:leading-[38px]">
            i'm looking to host a{" "}
          </span>
          <input
            type="text"
            value={themeWords}
            onChange={(e) => setThemeWords(e.target.value)}
            placeholder="theme words"
            className="[text-decoration-skip-ink:none] decoration-solid font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[20px] sm:text-[30px] text-[#d43c00] underline bg-transparent border-none outline-none placeholder:text-[#d43c00] placeholder:opacity-70 inline-block w-[140px] sm:w-[200px]"
          />
          <span className="leading-[28px] sm:leading-[38px]">
            {" "}
            dinner party. i want the party to follow a{" "}
          </span>
          <input
            type="text"
            value={keyword1}
            onChange={(e) => setKeyword1(e.target.value)}
            placeholder="keyword"
            className="[text-decoration-skip-ink:none] decoration-solid font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[20px] sm:text-[30px] text-[#d43c00] underline bg-transparent border-none outline-none placeholder:text-[#d43c00] placeholder:opacity-70 inline-block w-[100px] sm:w-[130px]"
          />
          <span className="leading-[28px] sm:leading-[38px]">
            {" "}
            theme and use{" "}
          </span>
          <input
            type="text"
            value={keyword2}
            onChange={(e) => setKeyword2(e.target.value)}
            placeholder="keyword"
            className="[text-decoration-skip-ink:none] decoration-solid font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[20px] sm:text-[30px] text-[#d43c00] underline bg-transparent border-none outline-none placeholder:text-[#d43c00] placeholder:opacity-70 inline-block w-[100px] sm:w-[130px]"
          />
          <span className="leading-[28px] sm:leading-[38px]">
            {" "}
            decor. i want my menu to take{" "}
          </span>
          <input
            type="text"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="length"
            className="[text-decoration-skip-ink:none] decoration-solid font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[20px] sm:text-[30px] text-[#d43c00] underline bg-transparent border-none outline-none placeholder:text-[#d43c00] placeholder:opacity-70 inline-block w-[90px] sm:w-[110px]"
          />
          <span className="leading-[28px] sm:leading-[38px]">
            {" "}
            amount of time to cook. i want to use{" "}
          </span>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="ingredients"
            className="[text-decoration-skip-ink:none] decoration-solid font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[20px] sm:text-[30px] text-[#d43c00] underline bg-transparent border-none outline-none placeholder:text-[#d43c00] placeholder:opacity-70 inline-block w-[130px] sm:w-[160px]"
          />
          <span className="leading-[28px] sm:leading-[38px]">
            {" "}
            in my recipe.
          </span>
          <span className="font-source-serif font-normal italic leading-[28px] sm:leading-[38px] text-[#623926]">
            "
          </span>
        </p>
        <p className="leading-[28px] sm:leading-[38px]">&nbsp;</p>
      </div>

      <div className="absolute contents left-4 sm:left-[143px] top-[380px] sm:top-[420px]">
        <div className="absolute bg-[#f6f2e1] h-[44px] sm:h-[50px] left-4 sm:left-[143px] top-[380px] sm:top-[420px] w-[120px] sm:w-[140px] rounded cursor-pointer hover:bg-[#ebe5ce] transition-colors" />
        <p className="absolute font-alatsi leading-[normal] left-[20px] sm:left-[157px] not-italic text-[#623926] text-[18px] sm:text-[20px] top-[390px] sm:top-[432px] tracking-[-0.2px] pointer-events-none">
          FILTER ONE
        </p>
      </div>

      <div className="absolute contents left-[140px] sm:left-[300px] top-[380px] sm:top-[420px]">
        <div className="absolute bg-[#f6f2e1] h-[44px] sm:h-[50px] left-[140px] sm:left-[300px] top-[380px] sm:top-[420px] w-[120px] sm:w-[140px] rounded cursor-pointer hover:bg-[#ebe5ce] transition-colors" />
        <p className="absolute font-alatsi leading-[normal] left-[156px] sm:left-[314px] not-italic text-[#623926] text-[18px] sm:text-[20px] top-[390px] sm:top-[432px] tracking-[-0.2px] pointer-events-none">
          FILTER TWO
        </p>
      </div>

      <div className="absolute contents left-4 sm:left-[143px] top-[440px] sm:top-[485px]">
        <div className="absolute bg-[#f6f2e1] h-[44px] sm:h-[50px] left-4 sm:left-[143px] top-[440px] sm:top-[485px] w-[150px] sm:w-[180px] rounded cursor-pointer hover:bg-[#ebe5ce] transition-colors" />
        <p className="absolute font-alatsi leading-[normal] left-[22px] sm:left-[160px] not-italic text-[#623926] text-[18px] sm:text-[20px] top-[450px] sm:top-[497px] tracking-[-0.2px] pointer-events-none">
          FILTER THREE
        </p>
      </div>

      <div
        className="hidden sm:block absolute h-[150px] lg:h-[180px] right-[50px] lg:right-[100px] top-[400px] lg:top-[450px] w-[160px] lg:w-[200px]"
        data-name="il_fullxfull.5833310230_62sz-removebg-preview 6"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt="decorative illustration"
            className="absolute h-[438.24%] left-[-328.18%] max-w-none top-[-228.43%] w-[508.18%]"
            src={imgIlFullxfull583331023062SzRemovebgPreview6}
          />
        </div>
      </div>

      <button
        onClick={handleGetHosting}
        className="absolute font-source-serif font-normal italic leading-[38px] right-4 sm:right-auto sm:left-[143px] lg:left-auto lg:right-[100px] text-[#d43c00] text-[20px] sm:text-[24px] top-[510px] sm:top-[560px] whitespace-nowrap bg-transparent border-none cursor-pointer hover:underline transition-all hover:translate-x-2"
      >
        get hosting →
      </button>

      {/* Recipe results (shown when LLM returns search results) */}
      {recipes.length > 0 && (
        <div className="absolute left-4 sm:left-[143px] top-[620px] sm:top-[660px] right-4 sm:w-[700px] flex flex-col gap-4">
          {recipes.map((recipe, index) => (
            <div key={index} className="p-4 bg-[#f6f2e1] rounded-lg">
              <p className="font-alatsi text-[#d43c00] text-[18px] mb-1">
                {recipe.name}
              </p>
              <p className="font-source-serif text-[#623926] text-[14px] leading-relaxed mb-1">
                {recipe.description}
              </p>
              <p className="font-source-serif text-[#623926] text-[13px] opacity-70">
                Minutes: {String(recipe.minutes)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chat (only when USE_LLM = True in routes.py) */}
      {useLlm && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Chat onSearchTerm={handleSearch} />
        </div>
      )}
    </div>
  );
}
