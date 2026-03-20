import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { Recipe, Playlist } from "./types";

function App() {
  const [useLlm, setUseLlm] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => setUseLlm(data.use_llm));
  }, []);

  const handleSearchRecipe = async (value: string): Promise<void> => {
    setSearchTerm(value);
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

  const handleSearchPlaylist = async (value: string): Promise<void> => {
    if (value.trim() === "") {
      setPlaylists([]);
      return;
    }
    const response = await fetch(
      `/api/playlists?name=${encodeURIComponent(value)}`,
    );
    const data: Playlist[] = await response.json();
    setPlaylists(data);
  };

  if (useLlm === null) return <></>;

  return <RouterProvider router={router} />;
}

export default App;
