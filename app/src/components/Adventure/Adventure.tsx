type Props = {
  adventureName: string;
  characterName: string;
  lastPlayed: Date;
};

export default function Adventure({
  adventureName,
  characterName,
  lastPlayed,
}: Props) {
  return (
    <div className="flex flex-col rounded bg-gray-400">
      <div className="bg-gray-900">
        <p className="text-xl text-white">{adventureName}</p>
      </div>
      <div>
        <p className="text-lg text-gray-800">{characterName}</p>
        <p className="text-lg text-gray-800">{lastPlayed.toUTCString()}</p>
      </div>
    </div>
  );
}
