import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../lib/firebase";
import TeamCard from "../components/TeamCard";
import { Link } from "react-router-dom";

export interface Team {
  name: string;
  opponentName: string;
  timeLeft: number;
  isTimerRunning: false;
  isReady: boolean;
  fightTime: number;
  fightStart: boolean;
  password: string;
}

const FightsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchData() {
      const teamsRef = ref(database, "teams");

      onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setTeams(Object.values(data));
        }
      });
    }

    fetchData();
  }, []);

  return (
    <div className="p-8 gap-8 flex flex-col">
      <div className="bg-gray-100 p-4 w-full flex flex-row-reverse">
        <Link
          to="/teams"
          className="text-green-700 hover:underline text-md pr-4"
        >
          Manage teams
        </Link>
      </div>
      <div className="flex gap-8">
        {teams.length > 0 ? (
          <div
            className={`bg-gray-100 p-4 gap-4 flex flex-wrap flex-1 shadow-md`}
          >
            {teams.map((team) => (
              <TeamCard key={team.name} team={team} />
            ))}
          </div>
        ) : (
          <h1 className="text-3xl">
            No teams found, please go to the teams page and enter them.
          </h1>
        )}
      </div>
    </div>
  );
};

export default FightsPage;
