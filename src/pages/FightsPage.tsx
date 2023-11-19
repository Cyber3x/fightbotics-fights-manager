import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../lib/firebase";
import TeamCard from "../components/TeamCard";
import { Link } from "react-router-dom";
import QueueCard from "../components/QueueCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";


interface Teams {
  id: string;
  name: string;
  opponentName: string;
  isReady: boolean;
  opId: number;
}

const FightsPage = () => {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [user] = useAuthState(auth);
  const fetchData = async () => {
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTeams = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setTeams(fetchedTeams);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (user) {
    return (
      <div className="p-8 gap-8 flex flex-col">
        <div className="bg-gray-100 p-4">
          <Link to="/teams" className="text-green-700 hover:underline">
            Manage teams
          </Link>
        </div>
        <div className="flex gap-8">
          <div className="bg-gray-100 w-96 p-4 shadow-md">
            <h1 className="text-center text-5xl mt-4 mb-8">Fight Queue</h1>
            <div className="space-y-4">
              {teams.map((team) => {
                if (team.opId === 1) {
                  return (
                    <QueueCard firstTeamName={team.name} secondTeamName={team.opponentName} />
                  )
                }
              })}
            </div>
          </div>

          <div
            className={`bg-gray-100 p-4 gap-4 flex flex-wrap flex-1 shadow-md`}
          >
            {teams.map((team) => (
              <TeamCard key={team.id} teamName={team.name} />
            ))}
          </div>
        </div>
      </div>
    );
  }

};

export default FightsPage;
