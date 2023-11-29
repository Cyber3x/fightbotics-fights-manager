import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../lib/firebase";
import TeamCard from "../components/TeamCard";
import { Team } from "./FightsPage";

const LandingPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchTeams() {
      const teamsRef = ref(database, "teams");

      onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setTeams(Object.values(data));
        }
      });
    }

    fetchTeams();
  }, []);

  return (
    <div className="p-4 gap-8 flex flex-col">
      <div className="flex gap-8">
        {teams.length > 0 ? (
          <div
            className={`bg-gray-100 p-4 gap-4 flex flex-wrap flex-1 shadow-md`}
          >
            {teams.map((team) => (
              <TeamCard key={team.name} team={team} isViewOnly />
            ))}
          </div>
        ) : (
          <h1 className="text-3xl">
            No teams found, please ask administrators to enter them.
          </h1>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
