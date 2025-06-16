import React, { useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import Editor from "react-simple-code-editor";
import rehpeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

const App = () => {
  const [code, setCode] = useState(`function sum() {
  return 1 + !;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data); // If response is { review: "..." }, use response.data.review
    } catch (error) {
      console.error("Error during code review:", error);
      setReview("❌ Failed to fetch review. Please check the server.");
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                backgroundColor: "#0c0c0c",
                color: "#f8f8f2",
                borderRadius: "0.5rem",
              }}
            />
          </div>
          <div className="review-btn" onClick={reviewCode}>
            Review
          </div>
        </div>

        <div className="right">
          {loading ? (
            <p className="loading-text">🔄 Reviewing code...</p>
          ) : (
            <Markdown
            rehypePlugins={[rehpeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code
                      className={className}
                      style={{
                        background: "#222",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {review}
            </Markdown>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
