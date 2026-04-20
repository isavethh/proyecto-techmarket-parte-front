import { CommunityFeedPost } from "./communityFeed";

export type ClientUserProfile = {
  slug: string;
  name: string;
  email: string;
  city: string;
  residenceArea: string;
  account: string;
  bio: string;
  generalInfo: string[];
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleCaseFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

export const toClientProfileSlug = (value: string): string => normalize(value) || "usuario";

export const clientUserProfiles: ClientUserProfile[] = [
  {
    slug: "camila-mendoza",
    name: "Camila Mendoza",
    email: "camila.mendoza@techmarket.bo",
    city: "La Paz",
    residenceArea: "Zona Sur",
    account: "Cliente verificado",
    bio: "Cliente activa en TechMarket enfocada en tecnologia para trabajo y productividad. Publica consultas, comparativas y recomendaciones para la comunidad.",
    generalInfo: [
      "Interes principal: laptops y productividad.",
      "Participa en la comunidad desde 2025.",
      "Prefiere soporte tecnico con respuesta rapida.",
    ],
  },
  {
    slug: "andres-cliente",
    name: "Andres Cliente",
    email: "andres.cliente@techmarket.bo",
    city: "Santa Cruz",
    residenceArea: "Equipetrol",
    account: "Miembro de comunidad",
    bio: "Usuario de la comunidad que comparte dudas de compra y experiencias reales para ayudar a otros clientes a tomar mejores decisiones.",
    generalInfo: [
      "Compara opciones antes de comprar hardware.",
      "Participa en hilos de recomendaciones.",
      "Interesado en setups para trabajo y gaming.",
    ],
  },
];

export const clientProfileSeedPosts: CommunityFeedPost[] = [
  {
    id: "user-seed-andres-1",
    author: "Andres Cliente",
    role: "Usuario de comunidad",
    time: "Hace 3 horas",
    title: "Laptop ultraligera o setup de escritorio para trabajar y jugar",
    body: "Estoy entre una laptop ultraligera y un setup de escritorio. Que recomiendan para rendimiento, portabilidad y costo?",
    tag: "Consulta",
    location: "Santa Cruz",
    createdAt: "2026-04-17T11:30:00.000Z",
  },
  {
    id: "user-seed-andres-2",
    author: "Andres Cliente",
    role: "Usuario de comunidad",
    time: "Hace 1 dia",
    title: "Review rapida: mantenimiento preventivo en laptop",
    body: "Despues de mantenimiento preventivo mejoro bastante la temperatura y el rendimiento. Lo recomiendo si usan equipo muchas horas al dia.",
    tag: "Comunidad",
    location: "Santa Cruz",
    createdAt: "2026-04-16T15:00:00.000Z",
  },
];

export const getClientUserProfileBySlug = (slug: string): ClientUserProfile | null =>
  clientUserProfiles.find((profile) => profile.slug === slug) ?? null;

export const getClientUserProfileByName = (name: string): ClientUserProfile | null =>
  clientUserProfiles.find((profile) => profile.name.toLowerCase() === name.toLowerCase()) ?? null;

export const resolveClientUserProfile = (
  slug: string,
  nameHint?: string,
  locationHint?: string,
): ClientUserProfile => {
  const normalizedSlug = toClientProfileSlug(slug);
  const bySlug = getClientUserProfileBySlug(normalizedSlug);

  if (bySlug) {
    return bySlug;
  }

  const byNameHint = nameHint ? getClientUserProfileByName(nameHint) : null;

  if (byNameHint) {
    return byNameHint;
  }

  const fallbackName = nameHint?.trim() || titleCaseFromSlug(normalizedSlug) || "Usuario";

  return {
    slug: normalizedSlug,
    name: fallbackName,
    email: `${normalizedSlug || "usuario"}@techmarket.bo`,
    city: locationHint?.trim() || "Bolivia",
    residenceArea: "No especificada",
    account: "Perfil de comunidad",
    bio: "Perfil generado desde actividad en la comunidad de TechMarket.",
    generalInfo: [
      "Publicaciones visibles para otros clientes.",
      "Participacion enfocada en consultas y recomendaciones.",
      "Perfil abierto para descubrir intereses y actividad reciente.",
    ],
  };
};

export const buildClientProfileHref = (name: string) =>
  `/cliente/perfil/${toClientProfileSlug(name)}?name=${encodeURIComponent(name)}`;
