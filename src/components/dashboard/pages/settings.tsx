"use client";

import { useState } from "react";
import { RiCheckLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { Card, PageHeader } from "@/components/dashboard/shell";
import { CHAINS, COUNTRIES, TOKENS, updateOrg, useCurrentOrg, type Org } from "@/lib/session";

export function SettingsPage() {
  const org = useCurrentOrg();
  if (!org) return null;
  // Re-mount the form when switching orgs so it picks up the new values.
  return <SettingsForm key={org.id} org={org} />;
}

function SettingsForm({ org }: { org: Org }) {
  const [f, setF] = useState({ name: org.name, country: org.country, token: org.token, chain: org.chain, shielded: org.shielded });
  const [saved, setSaved] = useState(false);
  const dirty =
    f.name !== org.name || f.country !== org.country || f.token !== org.token || f.chain !== org.chain || f.shielded !== org.shielded;

  const save = () => {
    updateOrg(org.id, { ...f, name: f.name.trim() || org.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description={`Manage ${org.name}`}
        actions={
          <Button onClick={save} disabled={!dirty} leadingIcon={saved ? RiCheckLine : undefined}>
            {saved ? "Saved" : "Save changes"}
          </Button>
        }
      />

      <Card className="divide-y divide-neutral-100">
        <Row title="Organization" description="Shown to your team and on payslips.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={f.name} onChange={(v) => setF((p) => ({ ...p, name: v }))} />
            <Input label="Workspace URL" value={org.slug} isReadOnly leadingAddon={<span className="text-body-regular text-neutral-400">fido.app/</span>} />
            <Select label="Country" selectedKey={f.country} onSelectionChange={(k) => setF((p) => ({ ...p, country: String(k) }))}>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} id={c}>{c}</SelectItem>
              ))}
            </Select>
          </div>
        </Row>
        <Row title="Treasury" description="Default token and chain new hires are paid from.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Token" selectedKey={f.token} onSelectionChange={(k) => setF((p) => ({ ...p, token: String(k) }))}>
              {TOKENS.map((t) => (
                <SelectItem key={t} id={t}>{t}</SelectItem>
              ))}
            </Select>
            <Select label="Chain" selectedKey={f.chain} onSelectionChange={(k) => setF((p) => ({ ...p, chain: String(k) }))}>
              {CHAINS.map((c) => (
                <SelectItem key={c} id={c}>{c}</SelectItem>
              ))}
            </Select>
          </div>
        </Row>
        <Row title="Privacy" description="Control what's visible onchain.">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
            <div>
              <p className="text-body-medium text-neutral-950">Shielded payroll</p>
              <p className="mt-0.5 text-body-regular text-neutral-500">Hide amounts and recipients for every pay run.</p>
            </div>
            <Switch isSelected={f.shielded} onChange={(v) => setF((p) => ({ ...p, shielded: v }))} aria-label="Shielded payroll" />
          </div>
        </Row>
      </Card>
    </div>
  );
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 p-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-headline-medium text-neutral-950">{title}</h2>
        <p className="mt-1 text-body-regular text-neutral-500">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
