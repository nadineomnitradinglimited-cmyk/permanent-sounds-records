"use client";

import { useActionState } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ServiceFormState } from "@/app/admin/services/actions";

type ExistingService = {
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  depositCents: number;
  active: boolean;
};

export function ServiceForm({
  action,
  service,
}: {
  action: (
    state: ServiceFormState,
    formData: FormData,
  ) => Promise<ServiceFormState>;
  service?: ExistingService;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={service?.name} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={service?.description}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="durationMinutes">Duration (min)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            required
            defaultValue={service?.durationMinutes}
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={
              service ? (service.priceCents / 100).toFixed(2) : undefined
            }
          />
        </div>
        <div>
          <Label htmlFor="deposit">Deposit</Label>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            step="0.01"
            required
            defaultValue={
              service ? (service.depositCents / 100).toFixed(2) : undefined
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={service ? service.active : true}
        />
        Active
      </label>

      {state.error && <p className="text-sm text-brand">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : service ? "Save Changes" : "Add Service"}
      </Button>
    </form>
  );
}
