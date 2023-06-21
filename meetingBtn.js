/* global document */
if (typeof document !== "undefined") {
  console.log("Document Exists");
  const btn = document.querySelector("#chat-gpt-btn");
  const texts = document.querySelector("#texts");

  if (typeof window !== "undefined") {
    console.log("window defined");
    window.speechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;

    const recognition = new window.speechRecognition();

    recognition.interimResults = true;

    let p = document.createElement("p");
    const synth = window.speechSynthesis;

    recognition.addEventListener("result", (e) => {
      const text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join(" ");

      p.innerText = text;
      texts.appendChild(p);
    });

    btn.addEventListener("click", () => {
      btn.innerText = "Listening";
      recognition.start();
    });

    recognition.onend = async () => {
      btn.innerText = "Getting Response from ChatGPT...";
      await fetch("https://zoomchatgpt-backend-anmol.onrender.com/chk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the appropriate content type
        },
        body: JSON.stringify({ prompt: p.innerText }), // Convert the data to JSON format
      })
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => {
          // Handle the response data
          const utter = new SpeechSynthesisUtterance(data.data);
          synth.speak(utter);
          console.log(data.data);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error:", error);
        });

      btn.innerText = " Start Again ";
    };
  } else {
    console.log("window not found");
  }
} else {
  console.log("Document Does not Exists");
}
