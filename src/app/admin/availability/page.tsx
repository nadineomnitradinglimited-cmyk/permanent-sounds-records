import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  setDayAvailabilityAction,
  addBlackoutDateAction,
  deleteBlackoutDateAction,
} from "./actions";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AdminAvailabilityPage() {
  const [windows, blackouts] = await Promise.all([
    prisma.availability.findMany(),
    prisma.blackoutDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Availability
      </h1>

      <div className="mt-6 space-y-2">
        {DAY_NAMES.map((dayName, dayOfWeek) => {
          const window = windows.find((w) => w.dayOfWeek === dayOfWeek);
          const action = setDayAvailabilityAction.bind(null, dayOfWeek);
          return (
            <form
              key={dayOfWeek}
              action={action}
              className="flex items-center gap-3 rounded-md border border-border bg-surface p-3"
            >
              <span className="w-28 text-sm font-medium">{dayName}</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="enabled"
                  defaultChecked={!!window}
                />
                Open
              </label>
              <Input
                type="time"
                name="startTime"
                defaultValue={window?.startTime ?? "10:00"}
                className="w-32"
              />
              <span className="text-muted">to</span>
              <Input
                type="time"
                name="endTime"
                defaultValue={window?.endTime ?? "18:00"}
                className="w-32"
              />
              <Button type="submit" variant="secondary">
                Save
              </Button>
            </form>
          );
        })}
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="font-display text-lg font-semibold uppercase">
          Blackout Dates
        </h2>
        <div className="mt-4 space-y-2">
          {blackouts.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface p-3 text-sm"
            >
              <span>
                {b.date.toLocaleDateString()} {b.reason ? `— ${b.reason}` : ""}
              </span>
              <form
                action={async () => {
                  "use server";
                  await deleteBlackoutDateAction(b.id);
                }}
              >
                <button className="text-muted hover:text-brand">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={addBlackoutDateAction} className="mt-4 flex gap-2">
          <Input type="date" name="date" required />
          <Input type="text" name="reason" placeholder="Reason (optional)" />
          <Button type="submit" variant="secondary">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
