"use client";

import { useActionState } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LICENSE_SLOT_DEFAULTS } from "@/lib/licenseDefaults";
import type { BeatFormState } from "@/app/admin/beats/actions";

type ExistingLicense = {
  name: string;
  priceCents: number;
  fileFormat: string;
  deliverables: string;
  usageTerms: string;
  distributionLimit: number | null;
  isExclusive: boolean;
};

type ExistingBeat = {
  title: string;
  bpm: number;
  key: string;
  genre: string;
  tags: string;
  featured: boolean;
  published: boolean;
  licenseOptions: ExistingLicense[];
};

export function BeatForm({
  action,
  beat,
}: {
  action: (state: BeatFormState, formData: FormData) => Promise<BeatFormState>;
  beat?: ExistingBeat;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  const slots = Array.from({ length: 4 }, (_, i) => {
    const existing = beat?.licenseOptions[i];
    const fallback = LICENSE_SLOT_DEFAULTS[i];
    return {
      name: existing?.name ?? fallback.name,
      price: existing ? (existing.priceCents / 100).toFixed(2) : fallback.price,
      fileFormat: existing?.fileFormat ?? fallback.fileFormat,
      deliverables: existing?.deliverables ?? fallback.deliverables,
      usageTerms: existing?.usageTerms ?? fallback.usageTerms,
      distributionLimit:
        existing?.distributionLimit?.toString() ??
        fallback.distributionLimit,
      isExclusive: existing?.isExclusive ?? fallback.isExclusive,
    };
  });

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={beat?.title} />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" name="genre" required defaultValue={beat?.genre} />
        </div>
        <div>
          <Label htmlFor="bpm">BPM</Label>
          <Input
            id="bpm"
            name="bpm"
            type="number"
            required
            defaultValue={beat?.bpm}
          />
        </div>
        <div>
          <Label htmlFor="key">Key</Label>
          <Input id="key" name="key" required defaultValue={beat?.key} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" name="tags" defaultValue={beat?.tags} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="coverArt">
            Cover Art {beat ? "(leave blank to keep current)" : ""}
          </Label>
          <Input
            id="coverArt"
            name="coverArt"
            type="file"
            accept="image/*"
            required={!beat}
          />
        </div>
        <div>
          <Label htmlFor="previewAudio">
            Preview Audio {beat ? "(leave blank to keep current)" : ""}
          </Label>
          <Input
            id="previewAudio"
            name="previewAudio"
            type="file"
            accept="audio/*"
            required={!beat}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={beat?.featured}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={beat ? beat.published : true}
          />
          Published
        </label>
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold uppercase">
          License Options
        </p>
        <div className="space-y-4">
          {slots.map((slot, i) => (
            <fieldset
              key={i}
              className="rounded-md border border-border bg-surface p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`l${i}_name`}>Name</Label>
                  <Input
                    id={`l${i}_name`}
                    name={`l${i}_name`}
                    defaultValue={slot.name}
                  />
                </div>
                <div>
                  <Label htmlFor={`l${i}_price`}>Price</Label>
                  <Input
                    id={`l${i}_price`}
                    name={`l${i}_price`}
                    type="number"
                    step="0.01"
                    defaultValue={slot.price}
                  />
                </div>
                <div>
                  <Label htmlFor={`l${i}_fileFormat`}>File Format</Label>
                  <Input
                    id={`l${i}_fileFormat`}
                    name={`l${i}_fileFormat`}
                    defaultValue={slot.fileFormat}
                  />
                </div>
                <div>
                  <Label htmlFor={`l${i}_distributionLimit`}>
                    Distribution Limit (blank = unlimited)
                  </Label>
                  <Input
                    id={`l${i}_distributionLimit`}
                    name={`l${i}_distributionLimit`}
                    type="number"
                    defaultValue={slot.distributionLimit}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`l${i}_deliverables`}>Deliverables</Label>
                  <Input
                    id={`l${i}_deliverables`}
                    name={`l${i}_deliverables`}
                    defaultValue={slot.deliverables}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`l${i}_usageTerms`}>Usage Terms</Label>
                  <Textarea
                    id={`l${i}_usageTerms`}
                    name={`l${i}_usageTerms`}
                    rows={2}
                    defaultValue={slot.usageTerms}
                  />
                </div>
                <div>
                  <Label htmlFor={`l${i}_file`}>
                    Deliverable File (leave blank to keep current)
                  </Label>
                  <Input id={`l${i}_file`} name={`l${i}_file`} type="file" />
                </div>
                <label className="flex items-center gap-2 self-end text-sm">
                  <input
                    type="checkbox"
                    name={`l${i}_exclusive`}
                    defaultChecked={slot.isExclusive}
                  />
                  Exclusive rights (unpublishes beat after purchase)
                </label>
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-brand">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : beat ? "Save Changes" : "Create Beat"}
      </Button>
    </form>
  );
}
