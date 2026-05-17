import AuthView from "./AuthView";
import type { AccountType } from "./AuthView";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa" | "especialista";

type SearchParams = {
  mode?: string;
  type?: string;
};

const accountTypes = new Set<string>([
  "cliente",
  "empresa",
  "especialista",
  "embajador",
]);

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const initialMode: Mode = params.mode === "register" ? "register" : "login";
  const initialType: AccountType =
    params.type === "empresa" || params.type === "especialista"
      ? params.type
      : "cliente";

  return <AuthView initialMode={initialMode} initialType={initialType} />;
}
