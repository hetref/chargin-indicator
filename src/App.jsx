import { useEffect, useRef, useState } from "react";
import "./App.css";
import audioFile from "./assets/battery.mp3";
import lowaudioFile from "./assets/lowbattery.mp3";

function App() {
  const [batteryIsCharging, setBatteryIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const audioRef = useRef(null);
  const lowaudioRef = useRef(null);

  const getTime = () => {
    const currentTime = new Date();
    setHours(currentTime.getHours());
    setMinutes(currentTime.getMinutes());
    setSeconds(currentTime.getSeconds());
  };

  const getCharging = () => {
    navigator.getBattery().then((battery) => {
      setBatteryIsCharging(battery.charging);
      setBatteryLevel(battery.level * 100);

      battery.addEventListener("chargingchange", () => {
        setBatteryIsCharging(battery.charging);
      });
      battery.addEventListener("onlevelchange", () => {
        setBatteryLevel(battery.level * 100);
      });
    });
  };

  const playAudio = () => {
    audioRef.current.play();
  };

  const lowplayAudio = () => {
    lowaudioRef.current.play();
  };

  useEffect(() => {
    setInterval(() => {
      getCharging();
      getTime();
    }, 1000);

    if (batteryIsCharging) {
      console.log("Battery is charging " + batteryIsCharging);
    } else {
      console.log("Battery is not charging " + batteryIsCharging);
    }

    if (batteryIsCharging && batteryLevel >= 90) {
      playAudio();
    }

    if (!batteryIsCharging && batteryLevel <= 20) {
      lowplayAudio();
    }
    console.log(`${batteryLevel} on ${hours}:${minutes}:${seconds}`);

    const audio = audioRef.current;
    const lowaudio = lowaudioRef.current;

    audio.addEventListener("ended", () => {
      console.log("Audio has finished playing");
    });

    lowaudio.addEventListener("ended", () => {
      console.log("Audio has finished playing");
    });

    return () => {
      audio.removeEventListener("ended", () => {
        console.log("Audio has finished playing");
      });
      lowaudio.removeEventListener("ended", () => {
        console.log("Audio has finished playing");
      });
    };
  }, [seconds]);

  return (
    <>
      <div>
        <h2>
          Checking Status: {batteryIsCharging ? "Charging" : "Not Charging"}
        </h2>
        <h3>Level: {batteryLevel}</h3>
        <h4>
          Time: {hours} : {minutes} : {seconds}
        </h4>

        <h1>Play Audio Example</h1>
        <button onClick={playAudio}>Play Audio</button>
        <audio ref={audioRef} src={audioFile} />
        <audio ref={lowaudioRef} src={lowaudioFile} />
      </div>
    </>
  );
}

export default App;
