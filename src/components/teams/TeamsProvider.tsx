import { onValue, ref } from "firebase/database";
import {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from "react";
import { database } from "../../lib/firebase";
import { Team } from "../../pages/FightsPage";

interface IContext {
  teams: Team[];
  getTeam: (teamName: string | null, passwrod: string | null) => Team | null;
}
export const useTeams = () => {
  return useContext(TeamsContext);
};

const TeamsContext = createContext<IContext>(null!);

export const TeamsProvider = ({ children }: PropsWithChildren) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const teamsRef = ref(database, "teams");

    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeams(Object.values(data));
      }
    });
  }, []);

  const getTeam = (
    teamName: string | null,
    password: string | null
  ): Team | null => {
    const targetTeam = teams.filter(
      (team) => team.password === password && team.name === teamName
    );

    if (targetTeam.length !== 1) {
      return null;
    } else {
      return targetTeam[0];
    }
  };

  const value: IContext = {
    teams,

    getTeam,
  };

  return (
    <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
  );
};
