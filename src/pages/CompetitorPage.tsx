import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../lib/firebase";
import { cn } from "../lib/utils";

const CompetitorPage = () => {
  const [teamName, setTeamName] = useState(localStorage.getItem("teamName") || "");
  const [password, setPassword] = useState(localStorage.getItem("password") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login") === "true" || false);
  const [repairTimer, setRepairTimer] = useState(0);
  const [ready, setReady] = useState(false);

  /**
   * Handles the login process for the component.
   *
   * @return {Promise<void>} - Returns a promise that resolves when the login process is complete.
   */
  const handleCompLogin = async () => {
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTeams = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        fetchedTeams.forEach(team => {
          if (teamName === team.name && password === team.password) {
            setIsLoggedIn(true);
            localStorage.setItem("login", "true");
          }
        });
      }
    });
  }

  const timerMmSs = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes,
      seconds: seconds,
    };
  };

  useEffect(() => {
    const teamsRef = ref(database, "teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedTeams = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        fetchedTeams.forEach(team => {
          if (isLoggedIn && team.name === teamName) {
            setRepairTimer(team.timeLeft);
            setReady(team.isReady);
          }
        });
      }
    });
  })

  return (
    <>
      {!isLoggedIn && (
        <div className="text-center flex flex-col">
          <form onSubmit={handleCompLogin}>
            <label htmlFor="teamName">Team Name:</label><br />
            <input
              className="border-2 border-gray-400 rounded-sm py-2 px-4"
              type="text"
              value={teamName}
              onChange={(e) => { setTeamName(e.target.value), localStorage.setItem("teamName", e.target.value) }}
              placeholder="Enter team name"
            /><br />
            <label htmlFor="password">Password:</label><br />
            <input
              className="border-2 border-gray-400 rounded-sm py-2 px-4"
              type="text"
              value={password}
              onChange={(e) => { setPassword(e.target.value), localStorage.setItem("password", e.target.value) }}
              placeholder="Enter password"
            /><br />
            <button
              className="bg-green-500 p-2 uppercase px-8 mt-4"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      )}

      {isLoggedIn && (
        <div className="text-center flex flex-col justify-center">
          <div className="bg-gray-100 p-4 w-full">
            <p className="text-5xl bg-gray-100">{teamName.toUpperCase()}</p>
          </div>
          <div className="text-3xl  text-blue-500 mb-6 mt-6">
            <h3>REPAIR TIME LEFT:</h3>
          </div>
          <h3 className="text-4xl mb-6 mt-6">{timerMmSs(Number(repairTimer)).minutes < 10
            ? "0" + timerMmSs(Number(repairTimer)).minutes
            : timerMmSs(Number(repairTimer)).minutes}
            :
            {timerMmSs(Number(repairTimer)).seconds < 10
            ? "0" + timerMmSs(Number(repairTimer)).seconds
            : timerMmSs(Number(repairTimer)).seconds}</h3><br />
          <div>
            <button className={cn("h-12 rounded-sm font-black mt-4 bg-red-700 text-white w-1/4", ready ? "bg-red-500" : "bg-green-500")} onClick={() => update(ref(database, "teams/" + teamName), { isReady: !ready })}>
              {ready ? "Not ready" : "Ready"}
            </button>
          </div>
          <div>
            <button className="h-12 rounded-sm font-black mt-4 bg-red-700 text-white w-1/4" onClick={() => {localStorage.clear(), window.location.reload()}}>
              LOGOUT
            </button>
          </div>
        </div>

      )}
    </>
  );
};

export default CompetitorPage;