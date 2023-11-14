import { useContext } from "react";
import TeamCard from "../components/TeamCard";
import QueueCard from "../components/QueueCard";
import { Team, TeamsDataContext } from "../components/TeamsDataProvider";
import { Link } from "react-router-dom";

const pairings = new Map();

const FightsPage = () => {
  const { teamsData, fightQueueItems, addFightToQueue } =
    useContext(TeamsDataContext);

  const checkIfOpponentTeamReady = (
    currentTeamName: string,
    nextOpponentTeamName: string
  ) => {
    pairings.set(currentTeamName, nextOpponentTeamName);

    console.log("here");

    for (const [orginalTeamName, targetingTeamName] of pairings) {
      if (
        orginalTeamName === nextOpponentTeamName &&
        targetingTeamName === currentTeamName
      ) {
        addFightToQueue({
          firstTeamName: currentTeamName,
          secondTeamName: nextOpponentTeamName,
        });
        console.log("adding fight");
        break;
      }
    }
  };

  const handleTeamTimerReset = (currentTeam: Team) => {
    console.log(currentTeam);
  };

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
            {fightQueueItems.map((data, i) => (
              <QueueCard {...data} key={i} />
            ))}
          </div>
        </div>

        <div
          className={`bg-gray-100 p-4 gap-4 flex flex-wrap flex-1 shadow-md`}
        >
          {teamsData.map(team => (
            <TeamCard
              key={team.name}
              team={team}
              onTimerDone={checkIfOpponentTeamReady}
              onTimerReset={handleTeamTimerReset}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FightsPage;
