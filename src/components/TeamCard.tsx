import { Team, TeamsDataContext } from "./TeamsDataProvider";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { useContext, useEffect, useState } from "react";
import { cn } from "../lib/utils";

dayjs.extend(duration);
dayjs.extend(customParseFormat);

interface IProps {
  team: Team;
  initalSecondsLeft?: number; // seconds

  onTimerDone: (teamName: string, nextOpponentTeamName: string) => void;
  onTimerReset: (team: Team) => void;
}

const TeamCard = ({
  team,
  initalSecondsLeft,
  onTimerDone,
  onTimerReset,
}: IProps) => {
  const { name: teamName } = team;

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initalSecondsLeft ?? 6);
  const [nextOpponentTeamName, setNextOpponentTeamName] = useState("NONE");

  const { teamsData } = useContext(TeamsDataContext);

  const [formatTimeDisplay, setFormatTimeDisplay] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning && secondsLeft > 0) {
        setSecondsLeft(state => state - 1);
      } else if (secondsLeft === 0) {
        setIsTimerRunning(false);
        onTimerDone(teamName, nextOpponentTeamName);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const startTimer = () => {
    if (secondsLeft > 0) setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const toggleTimer = () => (isTimerRunning ? stopTimer() : startTimer());

  const handleInputFocus = () => {
    setFormatTimeDisplay(false);
  };

  const handleInputBlur = (input: string) => {
    setFormatTimeDisplay(true);
    onTimerReset(team);

    let numberOfMinutes = parseInt(input, 10);
    numberOfMinutes = Math.min(numberOfMinutes, 59);
    numberOfMinutes = Math.max(numberOfMinutes, 0);

    const numberOfSeconds = numberOfMinutes * 60;
    if (!isNaN(numberOfSeconds)) {
      setSecondsLeft(numberOfSeconds);
    }
  };

  return (
    <div
      className={cn(
        "bg-white shadow-md p-6 border-4 w-[20rem] box-border border-transparent",
        secondsLeft === 0 && "border-green-500"
      )}
    >
      <h1 className="text-center text-4xl mb-4">{teamName}</h1>
      <p className="text-blue-800 uppercase font-bold text-lg opacity-80">
        REPAIR TIME LEFT
      </p>
      <div className="flex justify-between items-center mb-4">
        <input
          onFocus={handleInputFocus}
          onBlur={e => handleInputBlur(e.currentTarget.value)}
          className="text-5xl text-gray-700 w-full"
          value={
            formatTimeDisplay
              ? dayjs.duration(secondsLeft, "s").format("mm:ss")
              : undefined
          }
          disabled={isTimerRunning}
          type={formatTimeDisplay ? "text" : "number"}
          onChange={() => undefined}
        />

        <button
          className={cn(
            "h-10 aspect-square text-white rounded-sm font-black ml-4",
            isTimerRunning ? "bg-red-700" : "bg-green-600",
            (secondsLeft === 0 || nextOpponentTeamName === "NONE") &&
              "bg-gray-400 cursor-default"
          )}
          onClick={toggleTimer}
          disabled={nextOpponentTeamName === "NONE"}
        >
          {isTimerRunning ? "||" : ">"}
        </button>
      </div>
      <p className="text-red-800 uppercase font-bold text-lg opacity-80">
        NEXT OPPONENT
      </p>
      <select
        className="p-2 w-full bg-gray-200 italic text-xl text-gray-700"
        value={nextOpponentTeamName}
        onChange={e => setNextOpponentTeamName(e.target.value)}
      >
        <option disabled value="NONE">
          Select next opponent
        </option>
        {teamsData
          .map(data => data.name)
          .map(otherTeamName => {
            if (otherTeamName !== teamName) {
              return (
                <option key={otherTeamName} value={otherTeamName}>
                  {otherTeamName}
                </option>
              );
            }
          })}
      </select>
    </div>
  );
};

export default TeamCard;
