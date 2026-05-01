import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import table2 from "../assets/table2.png";
import { Recipe, Playlist, PlaylistRecommendations } from "../types";

const loadingMessages = [
  "setting the table",
  "finalizing the menu",
  "sending out invites",
  "selecting the perfect playlist",
  "choosing the decor",
];

export function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [dots, setDots] = useState("");
  const [isTypingDots, setIsTypingDots] = useState(false);

  useEffect(() => {
    const currentMessage = loadingMessages[messageIndex];
    let charIndex = 0;

    // Type out the message
    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTypingDots(true);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [messageIndex]);

  useEffect(() => {
    if (!isTypingDots) return;

    let dotCount = 0;
    const dotInterval = setInterval(() => {
      if (dotCount < 3) {
        dotCount++;
        setDots(" .".repeat(dotCount));
      } else {
        clearInterval(dotInterval);
        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
          setDisplayText("");
          setDots("");
          setIsTypingDots(false);
        }, 300);
      }
    }, 400);

    return () => clearInterval(dotInterval);
  }, [isTypingDots]);

  useEffect(() => {
    const { query, recipeUrl, ...inputState } = (location.state ?? {}) as {
      query: string;
      recipeUrl: string;
      [key: string]: unknown;
    };
    const q = query || "food";
    const url = recipeUrl || `/api/recipes/svd?name=${encodeURIComponent(q)}`;

    const fetchData = async () => {
      try {
        // Fetch recipes first
        const recipesRes = await fetch(url);
        const recipesData = await recipesRes.json();

        // Handle new response format with query and recipes
        let fetchedRecipes: Recipe[] = [];
        if (Array.isArray(recipesData)) {
          // Legacy format: array of recipes
          fetchedRecipes = recipesData;
        } else if (recipesData && typeof recipesData === "object" && "recipes" in recipesData) {
          // New format: { query: string, recipes: Recipe[] }
          fetchedRecipes = recipesData.recipes || [];
        }

        // Then fetch playlists with the actual recipes returned
        const playlistRes = await fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: q, recipes: fetchedRecipes }),
        });
        const playlistData = await playlistRes.json();

        // Handle array and object (LLM) responses
        let playlist: Playlist | PlaylistRecommendations | null = null;
        if (Array.isArray(playlistData)) {
          playlist = playlistData[0] ?? null;
        } else if (playlistData && typeof playlistData === "object") {
          playlist = playlistData;
        }

        // pass in new query, if updated by the LLM
        const llmQuery = recipesData.query || "";

        navigate("/output", { state: { ...inputState, recipes: fetchedRecipes, playlist, llmQuery } });
      } catch (err) {
        console.error("Failed to fetch party data:", err);
        navigate("/output", { state: { ...inputState, recipes: [], playlist: null, llmQuery: "" } });
      }
    };

    fetchData();
  }, [navigate, location.state]);

  return (
    <div
      className="bg-[#fffef9] relative size-full min-h-screen flex flex-col items-center justify-center"
      data-name="loading screen"
    >
      <div
        className="h-[300px] sm:h-[400px] w-[400px] sm:w-[558px] mb-8"
        data-name="istockphoto-2098046718-612x612-removebg-preview 2"
      >
        <img
          alt="table setting illustration"
          className="max-w-none object-cover pointer-events-none size-full"
          src={table2}
        />
      </div>

      <p className="font-source-serif font-normal italic leading-[38px] text-center text-[#d43c00] text-[24px] sm:text-[30px] px-4">
        &nbsp;
        {displayText}
        {dots}
      </p>
    </div>
  );
}
