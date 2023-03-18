import React, { useState, useEffect } from "react";
import axios from "axios";

function Slide({ title, description, imageUrl }) {
  return (
    <div className="slide">
      <h2>{title}</h2>
      <img src={imageUrl} alt={title} />
      <p>{description}</p>
    </div>
  );
}

function Presentation({ data }) {
  return (
    <div className="presentation">
      {data.map((slide) => (
        <Slide
          key={slide.id}
          title={slide.title}
          description={slide.description}
          imageUrl={slide.imageUrl}
        />
      ))}
    </div>
  );
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState([]);

  const API_KEY = "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";
  const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/completions";

  useEffect(() => {
    const fetchData = async () => {
      if (prompt) {
        const response = await axios.post(
          OPENAI_API_ENDPOINT,
          {
            model: "text-davinci-002",
            prompt: `Subtopics related to ${prompt}`,
            temperature: 0.5,
            max_tokens: 100,
            n: 1,
            stop: "\n\n",
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const subtopics = response.data.choices[0].text.split("\n").map((topic) => topic.trim()).filter(Boolean);

        const data = [];
        for (const subtopic of subtopics) {
          const descriptionResponse = await axios.post(
            OPENAI_API_ENDPOINT,
            {
              model: "text-davinci-002",
              prompt: `Describe ${subtopic}`,
              temperature: 0.5,
              max_tokens: 100,
              n: 1,
              stop: "\n\n",
            },
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const description = descriptionResponse.data.choices[0].text.trim();

          const unsplashResponse = await axios.get(
            `https://api.unsplash.com/search/photos?page=1&query=${subtopic}`,
            {
              headers: {
                Authorization: `Client-ID 2zWJ-5ZnSXgS_41PAKjAP6lE5TMpZWR2dy6QEUeGvqc`,
              },
            }
          );
          const imageUrl = unsplashResponse.data.results[0].urls.regular;

          data.push({
            id: subtopic,
            title: subtopic,
            description,
            imageUrl,
          });
        }
        setData(data);
      }
    };
    fetchData();
  }, [prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set the prompt to the state
    // fetchData will be called automatically in useEffect
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate Presentation</button>
      </form>
      {data.length > 0 && <Presentation data={data} />}
    </div>
  );
}

export default App;
