import React, { useRef } from "react";
import createNoiseConvolver from "../utils/createNoiseConvolver";
import createMoog from "../utils/createMoog";
import createBitCrusher from "../utils/createBitCrusher";

const createSource = (blob, ctx, done) => {
  let fileReader = new FileReader();
  let buffer;

  fileReader.onloadend = () => {
    buffer = fileReader.result;

    ctx.decodeAudioData(buffer, (audioBuffer) => {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      done(source);
    });
  };

  if (blob) fileReader.readAsArrayBuffer(blob);
};

/**
 * @param {{
 *  ctx: AudioContext;
 *  blob: Blob;
 * }} props
 */
export default function Audio({ src, name, ctx, blob, onDelete }) {
  /**
   * @type {React.RefObject<HTMLAudioElement>}
   */
  const audioRef = useRef(null);

  return (
    <div>
      <p
        style={{
          color: "white",
        }}
      >
        {name}
      </p>
      <audio ref={audioRef} src={src} controls />
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <button
            style={{
              background: "#ffcf86",
              color: "black",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const filter = createNoiseConvolver(ctx);

              createSource(blob, ctx, (source) => {
                source.connect(filter).connect(ctx.destination);
                source.start(0);
              });
            }}
          >
            Noise Convolver
          </button>
          <button
            style={{
              background: "#ff86f3",
              color: "black",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const filter = createBitCrusher(ctx);

              createSource(blob, ctx, (source) => {
                source.connect(filter).connect(ctx.destination);
                source.start(0);
              });
            }}
          >
            Bit Crusher
          </button>
          <button
            style={{
              background: "#adff86",
              color: "black",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const filter = createMoog(ctx);

              createSource(blob, ctx, (source) => {
                source.connect(filter).connect(ctx.destination);
                source.start(0);
              });
            }}
          >
            Moog
          </button>
        </div>
        <button
          style={{
            background: "#ff8585",
            color: "black",
          }}
          onClick={onDelete}
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
