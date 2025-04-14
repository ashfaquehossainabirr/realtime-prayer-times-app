import React, { useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import sound from "./alert.mp3"; // Add your audio file here

export const AudioAlert = ({ countdown }) => {
  useEffect(() => {
    if (countdown === 0) {
      const audio = new Audio(sound);
      audio.play();
    }
  }, [countdown]);

  return null;
};