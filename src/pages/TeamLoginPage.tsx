import { useState } from "react";

import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { useTeams } from "../components/teams/TeamsProvider";

const TeamLoginPage = () => {
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { teams } = useTeams();

  const navigate = useNavigate();

  function onTeamLogin() {
    let found = false;
    for (const team of teams) {
      if (team.name === selectedTeamName && password === team.password) {
        localStorage.setItem("teamName", team.name);
        localStorage.setItem("password", team.password);
        found = true;
        break;
      }
    }

    if (found) {
      navigate("/team", { replace: true });
    } else {
      setError("Password is not correct, try again or contact admins.");
    }
  }

  return (
    <div className="lg:bg-gray-100 pt-52 h-screen">
      <div className="bg-white lg:w-[30rem] lg:mx-auto p-12 space-y-8 rounded-sm lg:shadow-md">
        <h1 className="text-center lg:text-4xl sm:text-3xl text-2xl text-gray-500">
          Team Login
        </h1>
        <form className="space-y-4">
          <div className="flex flex-col space-y-2 items-start mb-4">
            <label htmlFor="team-name" className="text-gray-600 font-semibold">
              Team name
            </label>
            <select
              className="border-2 border-gray-300 rounded-sm py-2 px-4 w-full"
              id="team-name"
              name="team-name"
              required
              value={selectedTeamName}
              placeholder="Email address"
              onChange={(e) => setSelectedTeamName(e.target.value)}
            >
              <option disabled value="">
                Select your team
              </option>
              {teams.map((team) => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2 items-start">
            <label htmlFor="password" className="text-gray-600 font-semibold">
              Password
            </label>
            <input
              className="border-2 border-gray-300 rounded-sm py-2 px-4 w-full"
              id="password"
              name="password"
              type="password"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-green-500 p-2 mt-8 uppercase w-full text-white font-semibold hover:bg-green-600"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              onTeamLogin();
            }}
            value={"Login"}
          >
            Login
          </button>
          {error && (
            <ErrorMessage errorMessage={error} onDelete={() => setError("")} />
          )}
        </form>
      </div>
    </div>
  );
};
//       {!isLoggedIn && (
//         <div className="text-center flex flex-col">
//           <form onSubmit={handleCompLogin}>
//             <label htmlFor="teamName">Team Name:</label>
//             <br />
//             <input
//               className="border-2 border-gray-400 rounded-sm py-2 px-4"
//               type="text"
//               value={teamName}
//               onChange={(e) => {
//                 setTeamName(e.target.value),
//                   localStorage.setItem("teamName", e.target.value);
//               }}
//               placeholder="Enter team name"
//             />
//             <br />
//             <label htmlFor="password">Password:</label>
//             <br />
//             <input
//               className="border-2 border-gray-400 rounded-sm py-2 px-4"
//               type="text"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value),
//                   localStorage.setItem("password", e.target.value);
//               }}
//               placeholder="Enter password"
//             />
//             <br />
//             <button
//               className="bg-green-500 p-2 uppercase px-8 mt-4"
//               type="submit"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       )}

//       {isLoggedIn && (
//         <div className="text-center flex flex-col justify-center">
//           <div className="bg-gray-100 p-4 w-full">
//             <p className="text-5xl bg-gray-100">{teamName.toUpperCase()}</p>
//           </div>
//           <div className="text-3xl  text-blue-500 mb-6 mt-6">
//             <h3>REPAIR TIME LEFT:</h3>
//           </div>
//           <h3 className="text-4xl mb-6 mt-6">
//             {timerMmSs(Number(repairTimer)).minutes < 10
//               ? "0" + timerMmSs(Number(repairTimer)).minutes
//               : timerMmSs(Number(repairTimer)).minutes}
//             :
//             {timerMmSs(Number(repairTimer)).seconds < 10
//               ? "0" + timerMmSs(Number(repairTimer)).seconds
//               : timerMmSs(Number(repairTimer)).seconds}
//           </h3>
//           <br />
//           <div>
//             <button
//               className={cn(
//                 "h-12 rounded-sm font-black mt-4 bg-red-700 text-white w-1/4",
//                 ready ? "bg-red-500" : "bg-green-500"
//               )}
//               onClick={() =>
//                 update(ref(database, "teams/" + teamName), { isReady: !ready })
//               }
//             >
//               {ready ? "Not ready" : "Ready"}
//             </button>
//           </div>
//           <div>
//             <button
//               className="h-12 rounded-sm font-black mt-4 bg-red-700 text-white w-1/4"
//               onClick={() => {
//                 localStorage.clear(), window.location.reload();
//               }}
//             >
//               LOGOUT
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

export default TeamLoginPage;
