import { useNavigate } from "react-router-dom";
import { useTeams } from "../components/teams/TeamsProvider";
import dayjs from "dayjs";
import { cn } from "../lib/utils";
import { ref, update } from "firebase/database";
import { database } from "../lib/firebase";

const TeamPage = () => {
  const { getTeam } = useTeams();

  const navigate = useNavigate();

  const team = getTeam(
    localStorage.getItem("teamName"),
    localStorage.getItem("password")
  );

  if (!team) {
    navigate("/team/login", { replace: true });
    return;
  }

  function handleLogout() {
    localStorage.removeItem("teamName");
    localStorage.removeItem("password");
    navigate("/team/login", { replace: true });
  }

  return (
    <div className="pt-8 h-screen bg-gray-200">
      <div className="p-8 w-1/2 mx-auto bg-white flex flex-col items-center shadow-md">
        <div className="flex justify-center relative w-full items-center">
          <h1 className="text-4xl">{team.name}</h1>
          <button
            className="underline text-lg text-green-600 my-4 absolute right-0"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <p className="text-blue-500 uppercase font-semibold text-md opacity-80 mt-8">
          REPAIR time left
        </p>
        <h1 className={cn("text-8xl", team.isTimerRunning && "text-red-600")}>
          {dayjs.duration(team.timeLeft, "s").format("mm:ss")}
        </h1>
        <button
          className={cn(
            "h-12 rounded-sm font-black mt-8 bg-red-700 text-white w-1/4",
            team.isReady ? "bg-red-500" : "bg-green-500",
            team.timeLeft === 0 && "bg-gray-400 text-gray-100 cursor-default"
          )}
          disabled={team.timeLeft === 0}
          onClick={() =>
            update(ref(database, "teams/" + team.name), {
              isReady: !team.isReady,
            })
          }
        >
          {team.isReady ? "Not ready" : "Ready"}
        </button>
      </div>
    </div>
  );
};

export default TeamPage;
