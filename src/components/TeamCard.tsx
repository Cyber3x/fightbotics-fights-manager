import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../lib/firebase";

interface IProps {
  teamName: string;
}

interface Teams {
  id: string;
  name: string;
  opponentName: string;
  timeLeft: number;
  timerCheck: boolean;
  isReady: boolean;
  opId: number;
  password: string;
}
const TeamCard = ({ teamName }: IProps) => {
  const [currTeam, setCurrTeam] = useState<Teams>();
  const timeoutId = useRef<number | undefined>(undefined);
  const [timer, setTimer] = useState(currTeam?.timeLeft ?? 1200);
  const [timerCheck, setTimerCheck] = useState<boolean>(
    currTeam?.timerCheck ?? false
  );
  const [gumb, setGumb] = useState("Start");
  const [teams, setTeams] = useState<Teams[]>([]);
  const [opponentName, setOpponentName] = useState("");

  /**
   * Updates the timer value in the teams database.
   *
   * If the timer reaches 0, it sets the `timeLeft` to 0, `timerCheck` to false, and `isReady` to true.
   * Otherwise, it decreases the `timeLeft` value by 1.
   *
   * @return {Promise<void>} Returns a promise that resolves when the timer value is updated in the database, or rejects with an error if an error occurs.
   */
  const countTimer = useCallback(async () => {
    if (timer <= 0) {
      try {
        await update(ref(database, "teams/" + teamName), {
          timeLeft: 0,
          timerCheck: false,
          isReady: true
        });
      } catch (error) {
        console.error("Error creating opponent:", error);
      }
    } else {
      await update(ref(database, "teams/" + teamName), { timeLeft: timer - 1 });
    }
  }, [timer, teamName]);

  /**
   * Converts the given total seconds into minutes and seconds.
   *
   * @param {number} totalSeconds - The total number of seconds.
   * @return {object} An object containing the minutes and seconds.
   */
  const timerMmSs = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes,
      seconds: seconds,
    };
  };

  /**
   * Adds or subtracts the timer value based on the 'add' parameter.
   *
   * @param {boolean} add - If true, the timer value is increased by 60 seconds.
   *                        If false, the timer value is decreased by 60 seconds.
   * @return {Promise<void>} A promise that resolves when the timer value is updated in the database.
   */
  const addOrSubstractTimer = async (add: boolean) => {
    if (add) {
      try {
        await update(ref(database, "teams/" + teamName), { isReady: false, timeLeft: timer + 60 });
      } catch (error) {
        console.error("Error creating opponent:", error);
      }
    } else {
      if (timer <= 60) {
        await update(ref(database, "teams/" + teamName), { timeLeft: 5 });
      }
      else {
        await update(ref(database, "teams/" + teamName), { timeLeft: timer - 60 });
      }

    }
  }


  /**
   * Updates the timer check value in the teams database.
   *
   * @param {boolean} check - The new value for the timer check.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  const timerCheckUpdate = async (check: boolean) => {
    try {
      await update(ref(database, "teams/" + teamName), { timerCheck: check });
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  };


  /**
   * Resets the button.
   *
   * @return {Promise<void>} A promise that resolves when the button is reset.
   */
  const resetButton = async () => {
    try {
      await update(ref(database, "teams/" + teamName), {
        timeLeft: 1200,
        timerCheck: false,
        isReady: false
      });
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  };


  /**
   * Handles the opponent for the given opponent name.
   *
   * @param {string} opName - The name of the opponent.
   * @return {Promise<void>} A promise that resolves when the opponent is handled.
   */
  const handleOpponent = async (opName: string) => {
    try {
      await update(ref(database, "teams/" + opName), {
        opponentName: teamName,
        opId: 2
      });
      await update(ref(database, "teams/" + teamName), {
        opponentName: opName,
        opId: 1
      });
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  };


  /**
   * Removes a team from the database.
   *
   * @param {string} teamName - The name of the team to be removed.
   * @return {Promise<void>} Returns a promise that resolves when the team is successfully removed, or rejects with an error if an error occurs.
   */
  const removeTeam = async () => {
    try {
      await remove(ref(database, "teams/" + teamName));
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  };

  useEffect(() => {
    if (timerCheck) {
      setGumb("Pause");
      timeoutId.current = window.setTimeout(countTimer, 1000);
      return () => window.clearTimeout(timeoutId.current);
    } else {
      setGumb("Start");
    }
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTeams = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setTeams(fetchedTeams);
        fetchedTeams.forEach((team) => {
          if (team.name === teamName) {
            setCurrTeam(team);
            setTimerCheck(team.timerCheck);
            setTimer(team.timeLeft);
            setOpponentName(team.opponentName);
            console.log("fetched");
          }
        });
      }
    });
  }, [timer, countTimer, timerCheck, teamName]);

  return (
    <div
      className={cn(
        "bg-white shadow-md p-6 border-4 w-[20rem] box-border border-transparent",
        (timer === 0 || currTeam?.isReady) && "border-green-500"
      )}
    >
      <h1 className="text-center text-4xl mb-4">{teamName}</h1>
      <h1 className="text-center text-2xl mb-4">{currTeam?.password}</h1>
      <p className="text-blue-800 uppercase font-bold text-lg opacity-80">
        REPAIR TIME LEFT
      </p>
      <div className="flex justify-between items-center mb-4">
        <p className="text-5xl text-gray-700 w-full">
          {timerMmSs(Number(timer)).minutes < 10
            ? "0" + timerMmSs(Number(timer)).minutes
            : timerMmSs(Number(timer)).minutes}
          :
          {timerMmSs(Number(timer)).seconds < 10
            ? "0" + timerMmSs(Number(timer)).seconds
            : timerMmSs(Number(timer)).seconds}
        </p>
        <button
          className=
          "h-10 aspect-square text-white rounded-sm font-black ml-4 bg-blue-700"
          onClick={() => addOrSubstractTimer(true)}
        >
          +
        </button>
        <button
          className=
          "h-10 aspect-square text-white rounded-sm font-black ml-4 bg-red-700"
          onClick={() => addOrSubstractTimer(false)}
        >
          -
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={cn(
            "h-10 aspect-square text-white rounded-sm font-black ml-4",
            !timerCheck ? "bg-red-700" : "bg-green-600"
          )}
          onClick={() => timerCheckUpdate(!timerCheck)}
        >
          {gumb}
        </button>
        <button
          className={cn(
            "h-10 aspect-square text-white rounded-sm font-black ml-4 bg-yellow-400"
          )}
          onClick={() => resetButton()}
        >
          Reset
        </button>
      </div>
      {opponentName === "" ? (
        <p className="text-red-800 uppercase font-bold text-lg opacity-80">
          NEXT OPPONENT
        </p>
      ) : null}
      {opponentName === "" ? (
        <select
          className="p-2 w-full bg-gray-200 italic text-xl text-gray-700"
          value={opponentName}
          onChange={(e) => handleOpponent(e.target.value)}
        >
          <option disabled value="">
            Select next opponent
          </option>
          {teams.map((team) => {
            if (team.opId == 0 && team.name !== teamName) {
              return (
                <option value={team.name}>{team.name}</option>
              )
            }
          })}
        </select>
      ) : null}

      <p className="text-blue-800 uppercase font-bold text-lg opacity-80">
        CURRENT OPPONENT
      </p>
      <p className="text-black-400 font-bold text-lg opacity-80">
        {opponentName}
      </p>
      <div>
        <button
          className="text-center text-4xl mb-4 text-red-800"
          onClick={() => removeTeam()}
        >
          REMOVE TEAM
        </button>
      </div>
    </div>
  );
};

export default TeamCard;
