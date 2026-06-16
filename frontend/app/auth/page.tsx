import AuthView from "./AuthView";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa" | "especialista";

type SearchParams = {
  mode?: string;
  type?: string;
  ref?: string;
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

  const referralCode =
    typeof params.ref === "string" && params.ref.trim() ? params.ref.trim() : undefined;

  return (
    <AuthView
      initialMode={initialMode}
      initialType={initialType}
      referralCode={referralCode}
    />
  );
}
