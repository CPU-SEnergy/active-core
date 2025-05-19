"use client";
import CoachDisplay from "./CoachDisplay";

type DisplayMode = "name" | "profile" | "avatar";

export default function CoachList({
  coachIds,
  displayMode = "name",
}: {
  coachIds: string[];
  displayMode?: DisplayMode;
}) {
  if (!coachIds || coachIds.length === 0) {
    return <span>No coaches assigned</span>;
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {coachIds.map((id, index) => (
        <span key={id} className="flex items-center">
          <CoachDisplay coachId={id} displayMode={displayMode} />
          {index < coachIds.length - 1 && <span className="mx-1">,</span>}
        </span>
      ))}
    </div>
  );
}
