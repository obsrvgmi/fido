"use client";

import { useState, type FormEvent } from "react";
import { RiUserAddLine } from "@remixicon/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/base/modal/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { CHAINS, TOKENS, addEmployee, type Org } from "@/lib/session";

const DEPARTMENTS = ["Engineering", "Design", "Operations", "Finance", "Growth", "Support", "General"];

export function AddEmployeeModal({ org, isOpen, onOpenChange }: { org: Org; isOpen: boolean; onOpenChange: (o: boolean) => void }) {
  const blank = { name: "", email: "", title: "", department: "Engineering", salary: "", token: org.token, chain: org.chain };
  const [f, setF] = useState(blank);
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const valid = f.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(f.email) && Number(f.salary) > 0;

  const submit = (e: FormEvent, close: () => void) => {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    addEmployee(org.id, {
      name: f.name.trim(),
      email: f.email.trim(),
      title: f.title.trim() || "Team member",
      department: f.department,
      salary: Number(f.salary),
      token: f.token,
      chain: f.chain,
      status: "invited",
      startDate: new Date().toISOString().slice(0, 10),
    });
    setF(blank);
    setTried(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      {({ close }) => (
        <form onSubmit={(e) => submit(e, close)}>
          <ModalHeader
            icon={RiUserAddLine}
            title="Add employee"
            description="They'll get an invite to connect a wallet and confirm how they want to be paid."
          />
          <ModalBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" placeholder="Jordan Lee" value={f.name} onChange={set("name")} isInvalid={tried && f.name.trim().length < 2} autoFocus />
              <Input label="Work email" type="email" placeholder="jordan@company.com" value={f.email} onChange={set("email")} isInvalid={tried && !/^\S+@\S+\.\S+$/.test(f.email)} />
              <Input label="Job title" placeholder="Software Engineer" value={f.title} onChange={set("title")} />
              <Select label="Department" selectedKey={f.department} onSelectionChange={(k) => set("department")(String(k))}>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} id={d}>{d}</SelectItem>
                ))}
              </Select>
              <Input
                label="Monthly salary"
                placeholder="6,000"
                inputMode="numeric"
                value={f.salary}
                onChange={(v) => set("salary")(v.replace(/[^0-9]/g, ""))}
                leadingAddon={<span className="text-body-regular text-neutral-400">$</span>}
                isInvalid={tried && !(Number(f.salary) > 0)}
                hint="Paid in USD value"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Token" selectedKey={f.token} onSelectionChange={(k) => set("token")(String(k))}>
                  {TOKENS.map((t) => (
                    <SelectItem key={t} id={t}>{t}</SelectItem>
                  ))}
                </Select>
                <Select label="Chain" selectedKey={f.chain} onSelectionChange={(k) => set("chain")(String(k))}>
                  {CHAINS.map((c) => (
                    <SelectItem key={c} id={c}>{c}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit">Send invite</Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
