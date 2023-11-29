import { useEffect, useState } from "react";
import { onValue, ref, remove, set } from "firebase/database";
import { auth, database } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Team } from "./FightsPage";
import { generateRandomString } from "../lib/utils";
import { useSignOut } from "react-firebase-hooks/auth";
import ErrorMessage from "../components/ErrorMessage";

const TeamsPage = () => {
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [signOut] = useSignOut(auth);

  const navigate = useNavigate();

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

  /**
   * Removes a team from the database.
   *
   * @param {string} teamName - The name of the team to be removed.
   * @return {Promise<void>} Returns a promise that resolves when the team is successfully removed, or rejects with an error if an error occurs.
   */
  const removeTeam = async (targetTeamName: string) => {
    try {
      await remove(ref(database, "teams/" + targetTeamName));
    } catch (error) {
      console.error(`error while deleting team ${targetTeamName}: `, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (newTeamName === "") return;

    if (teams.filter((x) => x.name === newTeamName).length > 0) {
      setErrorMessage("Team with this name already exists");
      return;
    }

    try {
      const newTeam: Team = {
        name: newTeamName,
        opponentName: "",
        timeLeft: 10,
        isTimerRunning: false,
        isReady: false,
        fightTime: 600,
        fightStart: false,
        password: generateRandomString(5),
      };
      await set(ref(database, "teams/" + newTeamName), newTeam);

      setNewTeamName("");
    } catch (error) {
      console.error("Error creating team:", error);
      setErrorMessage(
        "Error while creating new team. Please call a technician"
      );
    }
  };

  return (
    <div className="p-8">
      <div className="bg-gray-100 p-4">
        <div className="flex justify-between mb-8">
          <h1 className="text-5xl text-gray-500">Teams</h1>
          <div className="flex space-x-4">
            <p
              className="text-green-700 hover:underline text-md pr-4"
              onClick={async () => {
                const success = await signOut();
                if (success) navigate("/admin", { replace: true });
              }}
            >
              Logout
            </p>
            <Link
              className="text-green-700 hover:underline text-md pr-4"
              to="/fights"
            >
              Go to fights
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <table className="table-auto border-collapse border border-slate-200">
            <thead>
              <tr>
                <th className="px-2 border border-slate-400">x</th>
                <th className="py-1 px-4 border border-slate-400 ">Remove</th>
                <th className="py-1 px-4 border border-slate-400">
                  Access code
                </th>
                <th className="p-1 pl-2 text-left border border-slate-400">
                  Team name
                </th>
              </tr>
            </thead>

            <tbody>
              {teams.map(({ name, password }, i) => (
                <tr key={name}>
                  <td className="border border-slate-400 p-1">{i + 1}.</td>
                  <td
                    className="text-red-400 text-sm p-1 text-center font-semibold hover:underline hover:text-red-500 hover:cursor-pointer border border-slate-400"
                    onClick={() => removeTeam(name)}
                  >
                    REMOVE
                  </td>
                  <td className="border p-1 border-slate-400 text-center">
                    {password}
                  </td>
                  <td className="border p-1 pl-2 border-slate-400">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <form onSubmit={handleSubmit} className="space-x-4">
            <input
              className="border-2 border-gray-400 rounded-sm py-2 px-4 focus:outline-none focus:ring-green-700 focus:ring-2"
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter new team name"
            />
            <button
              className="bg-green-600 hover:bg-green-700 p-2 uppercase px-8 text-white font-bold"
              type="submit"
            >
              ADD TEAM
            </button>
          </form>
          {errorMessage && (
            <ErrorMessage
              errorMessage={errorMessage}
              onDelete={() => setErrorMessage("")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
