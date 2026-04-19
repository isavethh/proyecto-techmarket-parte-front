import { ReactNode } from "react";
import ClientExperienceShell from "../components/ClientExperienceShell";

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return <ClientExperienceShell>{children}</ClientExperienceShell>;
}
