import React, { useRef, useEffect, useState } from "react";
import Audio from "./components/Audio";

const App = () => {
  /**
   * @type {React.RefObject<MediaRecorder>}
   */
  const mediaRecorderRef = useRef(null);
  const [clips, setClips] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    let chunks = [];

    const onSuccess = (stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.onstop = function (e) {
        const clipName = prompt(
          "Enter a name for your sound clip?",
          "My unnamed clip"
        );

        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

        const ctx = new AudioContext();

        const clipsCopy = [...clips];
        clipsCopy.push({
          src: window.URL.createObjectURL(blob),
          name: clipName,
          ctx,
          blob,
        });

        chunks = [];

        setClips(clipsCopy);
      };

      mediaRecorderRef.current.ondataavailable = function (e) {
        chunks.push(e.data);
      };
    };

    if (navigator.mediaDevices.getUserMedia)
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(onSuccess, console.error);
  }, [clips]);

  return (
    <div className="root">
      <header>
        <h1>Web dictaphone</h1>
      </header>

      <main>
        <div id="buttons">
          <button
            className="record"
            style={{
              background: recording ? "red" : undefined,
            }}
            onClick={() => {
              if (recording) return;

              setRecording(true);

              if (mediaRecorderRef.current) {
                mediaRecorderRef.current.start();
              }
            }}
          >
            Record
          </button>
          <button
            disabled={!recording}
            className="stop"
            onClick={() => {
              if (!recording) return;

              setRecording(false);

              if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
              }
            }}
          >
            Stop
          </button>
        </div>
      </main>

      <section>
        {clips.map((clip, index) => (
          <Audio
            key={index}
            src={clip.src}
            name={clip.name}
            ctx={clip.ctx}
            blob={clip.blob}
            onDelete={() => {
              const clipsCopy = [...clips];
              setClips(
                clipsCopy.filter((_, i) => {
                  return i !== index;
                })
              );
            }}
          />
        ))}
      </section>
    </div>
  );
};

export default App;
