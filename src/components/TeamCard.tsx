import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ref, update } from "firebase/database";
import { Pause, Play, TimerReset } from "lucide-react";
import { useCallback, useEffect } from "react";
import { DEAFULT_REAPIR_TIME } from "../constants";
import { database } from "../lib/firebase";
import { cn } from "../lib/utils";
import { Team } from "../pages/FightsPage";

dayjs.extend(duration);

interface IProps {
  team: Team;
  isViewOnly?: boolean;
}

const TeamCard = ({ team, isViewOnly }: IProps) => {
  // const timeoutId = useRef<number | undefined>(undefined);

  /**
   * Updates the timer value in the teams database.
   *
   * If the timer reaches 0, it sets the `timeLeft` to 0, `timerCheck` to false, and `isReady` to true.
   * Otherwise, it decreases the `timeLeft` value by 1.
   *
   * @return {Promise<void>} Returns a promise that resolves when the timer value is updated in the database, or rejects with an error if an error occurs.
   */
  const countTimer = useCallback(async () => {
    try {
      if (team.timeLeft <= 1) {
        await update(ref(database, "teams/" + team.name), {
          timeLeft: 0,
          isTimerRunning: false,
          isReady: true,
        });
      } else {
        await update(ref(database, "teams/" + team.name), {
          timeLeft: team.timeLeft - 1,
        });
      }
    } catch (error) {
      console.error(
        `Error in countdown function of team ${team.name}: ${error}`
      );
    }
  }, [team.timeLeft, team.name]);

  /**
   * Adds or subtracts the timer value based on the 'add' parameter.
   *
   * @param {boolean} add - If true, the timer value is increased by 60 seconds.
   *                        If false, the timer value is decreased by 60 seconds.
   * @return {Promise<void>} A promise that resolves when the timer value is updated in the database.
   */
  const addOrSubstractTimer = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    add: boolean
  ) => {
    const { timeLeft } = team;
    let newTime;
    if (add) {
      if (timeLeft === 5) {
        newTime = 60;
      } else {
        if (e.ctrlKey) {
          newTime = timeLeft + 1;
        } else {
          newTime = timeLeft + 60;
        }
      }
    } else {
      if (e.ctrlKey) {
        if (timeLeft > 5) {
          newTime = timeLeft - 1;
        }
      } else {
        if (timeLeft <= 60) {
          newTime = 5;
        } else {
          newTime = timeLeft - 60;
        }
      }
    }

    try {
      await update(ref(database, "teams/" + team.name), {
        isReady: false,
        isTimerRunning: false,
        timeLeft: newTime,
      });
    } catch (error) {
      console.error(
        `error while ${add ? "adding" : "substracting"} time from ${
          team.name
        }: `,
        error
      );
    }
  };

  /**
   * Updates in DB if the timer for this team is running.
   *
   * @param {boolean} isTimerRunning - The new value for the isTimerRunning.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  const toggleIsTimerRunning = async () => {
    if (team.timeLeft == 0 && !team.isTimerRunning) return;

    try {
      await update(ref(database, "teams/" + team.name), {
        isTimerRunning: !team.isTimerRunning,
      });
    } catch (error) {
      console.error("Error creating opponent:", error);
    }
  };

  /**
   * Resets the button.
   *
   * @return {Promise<void>} A promise that resolves when the button is reset.
   */
  const handleResetButtonClick = async () => {
    try {
      await update(ref(database, "teams/" + team.name), {
        timeLeft: DEAFULT_REAPIR_TIME,
        isTimerRunning: false,
        isReady: false,
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
  // const handleChangeOpponent = async (newOpponentName: string) => {
  //   try {
  //     await update(ref(database, "teams/" + team.name), {
  //       opponentName: newOpponentName,
  //     });
  //   } catch (error) {
  //     console.error("Error creating opponent:", error);
  //   }
  // };

  useEffect(() => {
    if (team.isTimerRunning) {
      const timeout = setInterval(countTimer, 1000);
      return () => clearTimeout(timeout);
    }
  }, [countTimer, team.isTimerRunning]);

  return (
    <div
      className={cn(
        "bg-white shadow-md p-6 border-[5px] w-[20rem] box-border border-transparent",
        (team.timeLeft === 0 || team.isReady) && "border-green-700"
      )}
    >
      <h1
        className={cn(
          "text-center line-clamp-1 mb-2",
          team.name.length < 18
            ? "text-3xl"
            : "text-md mb-3 hover:line-clamp-none hover:whitespace-nowrap"
        )}
      >
        {team.name}
      </h1>

      {/* TIME LEFT */}
      <p className="text-blue-500 uppercase font-semibold text-md opacity-80">
        REPAIR TIME LEFT
      </p>
      <div className="flex justify-between items-center mb-4">
        <p className={cn("text-5xl w-full text-gray-700")}>
          {dayjs.duration(team.timeLeft, "s").format("mm:ss")}
        </p>
        {!isViewOnly && (
          <div className="flex space-x-4">
            <button
              className="h-10 aspect-square text-4xl rounded-sm bg-green-400"
              onClick={(e) => addOrSubstractTimer(e, true)}
            >
              +
            </button>
            <button
              className="h-10 aspect-square text-4xl rounded-sm bg-red-400"
              onClick={(e) => addOrSubstractTimer(e, false)}
            >
              -
            </button>
          </div>
        )}
      </div>

      {/* PLAY|PAUSE AND RESET BUTTONS */}
      {!isViewOnly && (
        <div className="flex justify-between items-center space-x-4">
          <button
            className={cn(
              "h-10 aspect-square rounded-sm",
              team.isTimerRunning ? "bg-red-400" : "bg-green-400"
            )}
            onClick={toggleIsTimerRunning}
          >
            {team.isTimerRunning ? (
              <Pause className="mx-auto" />
            ) : (
              <Play className="mx-auto" />
            )}
          </button>
          <button
            className="h-10 aspect-square rounded-sm bg-yellow-400"
            onClick={handleResetButtonClick}
          >
            <TimerReset className="mx-auto" />
          </button>
        </div>
      )}

      {/* NEXT OPPONENT */}
      {/* <div>
        <p className="text-red-400 uppercase font-semibold text-md opacity-80">
          NEXT OPPONENT
        </p>
        {isViewOnly ? (
          <p
            className={cn(
              "p-2 w-full bg-gray-200 text-xl text-gray-700",
              team.opponentName ? "" : "italic text-gray-400"
            )}
          >
            {team.opponentName || "Currently unknown"}
          </p>
        ) : (
          <select
            className="p-2 w-full bg-gray-200 italic text-xl text-gray-700"
            value={team.opponentName}
            onChange={(e) => handleChangeOpponent(e.target.value)}
          >
            <option disabled value="">
              Select next opponent
            </option>
            {teams.map((otherTeam) => {
              if (otherTeam.name !== team.name) {
                return (
                  <option key={otherTeam.name} value={otherTeam.name}>
                    {otherTeam.name}
                  </option>
                );
              }
            })}
          </select>
        )}
      </div> */}
    </div>
  );
};

export default TeamCard;
