import AuthView from "./AuthView";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa" | "embajador";

type SearchParams = {
  mode?: string;
  type?: string;
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const initialMode: Mode = params.mode === "register" ? "register" : "login";
  const initialType: AccountType =
    params.type === "empresa" || params.type === "embajador"
      ? params.type
      : "cliente";

  return <AuthView initialMode={initialMode} initialType={initialType} />;
}
