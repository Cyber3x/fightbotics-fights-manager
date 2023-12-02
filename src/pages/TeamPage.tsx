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
    <div className="lg:pt-8 h-screen bg-gray-200">
      <div className="lg:p-8 lg:w-1/2 mx-auto mt-12 h-full lg:h-min bg-white flex flex-col items-center shadow-md">
        <div className="flex justify-center relative w-full items-center flex-col lg:flex-row">
          <h1 className="text-4xl">{team.name}</h1>
          <button
            className="border-2 border-red-600 text-red-600 py-1 px-4 my-4 lg:absolute lg:right-0 lg:text-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <p className="text-blue-500 uppercase font-semibold text-md opacity-80 mt-8">
          REPAIR time left
        </p>
        <h1
          className={cn(
            "text-6xl sm:text-8xl",
            team.isTimerRunning && "text-red-600"
          )}
        >
          {dayjs.duration(team.timeLeft, "s").format("mm:ss")}
        </h1>
        <button
          className={cn(
            "h-12 rounded-sm font-black mt-8 bg-red-700 text-white lg:w-1/4 px-4",
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
