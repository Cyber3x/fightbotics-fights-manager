import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface ITeamsContext {
  teamsData: Team[];
  fightQueueItems: FightQueueItem[];

  addTeamName: (teamName: string) => void;
  addFightToQueue: (item: FightQueueItem) => void;
}

export type FightQueueItem = {
  firstTeamName: string;
  secondTeamName: string;
};

export class Team {
  name: string;
  nextOpponentTeamName: string;

  constructor(name: string) {
    this.name = name;
    this.nextOpponentTeamName = "";
  }

  setNextOpponentTeamName(name: string) {
    this.nextOpponentTeamName = name;
  }
}

const TeamsDataContext = createContext<ITeamsContext>(null!);

const TeamsDataProvider = ({ children }: PropsWithChildren) => {
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [fightQueueItems, setFightQueueItems] = useState<FightQueueItem[]>([]);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      addTeamName("test" + (i + 1));
    }
  }, []);

  const addTeamName = (teamName: string) => {
    if (teamName === "") return;

    setTeamsData(state => [...state, new Team(teamName)]);
  };

  const addFightToQueue = (item: FightQueueItem) => {
    setFightQueueItems(state => [...state, item]);
  };

  const value = {
    teamsData,
    fightQueueItems,
    addFightToQueue,

    addTeamName,
  };

  return (
    <TeamsDataContext.Provider value={value}>
      {children}
    </TeamsDataContext.Provider>
  );
};

export { TeamsDataProvider, TeamsDataContext };
