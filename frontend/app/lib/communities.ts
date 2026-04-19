export type CommunityMemberRole = "administrador" | "moderador" | "miembro";

export type CommunityMember = {
  id: string;
  name: string;
  role: CommunityMemberRole;
  city: string;
  joinedAt: string;
};

export type TechCommunity = {
  id: string;
  slug: string;
  name: string;
  focus: string;
  description: string;
  coverImage?: string;
  rules: string[];
  createdAt: string;
  members: CommunityMember[];
};

export type CommunityPost = {
  id: string;
  communitySlug: string;
  authorId: string;
  authorName: string;
  authorRole: CommunityMemberRole;
  body: string;
  image?: string;
  createdAt: string;
};

export type CreateCommunityInput = {
  name: string;
  focus: string;
  description: string;
  coverImage?: string;
};

export type CreateCommunityPostInput = {
  communitySlug: string;
  body: string;
  image?: string;
};

export const CURRENT_CLIENT_USER = {
  id: "client-camila-mendoza",
  name: "Camila Mendoza",
  city: "La Paz",
};

const COMMUNITIES_STORAGE_KEY = "techmarket.communities.catalog";
const COMMUNITY_POSTS_STORAGE_KEY = "techmarket.communities.posts";
export const COMMUNITIES_UPDATED_EVENT = "techmarket.communities.updated";

const EMPTY_COMMUNITIES: TechCommunity[] = [];
const EMPTY_COMMUNITY_POSTS: CommunityPost[] = [];

const seedCommunities: TechCommunity[] = [
  {
    id: "community-1",
    slug: "pc-building-bolivia",
    name: "PC Building Bolivia",
    focus: "PC Building",
    description:
      "Comunidad para quienes arman PCs desde cero, comparten configuraciones y comparan componentes por rendimiento.",
    coverImage: "/productos/monitor-ultrawide-34.jpg",
    rules: [
      "Respeta opiniones tecnicas aunque no coincidan con tu setup.",
      "Publica especificaciones completas cuando pidas ayuda.",
      "No se permite spam comercial fuera de hilos autorizados.",
    ],
    createdAt: "2026-04-10T14:10:00.000Z",
    members: [
      {
        id: "member-pc-admin",
        name: "Diego Salazar",
        role: "administrador",
        city: "Santa Cruz",
        joinedAt: "2026-04-10T14:10:00.000Z",
      },
      {
        id: "member-pc-mod-1",
        name: "Lorena Vega",
        role: "moderador",
        city: "La Paz",
        joinedAt: "2026-04-11T09:15:00.000Z",
      },
      {
        id: "member-pc-mod-2",
        name: "Pablo Arce",
        role: "moderador",
        city: "Cochabamba",
        joinedAt: "2026-04-11T10:40:00.000Z",
      },
      {
        id: CURRENT_CLIENT_USER.id,
        name: CURRENT_CLIENT_USER.name,
        role: "miembro",
        city: CURRENT_CLIENT_USER.city,
        joinedAt: "2026-04-12T12:00:00.000Z",
      },
      {
        id: "member-pc-5",
        name: "Hector Mena",
        role: "miembro",
        city: "Tarija",
        joinedAt: "2026-04-12T13:50:00.000Z",
      },
    ],
  },
  {
    id: "community-2",
    slug: "iphone-bolivia-club",
    name: "iPhone Bolivia Club",
    focus: "iPhones",
    description:
      "Espacio para hablar de iPhones, rendimiento, bateria, accesorios recomendados y dudas sobre actualizaciones.",
    coverImage: "/productos/laptop-pro-14.jpg",
    rules: [
      "Comparte modelos exactos de iPhone para recibir soporte preciso.",
      "Respeta normas de compraventa en hilos de accesorios.",
      "Evita contenido ajeno al ecosistema Apple en esta comunidad.",
    ],
    createdAt: "2026-04-09T16:30:00.000Z",
    members: [
      {
        id: "member-iphone-admin",
        name: "Camilo Ibarra",
        role: "administrador",
        city: "La Paz",
        joinedAt: "2026-04-09T16:30:00.000Z",
      },
      {
        id: "member-iphone-mod-1",
        name: "Noelia Ruiz",
        role: "moderador",
        city: "Santa Cruz",
        joinedAt: "2026-04-10T08:00:00.000Z",
      },
      {
        id: "member-iphone-mod-2",
        name: "Ivan Serrudo",
        role: "moderador",
        city: "Cochabamba",
        joinedAt: "2026-04-10T10:05:00.000Z",
      },
      {
        id: "member-iphone-4",
        name: "Lucia Soto",
        role: "miembro",
        city: "Sucre",
        joinedAt: "2026-04-11T14:22:00.000Z",
      },
    ],
  },
  {
    id: "community-3",
    slug: "comparaciones-tech",
    name: "Comparaciones Tech",
    focus: "Comparaciones",
    description:
      "Debates y comparativas objetivas entre equipos, servicios, marcas y configuraciones para decidir mejor.",
    coverImage: "/productos/teclado-tkl.jpg",
    rules: [
      "Usa datos medibles cuando compares rendimiento.",
      "Mantener tono respetuoso en desacuerdos.",
      "No publicar enlaces sin contexto tecnico.",
    ],
    createdAt: "2026-04-08T11:45:00.000Z",
    members: [
      {
        id: "member-comp-admin",
        name: "Alvaro Camacho",
        role: "administrador",
        city: "Cochabamba",
        joinedAt: "2026-04-08T11:45:00.000Z",
      },
      {
        id: "member-comp-mod-1",
        name: "Bianca Flores",
        role: "moderador",
        city: "La Paz",
        joinedAt: "2026-04-09T08:15:00.000Z",
      },
      {
        id: "member-comp-mod-2",
        name: "Mauro Vargas",
        role: "moderador",
        city: "Santa Cruz",
        joinedAt: "2026-04-09T09:40:00.000Z",
      },
      {
        id: "member-comp-4",
        name: "Renata Leon",
        role: "miembro",
        city: "Tarija",
        joinedAt: "2026-04-09T18:30:00.000Z",
      },
      {
        id: "member-comp-5",
        name: "Matias Rojas",
        role: "miembro",
        city: "La Paz",
        joinedAt: "2026-04-10T07:50:00.000Z",
      },
    ],
  },
  {
    id: "community-4",
    slug: "android-power-users",
    name: "Android Power Users",
    focus: "Android",
    description:
      "Comunidad para exprimir Android: personalizacion, optimizacion, rendimiento y comparativas de equipos.",
    coverImage: "/productos/kit-limpieza-pc.jpg",
    rules: [
      "Comparte version de Android y modelo del dispositivo.",
      "Evita publicar informacion no verificada sobre seguridad.",
      "No se permite lenguaje ofensivo en discusiones.",
    ],
    createdAt: "2026-04-07T09:05:00.000Z",
    members: [
      {
        id: "member-android-admin",
        name: "Rene Espinoza",
        role: "administrador",
        city: "Santa Cruz",
        joinedAt: "2026-04-07T09:05:00.000Z",
      },
      {
        id: "member-android-mod-1",
        name: "Violeta Paredes",
        role: "moderador",
        city: "La Paz",
        joinedAt: "2026-04-08T08:10:00.000Z",
      },
      {
        id: "member-android-mod-2",
        name: "Juan Quiroga",
        role: "moderador",
        city: "Sucre",
        joinedAt: "2026-04-08T10:40:00.000Z",
      },
      {
        id: "member-android-4",
        name: "Fernanda Calle",
        role: "miembro",
        city: "Cochabamba",
        joinedAt: "2026-04-09T15:15:00.000Z",
      },
    ],
  },
];

const seedPosts: CommunityPost[] = [
  {
    id: "community-post-1",
    communitySlug: "pc-building-bolivia",
    authorId: "member-pc-admin",
    authorName: "Diego Salazar",
    authorRole: "administrador",
    body: "Abrimos hilo oficial de builds 2026. Compartan CPU, GPU, RAM, almacenamiento y presupuesto para recomendar mejoras reales.",
    createdAt: "2026-04-17T09:40:00.000Z",
  },
  {
    id: "community-post-2",
    communitySlug: "pc-building-bolivia",
    authorId: "member-pc-mod-1",
    authorName: "Lorena Vega",
    authorRole: "moderador",
    body: "Si quieren comparar fuentes, revisen certificacion, protecciones y garantia. No se guien solo por watts declarados.",
    image: "/productos/monitor-ultrawide-34.jpg",
    createdAt: "2026-04-17T12:10:00.000Z",
  },
  {
    id: "community-post-3",
    communitySlug: "pc-building-bolivia",
    authorId: "member-pc-5",
    authorName: "Hector Mena",
    authorRole: "miembro",
    body: "Estoy armando una PC para render y gaming. Que opinan entre RTX 4070 Super y 7800 XT con presupuesto medio?",
    createdAt: "2026-04-18T15:20:00.000Z",
  },
  {
    id: "community-post-4",
    communitySlug: "iphone-bolivia-club",
    authorId: "member-iphone-admin",
    authorName: "Camilo Ibarra",
    authorRole: "administrador",
    body: "Comparte tu experiencia real de bateria en iOS 19. Modelo, salud de bateria y horas de uso para una comparativa limpia.",
    createdAt: "2026-04-17T08:05:00.000Z",
  },
  {
    id: "community-post-5",
    communitySlug: "iphone-bolivia-club",
    authorId: "member-iphone-mod-1",
    authorName: "Noelia Ruiz",
    authorRole: "moderador",
    body: "Hilo de accesorios recomendados: cargadores, magsafe, protectores y audio. Dejen marca, precio y ciudad.",
    image: "/productos/laptop-pro-14.jpg",
    createdAt: "2026-04-18T13:45:00.000Z",
  },
  {
    id: "community-post-6",
    communitySlug: "comparaciones-tech",
    authorId: "member-comp-admin",
    authorName: "Alvaro Camacho",
    authorRole: "administrador",
    body: "Comparativa abierta: laptops ultraligeras vs workstation portatil para trabajo remoto. Prioricen peso, autonomia y potencia real.",
    createdAt: "2026-04-16T17:30:00.000Z",
  },
  {
    id: "community-post-7",
    communitySlug: "comparaciones-tech",
    authorId: "member-comp-mod-1",
    authorName: "Bianca Flores",
    authorRole: "moderador",
    body: "Eviten comparaciones sin contexto. Incluyan software de uso, horas continuas y presupuesto para recomendaciones utiles.",
    createdAt: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "community-post-8",
    communitySlug: "android-power-users",
    authorId: "member-android-admin",
    authorName: "Rene Espinoza",
    authorRole: "administrador",
    body: "Hilo de optimizacion Android: compartan ajustes para mejorar fluidez sin sacrificar bateria en equipos de gama media.",
    createdAt: "2026-04-18T08:25:00.000Z",
  },
  {
    id: "community-post-9",
    communitySlug: "android-power-users",
    authorId: "member-android-mod-2",
    authorName: "Juan Quiroga",
    authorRole: "moderador",
    body: "Comparen launchers y perfiles de rendimiento con datos: RAM promedio, consumo diario y estabilidad.",
    createdAt: "2026-04-18T11:35:00.000Z",
  },
];

let cachedCatalogRaw: string | null | undefined;
let cachedCatalog: TechCommunity[] = EMPTY_COMMUNITIES;
let cachedPostsRaw: string | null | undefined;
let cachedPosts: CommunityPost[] = EMPTY_COMMUNITY_POSTS;

const isString = (value: unknown): value is string => typeof value === "string";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isCommunityMemberRole = (value: unknown): value is CommunityMemberRole =>
  value === "administrador" || value === "moderador" || value === "miembro";

const isCommunityMember = (value: unknown): value is CommunityMember => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.id) &&
    isString(candidate.name) &&
    isCommunityMemberRole(candidate.role) &&
    isString(candidate.city) &&
    isString(candidate.joinedAt)
  );
};

const isTechCommunity = (value: unknown): value is TechCommunity => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.id) &&
    isString(candidate.slug) &&
    isString(candidate.name) &&
    isString(candidate.focus) &&
    isString(candidate.description) &&
    (candidate.coverImage === undefined || isString(candidate.coverImage)) &&
    isStringArray(candidate.rules) &&
    isString(candidate.createdAt) &&
    Array.isArray(candidate.members) &&
    candidate.members.every(isCommunityMember)
  );
};

const isCommunityPost = (value: unknown): value is CommunityPost => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.id) &&
    isString(candidate.communitySlug) &&
    isString(candidate.authorId) &&
    isString(candidate.authorName) &&
    isCommunityMemberRole(candidate.authorRole) &&
    isString(candidate.body) &&
    (candidate.image === undefined || isString(candidate.image)) &&
    isString(candidate.createdAt)
  );
};

const cloneCommunity = (community: TechCommunity): TechCommunity => ({
  ...community,
  members: community.members.map((member) => ({ ...member })),
  rules: [...community.rules],
});

const clonePost = (post: CommunityPost): CommunityPost => ({ ...post });

const sortByCreatedAtDesc = <T extends { createdAt: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

const emitCommunityStoreUpdate = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(COMMUNITIES_UPDATED_EVENT));
};

const readSeedCommunities = (): TechCommunity[] => seedCommunities.map(cloneCommunity);

const readSeedPosts = (): CommunityPost[] => seedPosts.map(clonePost);

export const readCommunityCatalog = (): TechCommunity[] => {
  if (typeof window === "undefined") {
    return readSeedCommunities();
  }

  const stored = window.localStorage.getItem(COMMUNITIES_STORAGE_KEY);

  if (stored === cachedCatalogRaw) {
    return cachedCatalog;
  }

  cachedCatalogRaw = stored;

  if (!stored) {
    cachedCatalog = readSeedCommunities();
    return cachedCatalog;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      cachedCatalog = readSeedCommunities();
      return cachedCatalog;
    }

    const validated = parsed.filter(isTechCommunity).map(cloneCommunity);
    cachedCatalog = validated.length ? validated : readSeedCommunities();
    return cachedCatalog;
  } catch {
    cachedCatalog = readSeedCommunities();
    return cachedCatalog;
  }
};

export const writeCommunityCatalog = (communities: TechCommunity[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = communities.map(cloneCommunity);
  const serialized = JSON.stringify(sanitized);
  window.localStorage.setItem(COMMUNITIES_STORAGE_KEY, serialized);
  cachedCatalogRaw = serialized;
  cachedCatalog = sanitized;
  emitCommunityStoreUpdate();
};

export const readCommunityPosts = (): CommunityPost[] => {
  if (typeof window === "undefined") {
    return readSeedPosts();
  }

  const stored = window.localStorage.getItem(COMMUNITY_POSTS_STORAGE_KEY);

  if (stored === cachedPostsRaw) {
    return cachedPosts;
  }

  cachedPostsRaw = stored;

  if (!stored) {
    cachedPosts = readSeedPosts();
    return cachedPosts;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      cachedPosts = readSeedPosts();
      return cachedPosts;
    }

    const validated = parsed.filter(isCommunityPost).map(clonePost);
    cachedPosts = validated.length ? sortByCreatedAtDesc(validated) : readSeedPosts();
    return cachedPosts;
  } catch {
    cachedPosts = readSeedPosts();
    return cachedPosts;
  }
};

export const writeCommunityPosts = (posts: CommunityPost[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = sortByCreatedAtDesc(posts.map(clonePost));
  const serialized = JSON.stringify(sanitized);
  window.localStorage.setItem(COMMUNITY_POSTS_STORAGE_KEY, serialized);
  cachedPostsRaw = serialized;
  cachedPosts = sanitized;
  emitCommunityStoreUpdate();
};

export const subscribeCommunityStore = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === COMMUNITIES_STORAGE_KEY || event.key === COMMUNITY_POSTS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleCustomUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMMUNITIES_UPDATED_EVENT, handleCustomUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMMUNITIES_UPDATED_EVENT, handleCustomUpdate);
  };
};

export const getCommunityBySlug = (slug: string): TechCommunity | undefined =>
  readCommunityCatalog().find((community) => community.slug === slug);

export const isCurrentUserMember = (community: TechCommunity): boolean =>
  community.members.some((member) => member.id === CURRENT_CLIENT_USER.id);

export const joinCommunity = (slug: string): TechCommunity | null => {
  const catalog = readCommunityCatalog();
  const index = catalog.findIndex((community) => community.slug === slug);

  if (index === -1) {
    return null;
  }

  const community = catalog[index];

  if (isCurrentUserMember(community)) {
    return community;
  }

  const nextMember: CommunityMember = {
    id: CURRENT_CLIENT_USER.id,
    name: CURRENT_CLIENT_USER.name,
    role: "miembro",
    city: CURRENT_CLIENT_USER.city,
    joinedAt: new Date().toISOString(),
  };

  const updatedCommunity: TechCommunity = {
    ...community,
    members: [nextMember, ...community.members],
  };

  const nextCatalog = [...catalog];
  nextCatalog[index] = updatedCommunity;
  writeCommunityCatalog(nextCatalog);

  return updatedCommunity;
};

const slugifyCommunityName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);

const buildUniqueCommunitySlug = (baseSlug: string, existingSlugs: Set<string>): string => {
  const normalizedBase = baseSlug || "comunidad-tech";

  if (!existingSlugs.has(normalizedBase)) {
    return normalizedBase;
  }

  let attempt = 2;
  let candidate = `${normalizedBase}-${attempt}`;

  while (existingSlugs.has(candidate)) {
    attempt += 1;
    candidate = `${normalizedBase}-${attempt}`;
  }

  return candidate;
};

const defaultModeratorsForNewCommunity = (): CommunityMember[] => {
  const now = new Date().toISOString();

  return [
    {
      id: `mod-${Date.now()}-1`,
      name: "Valeria Cespedes",
      role: "moderador",
      city: "La Paz",
      joinedAt: now,
    },
    {
      id: `mod-${Date.now()}-2`,
      name: "Cristian Aramayo",
      role: "moderador",
      city: "Santa Cruz",
      joinedAt: now,
    },
  ];
};

export const createCommunity = (input: CreateCommunityInput): TechCommunity | null => {
  const normalizedName = input.name.trim();
  const normalizedFocus = input.focus.trim();
  const normalizedDescription = input.description.trim();

  if (!normalizedName || !normalizedFocus || normalizedDescription.length < 20) {
    return null;
  }

  const catalog = readCommunityCatalog();
  const slug = buildUniqueCommunitySlug(
    slugifyCommunityName(normalizedName),
    new Set(catalog.map((community) => community.slug)),
  );
  const now = new Date().toISOString();

  const ownerMember: CommunityMember = {
    id: CURRENT_CLIENT_USER.id,
    name: CURRENT_CLIENT_USER.name,
    role: "administrador",
    city: CURRENT_CLIENT_USER.city,
    joinedAt: now,
  };

  const createdCommunity: TechCommunity = {
    id: `community-${Date.now()}`,
    slug,
    name: normalizedName,
    focus: normalizedFocus,
    description: normalizedDescription,
    coverImage: input.coverImage,
    rules: [
      "Comparte contenido relacionado con el enfoque de la comunidad.",
      "Mantener un trato respetuoso entre todos los miembros.",
      "Publicaciones comerciales solo en hilos permitidos por moderacion.",
    ],
    createdAt: now,
    members: [ownerMember, ...defaultModeratorsForNewCommunity()],
  };

  writeCommunityCatalog([createdCommunity, ...catalog]);

  const currentPosts = readCommunityPosts();
  const welcomePost: CommunityPost = {
    id: `community-post-${Date.now()}`,
    communitySlug: createdCommunity.slug,
    authorId: CURRENT_CLIENT_USER.id,
    authorName: CURRENT_CLIENT_USER.name,
    authorRole: "administrador",
    body: `Bienvenidos a ${createdCommunity.name}. Este espacio esta creado para compartir conocimiento, resolver dudas y crecer como comunidad tech.`,
    createdAt: now,
  };

  writeCommunityPosts([welcomePost, ...currentPosts]);

  return createdCommunity;
};

export const getCommunityPostsBySlug = (slug: string): CommunityPost[] =>
  readCommunityPosts().filter((post) => post.communitySlug === slug);

export const createCommunityPost = (input: CreateCommunityPostInput): CommunityPost | null => {
  const normalizedBody = input.body.trim();

  if (!normalizedBody || normalizedBody.length < 8) {
    return null;
  }

  const community = getCommunityBySlug(input.communitySlug);

  if (!community) {
    return null;
  }

  const authorMember = community.members.find((member) => member.id === CURRENT_CLIENT_USER.id);

  if (!authorMember) {
    return null;
  }

  const nextPost: CommunityPost = {
    id: `community-post-${Date.now()}`,
    communitySlug: input.communitySlug,
    authorId: authorMember.id,
    authorName: authorMember.name,
    authorRole: authorMember.role,
    body: normalizedBody,
    image: input.image,
    createdAt: new Date().toISOString(),
  };

  const currentPosts = readCommunityPosts();
  writeCommunityPosts([nextPost, ...currentPosts]);

  return nextPost;
};
