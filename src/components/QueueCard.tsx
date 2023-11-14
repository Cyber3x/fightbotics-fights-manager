import { FightQueueItem } from "./TeamsDataProvider";

const QueueCard = ({ firstTeamName, secondTeamName }: FightQueueItem) => {
  return (
    <div className="flex bg-green-600 px-4 py-2 justify-between items-center shadow-md text-xl">
      <div className="text-white">
        <p>
          <span className="italic">TEAM 1: </span>
          <span className="font-bold">{firstTeamName}</span>
        </p>
        <span className="italic">TEAM 2: </span>{" "}
        <span className="font-bold">{secondTeamName}</span>
      </div>
      <button className="bg-white h-8 aspect-square text-green-700 font-black shadow-md">
        X
      </button>
    </div>
  );
};

export default QueueCard;
