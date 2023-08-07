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
    <div className="flex flex-col overflow-hidden rounded bg-gray-200">
      <div className="bg-gray-900 p-3">
        <p className="truncate text-lg font-bold text-white">{adventureName}</p>
      </div>
      <div className="p-3">
        <p className="text-lg text-gray-800">{characterName}</p>
        <p className="text-lg text-gray-800">
          {lastPlayed.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
