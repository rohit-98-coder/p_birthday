import { useState, useEffect } from "react";
import { PROFILE } from "../data/content";

export function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isToday, setIsToday] = useState(false);
  const [turningAge, setTurningAge] = useState(PROFILE.age);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const { year, month, day } = PROFILE.birthDate;
      let y = now.getFullYear();
      let target = new Date(y, month, day, 0, 0, 0);

      const isBday =
        now.getMonth() === month && now.getDate() === day;
      setIsToday(isBday);

      if (isBday) return;

      if (now > target) {
        const end = new Date(y, month, day + 1, 0, 0, 0);
        if (now < end) {
          // still "birthday day" window
          setIsToday(true);
          return;
        }
        target = new Date(y + 1, month, day, 0, 0, 0);
      }

      setTurningAge(target.getFullYear() - year);

      const diff = target - now;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, isToday, turningAge };
}
