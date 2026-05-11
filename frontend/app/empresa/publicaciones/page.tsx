"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CompanyPageHeader } from "../../components/CompanyPageSections";
import { CommunityFeedPost, upsertCommunityFeedPosts } from "../../lib/communityFeed";
import { CompanySidebar } from "../CompanySidebar";

type MainFilter =
  | "Publicaciones"
  | "Productos disponibles"
  | "Servicios"
  | "Ofertas y promociones"
  | "Publicaciones de interacción"
  | "Publicaciones de texto";
type InteractionFilter = "Encuestas" | "Lista de usuarios que interactúan";
type SurveyFormData = {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
};

const mainFilters: MainFilter[] = [
  "Publicaciones",
  "Productos disponibles",
  "Publicaciones de texto",
  "Servicios",
  "Ofertas y promociones",
  "Publicaciones de interacción",
];

const interactionFilters: InteractionFilter[] = [
  "Encuestas",
  "Lista de usuarios que interactúan",
];

const mainFilterLabels: Record<MainFilter, string> = {
  Publicaciones: "Publicaciones",
  "Productos disponibles": "Productos",
  "Publicaciones de texto": "Texto",
  Servicios: "Servicios",
  "Ofertas y promociones": "Ofertas",
  "Publicaciones de interacción": "Interacción",
};

const interactionFilterLabels: Record<InteractionFilter, string> = {
  Encuestas: "Encuestas",
  "Lista de usuarios que interactúan": "Usuarios que interactúan",
};

const company = {
  name: "TechMarket Santa Cruz",
  logo: "TC",
};

const buildCommunityFeedPost = (
  id: string,
  title: string,
  message: string,
  image: string | undefined,
  tag: string,
  createdAt: string,
): CommunityFeedPost => ({
  id,
  author: company.name,
  role: "Empresa verificada",
  time: "Reciente",
  title,
  body: message,
  tag,
  location: "Comunidad TechMarket",
  image,
  createdAt,
});

type ProductCard = {
  id: string;
  name: string;
  description: string;
  price?: string;
  status: string;
  image: string;
};

type ServiceCard = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
};

type OfferCard = {
  id: string;
  title: string;
  description: string;
  currentPrice: string;
  previousPrice?: string;
  label: string;
  image: string;
};

type SurveyCard = {
  id: string;
  question: string;
  options: string[];
  votes: number;
};

type PostCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image?: string;
};

type UserCard = {
  id: string;
  name: string;
  avatar: string;
  activity: string;
};

type InteractionNotification = {
  id: string;
  userName: string;
  productName: string;
  userId: string;
};

type PublicationFormData = {
  title: string;
  targetFilter: MainFilter;
  description: string;
  price: string;
  previousPrice: string;
  label: "Oferta" | "Promocion";
  image: string;
};

type TextPublicationCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image: string;
};

type ProductEditForm = {
  name: string;
  description: string;
  price: string;
  status: string;
  image: string;
};

type ServiceEditForm = {
  name: string;
  description: string;
  price: string;
  image: string;
};

type OfferEditForm = {
  title: string;
  description: string;
  currentPrice: string;
  previousPrice: string;
  label: string;
  image: string;
};

type PublicationPreview = {
  id: string;
  kind: "Producto" | "Servicio" | "Oferta" | "Publicacion";
  title: string;
  description: string;
  image?: string;
  price?: string;
  status?: string;
  date?: string;
};

type PublicationMetric = {
  label: string;
  value: string;
  trend: string;
};

type CompanyFeedItem = {
  id: string;
  kind: "Producto" | "Servicio" | "Oferta" | "Publicacion" | "Encuesta" | "Texto";
  title: string;
  description: string;
  date: string;
  tag: string;
  image?: string;
  price?: string;
  status?: string;
  options?: string[];
  preview: PublicationPreview;
};

type PublicationComment = {
  id: string;
  author: string;
  text: string;
  time: string;
};

type PublicationSocialState = {
  likes: number;
  liked: boolean;
  comments: PublicationComment[];
};

function createInitialPublicationSocial(
  item: Pick<CompanyFeedItem, "id" | "title" | "kind">,
  index = 0,
): PublicationSocialState {
  const baseLikes = 8 + (index % 5) * 3;

  const comments: PublicationComment[] = [
    {
      id: `comment-${item.id}-1`,
      author: "Alejandro",
      text:
        item.kind === "Producto"
          ? "Tienen disponibilidad inmediata?"
          : item.kind === "Servicio"
            ? "Atienden esta semana?"
            : item.kind === "Oferta"
              ? "La promocion sigue activa?"
              : "Me interesa, podrian darme mas informacion?",
      time: "Hace 12 min",
    },
    {
      id: `comment-${item.id}-2`,
      author: "Laura P.",
      text: "Se ve interesante, me gustaria saber mas detalles.",
      time: "Hace 1 h",
    },
  ];

  return {
    likes: baseLikes,
    liked: false,
    comments,
  };
}

function buildPublicationMetrics(publicationId: string): PublicationMetric[] {
  const seed = publicationId
    .split("")
    .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);

  const views = 900 + (seed % 1400);
  const interactions = 36 + (seed % 190);
  const chats = 4 + (seed % 22);
  const ctr = ((interactions / views) * 100).toFixed(1);

  return [
    {
      label: "Vistas",
      value: views.toLocaleString("es-BO"),
      trend: "+12% vs semana anterior",
    },
    {
      label: "Interacciones",
      value: interactions.toString(),
      trend: "Likes y comentarios",
    },
    {
      label: "Chats iniciados",
      value: chats.toString(),
      trend: "Contactos desde esta publicacion",
    },
    {
      label: "CTR estimado",
      value: `${ctr}%`,
      trend: "Rendimiento de conversion",
    },
  ];
}

function LikeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12.1 21.35 10.55 19.94C5.14 15.06 2 12.24 2 8.78 2 5.96 4.24 3.75 7.06 3.75c1.57 0 3.08.73 4.04 1.88.96-1.15 2.47-1.88 4.04-1.88 2.82 0 5.06 2.21 5.06 5.03 0 3.46-3.14 6.28-8.55 11.16l-.55.52Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M4 4.75h16A1.75 1.75 0 0 1 21.75 6.5v9A1.75 1.75 0 0 1 20 17.25H9.58l-4.41 3.38a.75.75 0 0 1-1.17-.6v-2.78A1.75 1.75 0 0 1 2.25 15.5v-9A1.75 1.75 0 0 1 4 4.75Zm0 1.5a.25.25 0 0 0-.25.25v9c0 .14.11.25.25.25h.5v3.13l4.09-3.13H20a.25.25 0 0 0 .25-.25v-9a.25.25 0 0 0-.25-.25H4Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M3.4 20.45 20.8 12 3.4 3.55a.75.75 0 0 0-1.05.88l1.97 6.02L15 12l-10.68 1.55-1.97 6.02a.75.75 0 0 0 1.05.88Zm3.68-7.2L18.2 12 7.08 10.75l-.93-2.84L18.2 12 6.15 16.09l.93-2.84Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.75a4.25 4.25 0 0 0-4.25 4.25v1.02c0 .73-.2 1.45-.58 2.08l-.72 1.19a5.72 5.72 0 0 0-.82 2.96V16c0 .97.78 1.75 1.75 1.75h9.24c.97 0 1.75-.78 1.75-1.75v-1.75c0-1.05-.29-2.08-.82-2.96l-.72-1.19a4.05 4.05 0 0 1-.58-2.08V7A4.25 4.25 0 0 0 12 2.75Zm0 18.5a2.6 2.6 0 0 0 2.45-1.75h-4.9A2.6 2.6 0 0 0 12 21.25Z" />
    </svg>
  );
}

function PublicationActionButton({
  icon,
  label,
  href,
  primary = false,
}: {
  icon?: ReactNode;
  label: string;
  href?: string;
  primary?: boolean;
}) {
  const className = primary
    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10";

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {icon}
      {label}
    </button>
  );
}

const products: ProductCard[] = [
  {
    id: "prod-1",
    name: "Laptop Pro 14",
    description: "Intel i7, 16 GB RAM, SSD 512 GB para trabajo y estudio.",
    price: "Bs 3.650.000",
    status: "Disponible",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "prod-2",
    name: "Monitor UltraWide 34",
    description: "Pantalla amplia 3440 x 1440 para productividad y diseño.",
    price: "Bs 1.480.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "prod-3",
    name: "Teclado mecanico TKL",
    description: "Switch azul, RGB y formato compacto para setups modernos.",
    price: "Bs 260.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-4",
    name: "Kit limpieza PC",
    description: "Brochas, aire y pasta termica para cuidado de equipos.",
    price: "Bs 85.000",
    status: "Disponible",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "prod-5",
    name: "Mouse ergonomico",
    description: "Comodidad para jornadas largas de oficina o estudio.",
    price: "Bs 95.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-6",
    name: "Cableado de red Cat 6",
    description: "Solucion para instalacion estable en oficinas y hogares.",
    price: "Bs 12.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

const services: ServiceCard[] = [
  {
    id: "serv-1",
    name: "Reparacion de laptops",
    description: "Diagnostico, mantenimiento y correccion de fallas tecnicas.",
    price: "Consultar",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "serv-2",
    name: "Instalacion de redes",
    description: "Cableado, configuracion y pruebas para conectividad estable.",
    price: "Bs 120.000",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "serv-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza interna, control de temperatura y optimizacion.",
    price: "Bs 95.000",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "serv-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia rapida para configuraciones y solucion de errores.",
    price: "Bs 65.000",
    image: "/productos/teclado-tkl.jpg",
  },
];

const offers: OfferCard[] = [
  {
    id: "offer-1",
    title: "Descuento en diagnostico + limpieza",
    description: "Promo especial para equipos con bajo rendimiento o sobrecalentamiento.",
    currentPrice: "Bs 95.000",
    previousPrice: "Bs 140.000",
    label: "Oferta",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "offer-2",
    title: "Combo empresarial para pequenas oficinas",
    description: "Instalacion de red, soporte remoto y acompanamiento mensual.",
    currentPrice: "Bs 420.000",
    previousPrice: "Bs 520.000",
    label: "Promocion",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "offer-3",
    title: "Pack limpieza premium",
    description: "Limpieza interna + revision termica con descuento por tiempo limitado.",
    currentPrice: "Bs 110.000",
    previousPrice: "Bs 150.000",
    label: "Oferta",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "offer-4",
    title: "Servicio rapido de soporte",
    description: "Atencion prioritaria para problemas frecuentes de software.",
    currentPrice: "Bs 55.000",
    previousPrice: "Bs 75.000",
    label: "Promocion",
    image: "/productos/laptop-pro-14.jpg",
  },
];

const surveys: SurveyCard[] = [
  {
    id: "survey-1",
    question: "Que servicio necesitas con mas frecuencia?",
    options: ["Diagnostico", "Mantenimiento", "Redes", "Soporte remoto"],
    votes: 184,
  },
  {
    id: "survey-2",
    question: "Que producto te interesa mas para tu trabajo?",
    options: ["Laptop", "Monitor", "Teclado", "Mouse"],
    votes: 132,
  },
  {
    id: "survey-3",
    question: "Que canal prefieres para contacto rapido?",
    options: ["Chat", "WhatsApp", "Telefono", "Correo"],
    votes: 211,
  },
];

const posts: PostCard[] = [
  {
    id: "post-1",
    title: "Nueva llegada de equipos para trabajo y estudio",
    message: "Ya estan disponibles nuevos modelos de alto rendimiento para usuarios exigentes.",
    date: "17 abr 2026",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "post-2",
    title: "Consejo rapido: mejora la vida util de tu laptop",
    message: "Mantener limpieza interna y ventilacion correcta ayuda a evitar fallas por temperatura.",
    date: "16 abr 2026",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "post-3",
    title: "Anuncio para empresas pequenas",
    message: "Activamos acompanamiento tecnico mensual para oficinas con soporte prioritario.",
    date: "15 abr 2026",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

const textPosts: TextPublicationCard[] = [
  {
    id: "text-1",
    title: "Atencion tecnica sin costo de evaluacion",
    message: "Si tu equipo esta lento, escribenos por chat y te orientamos con una primera revision sin compromiso.",
    date: "17 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-2",
    title: "Consejo para empresas pequenas",
    message: "Mantener un respaldo semanal evita perdida de informacion y reduce tiempos muertos en oficina.",
    date: "16 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-3",
    title: "Soporte rapido por mensaje",
    message: "Escribenos si necesitas diagnostico, instalacion o mantenimiento. Respondemos desde Santa Cruz.",
    date: "15 abr 2026",
    image: "/productos/charla.png",
  },
];

const users: UserCard[] = [
  { id: "user-5", name: "Alejandro", avatar: "AL", activity: "Busco Laptop Pro 14 hace 2 min" },
  { id: "user-1", name: "Carlos M.", avatar: "CM", activity: "Dio like a un producto hace 1 hora" },
  { id: "user-2", name: "Laura P.", avatar: "LP", activity: "Participo en una encuesta hace 3 horas" },
  { id: "user-3", name: "Sofia R.", avatar: "SR", activity: "Comento una publicacion informativa" },
  { id: "user-4", name: "Andres T.", avatar: "AT", activity: "Reacciono a una promocion activa" },
];

const latestInteractionNotification: InteractionNotification = {
  id: "notif-alejandro-1",
  userName: "Alejandro",
  productName: "Laptop Pro 14",
  userId: "user-5",
};

export default function PublicacionesPage() {
  const [activeFilter, setActiveFilter] = useState<MainFilter>("Publicaciones");
  const [activeInteractionFilter, setActiveInteractionFilter] = useState<InteractionFilter>("Encuestas");
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<Record<string, string>>({});
  const [showInteractionNotice, setShowInteractionNotice] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);
  const [productItems, setProductItems] = useState<ProductCard[]>(products);
  const [serviceItems, setServiceItems] = useState<ServiceCard[]>(services);
  const [offerItems, setOfferItems] = useState<OfferCard[]>(offers);
  const [postItems, setPostItems] = useState<PostCard[]>(posts);
  const [textPostItems, setTextPostItems] = useState<TextPublicationCard[]>(textPosts);
  const [showProductEditModal, setShowProductEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productEditMessage, setProductEditMessage] = useState("");
  const [productEditImageName, setProductEditImageName] = useState("");
  const [productEditFileKey, setProductEditFileKey] = useState(0);
  const [productEditForm, setProductEditForm] = useState<ProductEditForm>({
    name: "",
    description: "",
    price: "",
    status: "Disponible",
    image: "",
  });
  const [showServiceEditModal, setShowServiceEditModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceEditMessage, setServiceEditMessage] = useState("");
  const [serviceEditImageName, setServiceEditImageName] = useState("");
  const [serviceEditFileKey, setServiceEditFileKey] = useState(0);
  const [serviceEditForm, setServiceEditForm] = useState<ServiceEditForm>({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [showOfferEditModal, setShowOfferEditModal] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerEditMessage, setOfferEditMessage] = useState("");
  const [offerEditImageName, setOfferEditImageName] = useState("");
  const [offerEditFileKey, setOfferEditFileKey] = useState(0);
  const [offerEditForm, setOfferEditForm] = useState<OfferEditForm>({
    title: "",
    description: "",
    currentPrice: "",
    previousPrice: "",
    label: "Oferta",
    image: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<PublicationPreview | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [publicationSocial, setPublicationSocial] = useState<Record<string, PublicationSocialState>>({});
  const [publishMessage, setPublishMessage] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [formData, setFormData] = useState<PublicationFormData>({
    title: "",
    targetFilter: "Productos disponibles",
    description: "",
    price: "",
    previousPrice: "",
    label: "Oferta",
    image: "",
  });
  const [surveyItems, setSurveyItems] = useState<SurveyCard[]>(surveys);
  const [showSurveyCreateModal, setShowSurveyCreateModal] = useState(false);
  const [surveyCreateMessage, setSurveyCreateMessage] = useState("");
  const [surveyForm, setSurveyForm] = useState<SurveyFormData>({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const isServicesView = activeFilter === "Servicios";
  const isTextView = activeFilter === "Publicaciones de texto";
  const isOfferView = activeFilter === "Ofertas y promociones";
  const createButtonLabel =
    activeFilter === "Publicaciones"
      ? showCreateForm
        ? "Cerrar formulario"
        : "Agregar publicacion"
      : activeFilter === "Publicaciones de interacción"
        ? activeInteractionFilter === "Encuestas"
          ? "Agregar encuesta"
          : ""
        : activeFilter === "Productos disponibles"
          ? showCreateForm
            ? "Cerrar formulario"
            : "Agregar producto"
          : isServicesView
            ? showCreateForm
              ? "Cerrar formulario de servicio"
              : "Agregar servicio"
            : isTextView
              ? showCreateForm
                ? "Cerrar formulario de texto"
                : "Agregar texto"
              : isOfferView
                ? showCreateForm
                  ? "Cerrar formulario de oferta"
                  : "Agregar oferta"
                : showCreateForm
                  ? "Cerrar formulario"
                  : "Agregar publicacion";

  const createFormTitle = isServicesView
    ? "Nuevo servicio"
    : isTextView
      ? "Nueva publicacion de texto"
    : isOfferView
      ? "Nueva oferta o promocion"
    : "Nueva publicacion";

  const submitButtonLabel = isServicesView
    ? "Publicar servicio"
    : isTextView
      ? "Publicar texto"
    : isOfferView
      ? "Publicar oferta o promocion"
    : "Publicar";

  const totalPublicationItems =
    productItems.length +
    serviceItems.length +
    offerItems.length +
    postItems.length +
    textPostItems.length +
    surveyItems.length;

  const allFeedItemsCount = totalPublicationItems;

  const activeItemsCount =
    activeFilter === "Publicaciones"
      ? allFeedItemsCount
      : activeFilter === "Productos disponibles"
        ? productItems.length
        : activeFilter === "Servicios"
          ? serviceItems.length
          : activeFilter === "Ofertas y promociones"
            ? offerItems.length
            : activeFilter === "Publicaciones de texto"
              ? textPostItems.length
              : activeInteractionFilter === "Encuestas"
                ? surveyItems.length
                : users.length;
      
  

  const openPublicationPreview = (publication: PublicationPreview) => {
    handleOpenPublicationPreview(publication);
  };

  const companyFeedItems: CompanyFeedItem[] = [
    ...postItems.map((post) => ({
      id: post.id,
      kind: "Publicacion" as const,
      title: post.title,
      description: post.message,
      date: post.date,
      tag: "Publicacion",
      image: post.image,
      preview: {
        id: post.id,
        kind: "Publicacion" as const,
        title: post.title,
        description: post.message,
        image: post.image,
        date: post.date,
      } as PublicationPreview,
    })),
    ...textPostItems.map((post) => ({
      id: post.id,
      kind: "Texto" as const,
      title: post.title,
      description: post.message,
      date: post.date,
      tag: "Texto",
      image: post.image,
      preview: {
        id: post.id,
        kind: "Publicacion" as const,
        title: post.title,
        description: post.message,
        image: post.image,
        date: post.date,
      } as PublicationPreview,
    })),
    ...offerItems.map((offer) => ({
      id: offer.id,
      kind: "Oferta" as const,
      title: offer.title,
      description: offer.description,
      date: "Hoy",
      tag: offer.label,
      image: offer.image,
      price: offer.currentPrice,
      status: offer.label,
      preview: {
        id: offer.id,
        kind: "Oferta" as const,
        title: offer.title,
        description: offer.description,
        image: offer.image,
        price: offer.currentPrice,
        status: offer.label,
        date: "Hoy",
      } as PublicationPreview,
    })),
    ...serviceItems.map((service) => ({
      id: service.id,
      kind: "Servicio" as const,
      title: service.name,
      description: service.description,
      date: "Hoy",
      tag: "Servicio",
      image: service.image,
      price: service.price,
      status: "Servicio activo",
      preview: {
        id: service.id,
        kind: "Servicio" as const,
        title: service.name,
        description: service.description,
        image: service.image,
        price: service.price,
        status: "Servicio activo",
        date: "Hoy",
      } as PublicationPreview,
    })),
    ...productItems.map((product) => ({
      id: product.id,
      kind: "Producto" as const,
      title: product.name,
      description: product.description,
      date: "Hoy",
      tag: "Producto",
      image: product.image,
      price: product.price ?? "Consultar",
      status: product.status,
      preview: {
        id: product.id,
        kind: "Producto" as const,
        title: product.name,
        description: product.description,
        image: product.image,
        price: product.price ?? "Consultar",
        status: product.status,
        date: "Hoy",
      } as PublicationPreview,
    })),
    ...surveyItems.map((survey) => ({
      id: survey.id,
      kind: "Encuesta" as const,
      title: survey.question,
      description: `Opciones: ${survey.options.join(" • ")}`,
      date: `${survey.votes} participaciones`,
      tag: "Encuesta",
      options: survey.options,
      preview: {
        id: survey.id,
        kind: "Publicacion" as const,
        title: survey.question,
        description: `Opciones: ${survey.options.join(" • ")}`,
        date: "Encuesta activa",
        status: "Encuesta",
      } as PublicationPreview,
    })),
  ];

  useEffect(() => {
    setPublicationSocial((current) => {
      const next = { ...current };
      let changed = false;

      companyFeedItems.forEach((item, index) => {
        if (!next[item.id]) {
          next[item.id] = createInitialPublicationSocial(item, index);
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [companyFeedItems]);

  const getPublicationSocial = (publicationId: string): PublicationSocialState =>
    publicationSocial[publicationId] ?? {
      likes: 0,
      liked: false,
      comments: [],
    };

  const togglePublicationLike = (publicationId: string) => {
    setPublicationSocial((current) => {
      const entry =
        current[publicationId] ??
        {
          likes: 0,
          liked: false,
          comments: [],
        };

      const nextLiked = !entry.liked;

      return {
        ...current,
        [publicationId]: {
          ...entry,
          liked: nextLiked,
          likes: nextLiked ? entry.likes + 1 : Math.max(0, entry.likes - 1),
        },
      };
    });
  };

  const handleOpenPublicationPreview = (publication: PublicationPreview) => {
    setSelectedPublication(publication);
    setCommentDraft("");
  };

  const handleOpenComments = (publication: PublicationPreview) => {
    setSelectedPublication(publication);
    setCommentDraft("");
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    

    if (!selectedPublication) return;

    const text = commentDraft.trim();
    if (!text) return;

    setPublicationSocial((current) => {
      const entry =
        current[selectedPublication.id] ??
        {
          likes: 0,
          liked: false,
          comments: [],
        };

      return {
        ...current,
        [selectedPublication.id]: {
          ...entry,
          comments: [
            {
              id: `comment-${selectedPublication.id}-${Date.now()}`,
              author: company.name,
              text,
              time: "Ahora",
            },
            ...entry.comments,
          ],
        },
      };
    });

    setCommentDraft("");
  };

  const selectedPublicationSocial = selectedPublication
  ? getPublicationSocial(selectedPublication.id)
  : null;

  const closeProductEditModal = () => {
    setShowProductEditModal(false);
    setEditingProductId(null);
    setProductEditMessage("");
  };

  const closeServiceEditModal = () => {
    setShowServiceEditModal(false);
    setEditingServiceId(null);
    setServiceEditMessage("");
  };

  const closeOfferEditModal = () => {
    setShowOfferEditModal(false);
    setEditingOfferId(null);
    setOfferEditMessage("");
  };

  useEffect(() => {
    const seededPosts = posts.map((post, index) =>
      buildCommunityFeedPost(
        `seed-company-${post.id}`,
        post.title,
        post.message,
        post.image,
        "Publicacion",
        new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
      ),
    );

    upsertCommunityFeedPosts(seededPosts);
  }, []);

  const handleMainFilterChange = (filter: MainFilter) => {
    setActiveFilter(filter);

    if (filter === "Publicaciones de interacción") {
      setShowInteractionNotice(true);
      return;
    }

    setHighlightedUserId(null);
  };

  const handleInteractionNotificationClick = () => {
    setActiveFilter("Publicaciones de interacción");
    setActiveInteractionFilter("Lista de usuarios que interactúan");
    setHighlightedUserId(latestInteractionNotification.userId);
    setShowInteractionNotice(false);
    setShowNotificationPanel(false);
  };
  const openSurveyCreateModal = () => {
  setSurveyForm({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  setSurveyCreateMessage("");
  setShowSurveyCreateModal(true);
};

const closeSurveyCreateModal = () => {
  setShowSurveyCreateModal(false);
  setSurveyCreateMessage("");
};

const handleSurveyCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const question = surveyForm.question.trim();
  const options = [
    surveyForm.option1.trim(),
    surveyForm.option2.trim(),
    surveyForm.option3.trim(),
    surveyForm.option4.trim(),
  ].filter(Boolean);

  if (!question) {
    setSurveyCreateMessage("Escribe la pregunta de la encuesta.");
    return;
  }

  if (options.length < 2) {
    setSurveyCreateMessage("Agrega al menos dos opciones.");
    return;
  }

  const newSurvey: SurveyCard = {
    id: `survey-${Date.now()}`,
    question,
    options,
    votes: 0,
  };

  setSurveyItems((current) => [newSurvey, ...current]);

  upsertCommunityFeedPosts([
    buildCommunityFeedPost(
      newSurvey.id,
      "Nueva encuesta activa",
      question,
      undefined,
      "Encuesta",
      new Date().toISOString(),
    ),
  ]);

  setShowSurveyCreateModal(false);
  setSurveyCreateMessage("");
};

  const handleOpenCreateAction = () => {
    if (activeFilter === "Publicaciones de interacción" && activeInteractionFilter === "Encuestas") {
      openSurveyCreateModal();
      return;
    }

    setShowCreateForm((current) => !current);
    setPublishMessage("");
    setUploadedImagePreview("");
    setUploadedImageName("");
    setFormData({
      title: "",
      targetFilter: activeFilter,
      description: "",
      price: "",
      previousPrice: "",
      label: "Oferta",
      image: "",
    });
  };

  const openProductEditModal = (product: ProductCard) => {
    setEditingProductId(product.id);
    setProductEditForm({
      name: product.name,
      description: product.description,
      price: product.price ?? "",
      status: product.status,
      image: product.image,
    });
    setProductEditMessage("");
    setProductEditImageName("");
    setProductEditFileKey((current) => current + 1);
    setShowProductEditModal(true);
  };

  const handleProductEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProductEditImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProductEditMessage("Selecciona un archivo de imagen valido.");
      setProductEditImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setProductEditForm((current) => ({
        ...current,
        image: result,
      }));

      setProductEditImageName(file.name);
      setProductEditMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleProductEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProductId) {
      return;
    }

    const trimmedName = productEditForm.name.trim();
    const trimmedDescription = productEditForm.description.trim();

    if (!trimmedName || !trimmedDescription) {
      setProductEditMessage("Completa nombre y descripcion del producto.");
      return;
    }

    setProductItems((current) =>
      current.map((item) =>
        item.id === editingProductId
          ? {
              ...item,
              name: trimmedName,
              description: trimmedDescription,
              price: productEditForm.price.trim() || "Consultar",
              status: productEditForm.status.trim() || "Disponible",
              image: productEditForm.image.trim() || item.image,
            }
          : item,
      ),
    );

    setShowProductEditModal(false);
    setEditingProductId(null);
    setProductEditMessage("");
  };

  const openServiceEditModal = (service: ServiceCard) => {
    setEditingServiceId(service.id);
    setServiceEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      image: service.image ?? "",
    });
    setServiceEditMessage("");
    setServiceEditImageName("");
    setServiceEditFileKey((current) => current + 1);
    setShowServiceEditModal(true);
  };

  const handleServiceEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingServiceId) {
      return;
    }

    const trimmedName = serviceEditForm.name.trim();
    const trimmedDescription = serviceEditForm.description.trim();

    if (!trimmedName || !trimmedDescription) {
      setServiceEditMessage("Completa nombre y descripcion del servicio.");
      return;
    }

    setServiceItems((current) =>
      current.map((item) =>
        item.id === editingServiceId
          ? {
              ...item,
              name: trimmedName,
              description: trimmedDescription,
              price: serviceEditForm.price.trim() || "Consultar",
              image: serviceEditForm.image.trim() || item.image,
            }
          : item,
      ),
    );

    setShowServiceEditModal(false);
    setEditingServiceId(null);
    setServiceEditMessage("");
  };

  const handleServiceEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setServiceEditImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setServiceEditMessage("Selecciona un archivo de imagen valido.");
      setServiceEditImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setServiceEditForm((current) => ({
        ...current,
        image: result,
      }));

      setServiceEditImageName(file.name);
      setServiceEditMessage("");
    };

    reader.readAsDataURL(file);
  };

  const openOfferEditModal = (offer: OfferCard) => {
    setEditingOfferId(offer.id);
    setOfferEditForm({
      title: offer.title,
      description: offer.description,
      currentPrice: offer.currentPrice,
      previousPrice: offer.previousPrice ?? "",
      label: offer.label,
      image: offer.image,
    });
    setOfferEditMessage("");
    setOfferEditImageName("");
    setOfferEditFileKey((current) => current + 1);
    setShowOfferEditModal(true);
  };

  const handleOfferEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingOfferId) {
      return;
    }

    const trimmedTitle = offerEditForm.title.trim();
    const trimmedDescription = offerEditForm.description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setOfferEditMessage("Completa titulo y descripcion de la oferta.");
      return;
    }

    setOfferItems((current) =>
      current.map((item) =>
        item.id === editingOfferId
          ? {
              ...item,
              title: trimmedTitle,
              description: trimmedDescription,
              currentPrice: offerEditForm.currentPrice.trim() || "Consultar",
              previousPrice: offerEditForm.previousPrice.trim() || undefined,
              label: offerEditForm.label.trim() || "Oferta",
              image: offerEditForm.image.trim() || item.image,
            }
          : item,
      ),
    );

    setShowOfferEditModal(false);
    setEditingOfferId(null);
    setOfferEditMessage("");
  };

  const handleOfferEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setOfferEditImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setOfferEditMessage("Selecciona un archivo de imagen valido.");
      setOfferEditImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setOfferEditForm((current) => ({
        ...current,
        image: result,
      }));

      setOfferEditImageName(file.name);
      setOfferEditMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPublishMessage("Selecciona un archivo de imagen valido.");
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setUploadedImagePreview(result);
      setUploadedImageName(file.name);
      setPublishMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePublicationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const price = formData.price.trim();
    const previousPrice = formData.previousPrice.trim();
    const image = uploadedImagePreview || formData.image.trim() || "/productos/laptop-pro-14.jpg";

    if (!title || !description) {
      setPublishMessage("Completa titulo y descripcion para publicar.");
      return;
    }

    const newId = `pub-${Date.now()}`;
    let communityTag = "Publicacion";

    if (formData.targetFilter === "Publicaciones") {
      setPostItems((current) => [
        {
          id: newId,
          title,
          message: description,
          date: "Hoy",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Publicaciones");
      communityTag = "Publicacion";
    }

    if (formData.targetFilter === "Productos disponibles") {
      setProductItems((current) => [
        {
          id: newId,
          name: title,
          description,
          price: price || "Consultar",
          status: "Disponible",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Productos disponibles");
      communityTag = "Producto";
    }

    if (formData.targetFilter === "Servicios") {
      setServiceItems((current) => [
        {
          id: newId,
          name: title,
          description,
          price: price || "Consultar",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Servicios");
      communityTag = "Servicio";
    }

    if (formData.targetFilter === "Ofertas y promociones") {
      setOfferItems((current) => [
        {
          id: newId,
          title,
          description,
          currentPrice: price || "Consultar",
          previousPrice: previousPrice || undefined,
          label: formData.label,
          image,
        },
        ...current,
      ]);
      setActiveFilter("Ofertas y promociones");
      communityTag = formData.label;
    }


    if (formData.targetFilter === "Publicaciones de texto") {
      setTextPostItems((current) => [
        {
          id: newId,
          title,
          message: description,
          date: "Hoy",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Publicaciones de texto");
      communityTag = "Texto";
    }

    upsertCommunityFeedPosts([
      buildCommunityFeedPost(newId, title, description, image, communityTag, new Date().toISOString()),
    ]);
    setFormData({
      title: "",
      targetFilter: formData.targetFilter,
      description: "",
      price: "",
      previousPrice: "",
      label: "Oferta",
      image: "",
    });
    setUploadedImagePreview("");
    setUploadedImageName("");
    setFileInputKey((current) => current + 1);
    setPublishMessage("Publicacion agregada correctamente.");
    setShowCreateForm(false);
  };

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Publicaciones"
        brandHref="/"
        middleSlot={
          <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            <span className="ml-2 md:ml-0">Centro de publicaciones activo</span>
          </div>
        }
      />

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">CENTRO DE PUBLICACIONES</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Gestion comercial</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Administra contenido, mejoras y seguimiento de rendimiento desde un solo lugar.
            </p>
          </section>

          <CompanySidebar />

        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35 shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">PUBLICACIONES DE LA EMPRESA</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Publicaciones de la empresa</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Administra el feed principal de la empresa y organiza productos, servicios, ofertas, texto, encuestas e
                    interacción con usuarios desde una sola vista filtrable.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Contenido visible</p>
                      <h2 className="mt-3 text-2xl font-bold text-white">{mainFilterLabels[activeFilter]}</h2>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowNotificationPanel((current) => !current)}
                        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-100/10 bg-white/5 text-cyan-100/85 transition hover:bg-cyan-100/10"
                      >
                        <BellIcon />
                        {showInteractionNotice ? (
                          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
                        ) : null}
                      </button>

                      <AnimatePresence>
                        {showNotificationPanel ? (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute right-0 top-14 z-40 w-[320px] overflow-hidden rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/50"
                          >
                            <div className="border-b border-cyan-100/10 px-4 py-3">
                              <p className="text-sm font-semibold text-white">Notificaciones</p>
                              <p className="mt-1 text-xs text-cyan-100/65">Actividad reciente de usuarios</p>
                            </div>

                            {showInteractionNotice ? (
                              <button
                                type="button"
                                onClick={handleInteractionNotificationClick}
                                className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-cyan-100/5"
                              >
                                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                  AL
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-white">
                                    Alejandro buscó <span className="text-cyan-200">{latestInteractionNotification.productName}</span>
                                  </p>
                                  <p className="mt-1 text-xs text-cyan-100/65">
                                    Haz clic para ver la lista de usuarios que interactúan.
                                  </p>
                                </div>

                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300" />
                              </button>
                            ) : (
                              <div className="px-4 py-6 text-sm text-cyan-100/65">
                                No tienes notificaciones nuevas.
                              </div>
                            )}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">En pantalla</p>
                      <p className="mt-2 text-lg font-semibold text-cyan-50">{activeItemsCount}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Total gestionado</p>
                      <p className="mt-2 text-lg font-semibold text-cyan-50">{totalPublicationItems}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-cyan-100/76">
                    Tip: usa &quot;Ver publicacion&quot; para revisar cada pieza con su bloque de metricas antes de editarla.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {mainFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => handleMainFilterChange(filter)}
                      className={`shrink-0 rounded-full border px-6 py-3 text-base font-semibold leading-none transition ${
                        activeFilter === filter
                          ? "border-cyan-300/50 bg-cyan-300/20 text-white"
                          : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                      }`}
                    >
                      {mainFilterLabels[filter]}
                    </button>
                  ))}
                </div>

                {createButtonLabel ? (
                  <button
                    type="button"
                    onClick={handleOpenCreateAction}
                    className="self-start shrink-0 whitespace-nowrap rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 xl:self-auto"
                  >
                    {createButtonLabel}
                  </button>
                ) : null}
              </div>

              <AnimatePresence>
                {showCreateForm ? (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(event) => {
                      if (event.target === event.currentTarget) {
                        setShowCreateForm(false);
                      }
                    }}
                  >
                    <motion.form
                      onSubmit={handleCreatePublicationSubmit}
                      className="chat-scrollbar max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
                      initial={{ opacity: 0, y: 28, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{createFormTitle}</p>
                          <h2 className="mt-2 text-2xl font-bold text-white">
                           {activeFilter === "Productos disponibles"
                            ? "Agregar producto"
                            : isServicesView
                              ? "Agregar servicio"
                              : isTextView
                                ? "Agregar publicacion de texto"
                                : isOfferView
                                  ? "Agregar oferta o promocion"
                                  : activeFilter === "Publicaciones de interacción"
                                    ? "Agregar publicacion"
                                    : "Agregar publicacion"}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                        >
                          Cerrar
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                          <span>Titulo</span>
                          <input
                            value={formData.title}
                            onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                            placeholder="Ej: Laptop Pro 14 reacondicionada"
                            className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                          />
                        </label>

                        <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                          <span>Descripcion</span>
                          <textarea
                            value={formData.description}
                            onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                            placeholder="Describe la publicacion para tus clientes"
                            rows={4}
                            className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                          />
                        </label>

                        {!isTextView ? (
                          <label className="space-y-2 text-sm text-cyan-100/85">
                            <span>{isOfferView ? "Precio actual" : "Precio (opcional)"}</span>
                            <input
                              value={formData.price}
                              onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                              placeholder="Ej: Bs 1.500.000"
                              className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                            />
                          </label>
                        ) : null}

                        {isOfferView ? (
                          <>
                            <label className="space-y-2 text-sm text-cyan-100/85">
                              <span>Tipo</span>
                              <select
                                value={formData.label}
                                onChange={(event) =>
                                  setFormData((current) => ({
                                    ...current,
                                    label: event.target.value as "Oferta" | "Promocion",
                                  }))
                                }
                                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                              >
                                <option value="Oferta">Oferta</option>
                                <option value="Promocion">Promocion</option>
                              </select>
                            </label>

                            <label className="space-y-2 text-sm text-cyan-100/85">
                              <span>Precio anterior (opcional)</span>
                              <input
                                value={formData.previousPrice}
                                onChange={(event) => setFormData((current) => ({ ...current, previousPrice: event.target.value }))}
                                placeholder="Ej: Bs 1.800.000"
                                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                              />
                            </label>
                          </>
                        ) : null}

                      <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                        <span>Subir imagen desde tu PC</span>
                        <input
                          key={fileInputKey}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                        />
                        {uploadedImageName ? (
                          <p className="text-xs text-cyan-100/70">Archivo: {uploadedImageName}</p>
                        ) : null}
                      </label>
                      </div>

                      {uploadedImagePreview ? (
                        <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Vista previa</p>
                          <img
                            src={uploadedImagePreview}
                            alt="Vista previa de imagen seleccionada"
                            className="mt-3 h-40 w-full rounded-2xl object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          type="submit"
                          className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                        >
                          {submitButtonLabel}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                        >
                          Cancelar
                        </button>

                        {publishMessage ? <p className="text-sm text-cyan-100/80">{publishMessage}</p> : null}
                      </div>
                    </motion.form>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {activeFilter === "Publicaciones" && (
                <div className="mt-8 space-y-5">
                  <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Feed principal</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Todas las publicaciones de la empresa</h3>
                    <p className="mt-3 text-sm leading-7 text-cyan-100/78">
                      Este feed concentra todo el contenido visible de la empresa en formato continuo, con acciones rápidas de contacto e interacción.
                    </p>
                  </div>

                  {companyFeedItems.map((item) => (
                    <article
                      key={`${item.kind}-${item.id}`}
                      className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35"
                    >
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {company.logo}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{company.name}</p>
                              <p>{item.date}</p>
                            </div>
                          </div>

                          <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-cyan-100/85">
                            {item.tag}
                          </span>
                        </div>

                        <div className="mt-5">
                          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                          <p className="mt-3 text-base leading-8 text-cyan-100/84">{item.description}</p>
                        </div>

                        {item.kind === "Encuesta" ? (
                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {(item.options ?? []).map((option) => (
                              <button
                                key={option}
                                type="button"
                                className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 px-4 py-3 text-left text-sm text-cyan-100/90 transition hover:bg-cyan-100/10"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : item.image ? (
                          <button
                            type="button"
                            onClick={() => openPublicationPreview(item.preview)}
                            className="mt-5 block w-full text-left"
                          >
                            <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-white">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="max-h-full max-w-full object-contain object-center"
                              />
                            </div>
                          </button>
                        ) : null}

                        {item.price || item.status ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.price ? (
                              <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-cyan-100/85">
                                {item.price}
                              </span>
                            ) : null}
                            {item.status ? (
                              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                {item.status}
                              </span>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="mt-5 border-t border-cyan-100/10 pt-4">
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            <Link
                              href="/empresa/chat"
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                            >
                              Contactar por chat
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenPublicationPreview(item.preview)}
                              className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                            >
                              Ver publicacion
                            </button>

                            <button
                              type="button"
                              onClick={() => togglePublicationLike(item.id)}
                              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                getPublicationSocial(item.id).liked
                                  ? "border-rose-300/35 bg-rose-400/10 text-rose-100"
                                  : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                              }`}
                            >
                              <LikeIcon />
                              Like {getPublicationSocial(item.id).likes}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenComments(item.preview)}
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                            >
                              <CommentIcon />
                              Comentar {getPublicationSocial(item.id).comments.length}
                            </button>

                            <button
                              type="button"
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                            >
                              <SendIcon />
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === "Productos disponibles" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {productItems.map((product) => (
                    <motion.article
                      key={product.id}
                      whileHover={{ y: -4, boxShadow: "0 18px 34px rgba(8,145,178,0.2)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35"
                    >
                      <div className="flex h-44 w-full items-center justify-center bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {company.logo}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{company.name}</p>
                                <p>Producto disponible</p>
                              </div>
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-white">{product.name}</h3>
                          </div>
                          <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-cyan-100/80">{product.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio</p>
                            <p className="mt-1 text-lg font-bold text-white">{product.price ?? "Consultar"}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openPublicationPreview({
                                  id: product.id,
                                  kind: "Producto",
                                  title: product.name,
                                  description: product.description,
                                  image: product.image,
                                  price: product.price ?? "Consultar",
                                  status: product.status,
                                  date: "Hoy",
                                })
                              }
                              className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                            >
                              Ver publicacion
                            </button>
                            <button
                              type="button"
                              onClick={() => openProductEditModal(product)}
                              className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}

              {activeFilter === "Servicios" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {serviceItems.map((service) => (
                    <motion.article
                      key={service.id}
                      whileHover={{ y: -4, boxShadow: "0 18px 34px rgba(8,145,178,0.2)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35"
                    >
                      {service.image ? (
                          <div className="flex h-40 w-full items-center justify-center bg-white">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="max-h-full max-w-full object-contain object-center"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                            {company.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{company.name}</p>
                            <p>Servicio ofrecido</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                        <p className="text-sm leading-7 text-cyan-100/80">{service.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-cyan-100/75">
                            <span className="font-semibold text-white">Precio:</span> {service.price}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openPublicationPreview({
                                  id: service.id,
                                  kind: "Servicio",
                                  title: service.name,
                                  description: service.description,
                                  image: service.image,
                                  price: service.price,
                                  status: "Servicio activo",
                                  date: "Hoy",
                                })
                              }
                              className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                            >
                              Ver publicacion
                            </button>
                            <button
                              type="button"
                              onClick={() => openServiceEditModal(service)}
                              className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}

              {activeFilter === "Ofertas y promociones" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {offerItems.map((offer) => (
                    <motion.article
                      key={offer.id}
                      whileHover={{ y: -4, boxShadow: "0 18px 34px rgba(8,145,178,0.2)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35"
                    >
                      <div className="flex h-44 w-full items-center justify-center bg-white">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="max-h-full max-w-full object-contain object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {company.logo}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{company.name}</p>
                                <p>{offer.label}</p>
                              </div>
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-white">{offer.title}</h3>
                          </div>
                          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                            {offer.label}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-cyan-100/80">{offer.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio actual</p>
                            <p className="mt-1 text-lg font-bold text-white">{offer.currentPrice}</p>
                          </div>
                          {offer.previousPrice ? (
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio anterior</p>
                              <p className="mt-1 text-lg font-semibold text-cyan-100/65 line-through">{offer.previousPrice}</p>
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openPublicationPreview({
                                id: offer.id,
                                kind: "Oferta",
                                title: offer.title,
                                description: offer.description,
                                image: offer.image,
                                price: offer.currentPrice,
                                status: offer.label,
                                date: "Hoy",
                              })
                            }
                            className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                          >
                            Ver publicacion
                          </button>
                          <button
                            type="button"
                            onClick={() => openOfferEditModal(offer)}
                            className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}

              {activeFilter === "Publicaciones de interacción" && (
                <div className="mt-8 rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <div className="mb-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Interacción</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Encuestas y usuarios que interactúan</h3>
                    <p className="mt-2 text-sm leading-7 text-cyan-100/78">
                      Revisa participación, encuestas activas y actividad reciente de usuarios interesados.
                    </p>
                  </div>
 

                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap gap-3">
                      {interactionFilters.map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setActiveInteractionFilter(filter)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            activeInteractionFilter === filter
                              ? "border-cyan-300/50 bg-cyan-300/20 text-white"
                              : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                          }`}
                        >
                          {interactionFilterLabels[filter]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {activeInteractionFilter === "Encuestas" &&
                      surveyItems.map((survey) => (
                        <article key={survey.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5">
                          <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {company.logo}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{company.name}</p>
                              <p>Encuesta</p>
                            </div>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-white">{survey.question}</h3>
                          <div className="mt-4 space-y-3">
                            {survey.options.map((option, index) => {
                              const selectedOption = selectedSurveyOption[survey.id];
                              const hasSelection = Boolean(selectedOption);
                              const isSelected = selectedOption === option;
                              const percentage = hasSelection
                                ? isSelected
                                  ? 60
                                  : index === 1
                                    ? 30
                                    : 10
                                : [32, 28, 24, 16][index] ?? 10;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setSelectedSurveyOption((current) => ({ ...current, [survey.id]: option }))}
                                  className="w-full text-left"
                                >
                                  <div
                                    className={`rounded-2xl border px-4 py-3 transition ${
                                      isSelected
                                        ? "border-cyan-300/50 bg-cyan-300/15"
                                        : "border-cyan-100/10 bg-slate-950/30"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                      <span className="text-cyan-100/90">{option}</span>
                                      <span className="font-semibold text-white">{percentage}%</span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/80">
                                      <div
                                        className={`h-full rounded-full ${isSelected ? "bg-cyan-300" : "bg-cyan-500/60"}`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-4 text-sm text-cyan-100/75">{survey.votes} participaciones</p>
                        </article>
                      ))}

                    {activeInteractionFilter === "Lista de usuarios que interactúan" &&
                      users.map((user) => (
                        <article
                          key={user.id}
                          className={`rounded-3xl border p-5 ${
                            highlightedUserId === user.id
                              ? "border-emerald-300/40 bg-emerald-400/10"
                              : "border-cyan-100/10 bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="text-sm text-cyan-100/75">{user.activity}</p>
                            </div>
                          </div>
                          <div className="mt-5">
                            <Link
                              href="/empresa/chat"
                              className="inline-flex rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                            >
                              Chatear
                            </Link>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              )}

              {activeFilter === "Publicaciones de texto" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {textPostItems.map((post) => (
                    <article key={post.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35">
                      <div className="flex h-44 w-full items-center justify-center bg-white">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="max-h-full max-w-full object-contain object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                            {company.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{company.name}</p>
                            <p>{post.date}</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{post.title}</h3>
                        <p className="text-sm leading-7 text-cyan-100/80">{post.message}</p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                            Contactar por chat
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <LikeIcon />
                            Like
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <CommentIcon />
                            Comentar
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <SendIcon />
                            Enviar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>

      <AnimatePresence>
        {selectedPublication ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 px-4 py-6 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedPublication(null);
              }
            }}
          >
            <motion.article
              className="chat-scrollbar max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-100/15 bg-[linear-gradient(175deg,rgba(9,30,53,0.98),rgba(5,18,35,0.98))] p-5 shadow-2xl shadow-slate-950/60 md:p-6"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/70">VISTA DE PUBLICACION</p>
                  <h2 className="mt-2 text-2xl font-semibold text-cyan-50">{selectedPublication.title}</h2>
                  <p className="mt-2 text-sm text-cyan-100/78">
                    {selectedPublication.kind} • {selectedPublication.date ?? "Reciente"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPublication(null)}
                  className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <section className="rounded-3xl border border-cyan-100/12 bg-slate-950/40 p-4">
                  {selectedPublication.image ? (
                    <img
                      src={selectedPublication.image}
                      alt={selectedPublication.title}
                      className="h-56 w-full rounded-2xl object-cover"
                    />
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80">
                      {selectedPublication.kind}
                    </span>
                    {selectedPublication.status ? (
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {selectedPublication.status}
                      </span>
                    ) : null}
                    {selectedPublication.price ? (
                      <span className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/85">
                        {selectedPublication.price}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-cyan-100/84">{selectedPublication.description}</p>
                </section>

                <section className="rounded-3xl border border-cyan-100/12 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Metricas de esta publicacion</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {buildPublicationMetrics(selectedPublication.id).map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">{metric.label}</p>
                        <p className="mt-2 text-xl font-semibold text-cyan-50">{metric.value}</p>
                        <p className="mt-1 text-xs text-cyan-100/72">{metric.trend}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/70">Recomendacion rapida</p>
                    <p className="mt-2 text-sm leading-6 text-cyan-100/84">
                      Esta publicacion tiene buen potencial. Ajusta imagen principal y CTA para convertir mas clics en chats.
                    </p>
                  </div>
                </section>
              </div>
              {selectedPublication && selectedPublicationSocial ? (
                <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <section className="rounded-3xl border border-cyan-100/12 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Interaccion</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Link
                        href="/empresa/chat"
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                      >
                        Contactar por chat
                      </Link>

                      <button
                        type="button"
                        onClick={() => togglePublicationLike(selectedPublication.id)}
                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedPublicationSocial.liked
                            ? "border-rose-300/35 bg-rose-400/10 text-rose-100"
                            : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                        }`}
                      >
                        <LikeIcon />
                        Like {selectedPublicationSocial.likes}
                      </button>

                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                      >
                        <CommentIcon />
                        Comentarios {selectedPublicationSocial.comments.length}
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Likes acumulados</p>
                        <p className="mt-2 text-xl font-semibold text-cyan-50">{selectedPublicationSocial.likes}</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Comentarios</p>
                        <p className="mt-2 text-xl font-semibold text-cyan-50">{selectedPublicationSocial.comments.length}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-cyan-100/12 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Comentarios</p>

                    <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
                      <textarea
                        value={commentDraft}
                        onChange={(event) => setCommentDraft(event.target.value)}
                        placeholder="Escribe un comentario como empresa..."
                        rows={3}
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/45 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                      >
                        Publicar comentario
                      </button>
                    </form>

                    <div className="mt-5 space-y-3">
                      {selectedPublicationSocial.comments.map((comment) => (
                        <article
                          key={comment.id}
                          className="rounded-2xl border border-cyan-100/10 bg-slate-950/45 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-cyan-50">{comment.author}</p>
                            <p className="text-xs text-cyan-100/65">{comment.time}</p>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-cyan-100/82">{comment.text}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showProductEditModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeProductEditModal();
              }
            }}
          >
            <motion.form
              onSubmit={handleProductEditSubmit}
              className="w-full max-w-2xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Producto</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Editar producto</h2>
                </div>
                <button
                  type="button"
                  onClick={closeProductEditModal}
                  className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Nombre</span>
                  <input
                    value={productEditForm.name}
                    onChange={(event) => setProductEditForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Descripcion</span>
                  <textarea
                    value={productEditForm.description}
                    onChange={(event) => setProductEditForm((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Precio</span>
                  <input
                    value={productEditForm.price}
                    onChange={(event) => setProductEditForm((current) => ({ ...current, price: event.target.value }))}
                    placeholder="Ej: Bs 1.500.000"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Estado</span>
                  <input
                    value={productEditForm.status}
                    onChange={(event) => setProductEditForm((current) => ({ ...current, status: event.target.value }))}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Seleccionar imagen desde la PC</span>
                  <input
                    key={productEditFileKey}
                    type="file"
                    accept="image/*"
                    onChange={handleProductEditImageChange}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  {productEditImageName ? (
                    <p className="text-xs text-cyan-100/70">Archivo: {productEditImageName}</p>
                  ) : null}
                </label>
              </div>

              {productEditMessage ? <p className="mt-4 text-sm text-amber-200">{productEditMessage}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={closeProductEditModal}
                  className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showServiceEditModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeServiceEditModal();
              }
            }}
          >
            <motion.form
              onSubmit={handleServiceEditSubmit}
              className="w-full max-w-2xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicio</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Editar servicio</h2>
                </div>
                <button
                  type="button"
                  onClick={closeServiceEditModal}
                  className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Nombre</span>
                  <input
                    value={serviceEditForm.name}
                    onChange={(event) => setServiceEditForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Descripcion</span>
                  <textarea
                    value={serviceEditForm.description}
                    onChange={(event) => setServiceEditForm((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Precio</span>
                  <input
                    value={serviceEditForm.price}
                    onChange={(event) => setServiceEditForm((current) => ({ ...current, price: event.target.value }))}
                    placeholder="Ej: Bs 120.000"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Seleccionar imagen desde la PC</span>
                  <input
                    key={serviceEditFileKey}
                    type="file"
                    accept="image/*"
                    onChange={handleServiceEditImageChange}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  {serviceEditImageName ? (
                    <p className="text-xs text-cyan-100/70">Archivo: {serviceEditImageName}</p>
                  ) : null}
                </label>
              </div>

              {serviceEditMessage ? <p className="mt-4 text-sm text-amber-200">{serviceEditMessage}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={closeServiceEditModal}
                  className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showSurveyCreateModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeSurveyCreateModal();
              }
            }}
          >
            <motion.form
              onSubmit={handleSurveyCreateSubmit}
              className="w-full max-w-2xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Encuesta</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Agregar encuesta</h2>
                </div>
                <button
                  type="button"
                  onClick={closeSurveyCreateModal}
                  className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Pregunta</span>
                  <input
                    value={surveyForm.question}
                    onChange={(event) =>
                      setSurveyForm((current) => ({ ...current, question: event.target.value }))
                    }
                    placeholder="Ej: Que servicio necesitas con mas frecuencia?"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Opcion 1</span>
                    <input
                      value={surveyForm.option1}
                      onChange={(event) =>
                        setSurveyForm((current) => ({ ...current, option1: event.target.value }))
                      }
                      placeholder="Ej: Diagnostico"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Opcion 2</span>
                    <input
                      value={surveyForm.option2}
                      onChange={(event) =>
                        setSurveyForm((current) => ({ ...current, option2: event.target.value }))
                      }
                      placeholder="Ej: Mantenimiento"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Opcion 3 (opcional)</span>
                    <input
                      value={surveyForm.option3}
                      onChange={(event) =>
                        setSurveyForm((current) => ({ ...current, option3: event.target.value }))
                      }
                      placeholder="Ej: Redes"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Opcion 4 (opcional)</span>
                    <input
                      value={surveyForm.option4}
                      onChange={(event) =>
                        setSurveyForm((current) => ({ ...current, option4: event.target.value }))
                      }
                      placeholder="Ej: Soporte remoto"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>
                </div>
              </div>

              {surveyCreateMessage ? (
                <p className="mt-4 text-sm text-amber-200">{surveyCreateMessage}</p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Publicar encuesta
                </button>
                <button
                  type="button"
                  onClick={closeSurveyCreateModal}
                  className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showOfferEditModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeOfferEditModal();
              }
            }}
          >
            <motion.form
              onSubmit={handleOfferEditSubmit}
              className="w-full max-w-2xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Oferta</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Editar oferta o promocion</h2>
                </div>
                <button
                  type="button"
                  onClick={closeOfferEditModal}
                  className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Titulo</span>
                  <input
                    value={offerEditForm.title}
                    onChange={(event) => setOfferEditForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Descripcion</span>
                  <textarea
                    value={offerEditForm.description}
                    onChange={(event) => setOfferEditForm((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Precio actual</span>
                  <input
                    value={offerEditForm.currentPrice}
                    onChange={(event) => setOfferEditForm((current) => ({ ...current, currentPrice: event.target.value }))}
                    placeholder="Ej: Bs 95.000"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Precio anterior (opcional)</span>
                  <input
                    value={offerEditForm.previousPrice}
                    onChange={(event) => setOfferEditForm((current) => ({ ...current, previousPrice: event.target.value }))}
                    placeholder="Ej: Bs 140.000"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Etiqueta</span>
                  <select
                    value={offerEditForm.label}
                    onChange={(event) =>
                      setOfferEditForm((current) => ({
                        ...current,
                        label: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  >
                    <option value="Oferta">Oferta</option>
                    <option value="Promocion">Promocion</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Seleccionar imagen desde la PC</span>
                  <input
                    key={offerEditFileKey}
                    type="file"
                    accept="image/*"
                    onChange={handleOfferEditImageChange}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  {offerEditImageName ? (
                    <p className="text-xs text-cyan-100/70">Archivo: {offerEditImageName}</p>
                  ) : null}
                </label>
              </div>

              {offerEditMessage ? <p className="mt-4 text-sm text-amber-200">{offerEditMessage}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={closeOfferEditModal}
                  className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
