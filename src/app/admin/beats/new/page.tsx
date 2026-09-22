import { BeatForm } from "@/components/admin/BeatForm";
import { createBeatAction } from "../actions";

export default function NewBeatPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">Add Beat</h1>
      <div className="mt-6">
        <BeatForm action={createBeatAction} />
      </div>
    </div>
  );
}
