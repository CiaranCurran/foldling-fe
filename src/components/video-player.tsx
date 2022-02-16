import YouTube from "react-youtube";
import { useEffect, useRef, useState } from "react";

function useAsyncReference(value: any) {
  const ref = useRef(value);
  const [, forceRender] = useState(false);

  function updateState(newState: any) {
    ref.current = newState;
    forceRender((s) => !s);
  }

  return [ref, updateState];
}

const VideoPlayer = ({ time, setCurrentTime }: any) => {
  const [player, setPlayer] = useAsyncReference(null) as any;
  const [shouldTrackTime, setShouldTrackTime] = useAsyncReference(false) as any;

  useEffect(() => {
    if (player.current) {
      console.log("in useeffect");
      console.log("its:" + player.current.getCurrentTime());
      player.current.seekTo(time.time);
    }
  }, [time]);

  const onReady = (e: any) => {
    console.log("Saving video player to state");
    setPlayer(e.target);
  };

  useEffect(() => {
    const trackTime = () => {
      setTimeout(() => {
        if (shouldTrackTime.current) {
          console.log("Time: " + player.current.getCurrentTime());
          setCurrentTime(player.current.getCurrentTime());
          trackTime();
        }
      }, 100);
    };

    if (shouldTrackTime) {
      trackTime();
    }
  }, [shouldTrackTime.current]);

  const onStateChange = (e: any) => {
    // If the video starts playing
    if (e.data === 1 && !shouldTrackTime.current) {
      // Attach a process that calls every second
      setShouldTrackTime(true);
    } else if (shouldTrackTime.current) {
      setShouldTrackTime(false);
    }
  };

  return (
    <YouTube
      videoId={"DA--T_3T3mI"}
      containerClassName={"videoContainer"}
      opts={{ width: "100%", height: "100%" }}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  );
};

export default VideoPlayer;
