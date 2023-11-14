import { useContext, useState } from "react";
import { TeamsDataContext } from "../components/TeamsDataProvider";
import { Link } from "react-router-dom";

const TeamsPage = () => {
  const [newTeam, setNewTeam] = useState<string>("");

  const { addTeamName, teamNames } = useContext(TeamsDataContext);

  const handleAdd = () => {
    addTeamName(newTeam);
    setNewTeam("");
  };

  return (
    <div className="p-8">
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl text-gray-500">Teams</h1>
          <Link to="/fights">Go to fights</Link>
        </div>
        <div className="text-xl space-y-1">
          {teamNames.map((teamName, i) => (
            <p>
              <span className="text-gray-500">{i + 1}.</span> {teamName}
            </p>
          ))}
        </div>
        <div className="space-x-4 mt-4">
          <input
            className="border-2 border-gray-400 rounded-sm py-2 px-4"
            placeholder="teamname"
            onChange={(e) => setNewTeam(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            value={newTeam}
          />
          <button
            className="bg-green-500 p-2 uppercase px-8"
            onClick={handleAdd}
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
