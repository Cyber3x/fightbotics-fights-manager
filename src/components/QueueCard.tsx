import { ref, update, onValue } from "firebase/database";
import { database } from "../lib/firebase";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "../lib/utils";

interface FightQueueItem {
  firstTeamName: string;
  secondTeamName: string;
}
const QueueCard = ({ firstTeamName, secondTeamName }: FightQueueItem) => {

  const timeoutId = useRef<number | undefined>(undefined);
  const [readyP1, setReadyP1] = useState(false);
  const [readyP2, setReadyP2] = useState(false);
  const [timer, setTimer] = useState(600);
  const [timerCheck, setTimerCheck] = useState(false);

  const countTimer = useCallback(async () => {
    if (timer <= 0) {
      try {
        await update(ref(database, "teams/" + firstTeamName), {
          fightTime: 600,
          opponentName: "",
          isReady: false,
          fightStart: false,
          timeLeft: 1200,
          timerCheck: true
        });
        await update(ref(database, "teams/" + secondTeamName), {
          fightTime: 600,
          opponentName: "",
          isReady: false,
          fightStart: false,
          timeLeft: 1200,
          timerCheck: true
        });
      } catch (error) {
        console.error("Error creating opponent:", error);
      }
    } else {
      await update(ref(database, "teams/" + firstTeamName), { fightTime: timer - 1 });
      await update(ref(database, "teams/" + secondTeamName), { fightTime: timer - 1 });
    }
  }, [timer, firstTeamName, secondTeamName]);

  // This function converts the total number of seconds into minutes and seconds, and returns an object with the minutes and seconds values.
  const timerMmSs = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes,
      seconds: seconds,
    };
  };


  const removeFromQueue = async (teamName: string, oppName: string) => {
    try {
      await update(ref(database, "teams/" + teamName), {
        opponentName: "",
        opId: 0
      });
      await update(ref(database, "teams/" + oppName), {
        opponentName: "",
        opId: 0
      });
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  }

  useEffect(() => {
    if (timerCheck) {
      timeoutId.current = window.setTimeout(countTimer, 1000);
      return () => window.clearTimeout(timeoutId.current);
    }
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTeams = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        fetchedTeams.forEach(team => {
          if (team.name === firstTeamName) {
            setTimer(team.fightTime);
            setReadyP1(team.isReady);
            setTimerCheck(team.fightStart);
          }
          if (team.name === secondTeamName) {
            setReadyP2(team.isReady);
          }
        });
      }
    });
  }), [timerCheck, firstTeamName, secondTeamName];


  return (
    <div className={(readyP1 && readyP2) ? "bg-green-600" : "bg-red-700"}>
      <div className={"flex px-4 py-2 justify-between items-center shadow-md text-xl"}>
        <div className="text-white">
          <p>
            <span className="italic">TEAM 1: </span>
            <span className="font-bold">{firstTeamName}</span>
          </p>
          <span className="italic">TEAM 2: </span>{" "}
          <span className="font-bold">{secondTeamName}</span>
        </div>
        <button className={cn(
          "bg-white h-8 aspect-square font-black shadow-md",
          (readyP1 && readyP2) ? "text-green-600" : "text-red-700"
        )}
          onClick={() => removeFromQueue(firstTeamName, secondTeamName)}>
          X
        </button>
      </div>
      {readyP1 && readyP2 && (
        <div className="flex px-4 py-2 justify-between items-center shadow-md text-xl">
          <div className="text-white">
            {timerMmSs(Number(timer)).minutes < 10
              ? "0" + timerMmSs(Number(timer)).minutes
              : timerMmSs(Number(timer)).minutes}
            :
            {timerMmSs(Number(timer)).seconds < 10
              ? "0" + timerMmSs(Number(timer)).seconds
              : timerMmSs(Number(timer)).seconds}
          </div>
          <button className="bg-white h-8 font-black text-green-600 shadow-md"
            onClick={() => {
              update(ref(database, "teams/" + firstTeamName), { fightStart: true }),
              update(ref(database, "teams/" + secondTeamName), { fightStart: true })
            }}>
            START
          </button>
        </div>
      )}
    </div>
  );
};

export default QueueCard;
