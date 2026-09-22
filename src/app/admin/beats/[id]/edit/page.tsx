import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BeatForm } from "@/components/admin/BeatForm";
import { updateBeatAction } from "../../actions";

export default async function EditBeatPage({
  params,
}: PageProps<"/admin/beats/[id]/edit">) {
  const { id } = await params;

  const beat = await prisma.beat.findUnique({
    where: { id },
    include: { licenseOptions: { orderBy: { sortOrder: "asc" } } },
  });

  if (!beat) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Edit Beat
      </h1>
      <div className="mt-6">
        <BeatForm action={updateBeatAction.bind(null, beat.id)} beat={beat} />
      </div>
    </div>
  );
}
