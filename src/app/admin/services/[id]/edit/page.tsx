import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { updateServiceAction } from "../../actions";

export default async function EditServicePage({
  params,
}: PageProps<"/admin/services/[id]/edit">) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl font-bold uppercase">
        Edit Service
      </h1>
      <div className="mt-6">
        <ServiceForm
          action={updateServiceAction.bind(null, service.id)}
          service={service}
        />
      </div>
    </div>
  );
}
