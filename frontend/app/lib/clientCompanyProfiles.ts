export type ClientCompanyProfile = {
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  description: string;
  specialties: string[];
  coverage: string[];
  hours: Array<{ day: string; hours: string }>;
  contact: Array<{ label: string; value: string }>;
  featuredServices: string[];
  featuredProducts: string[];
};

export const clientCompanyProfiles: ClientCompanyProfile[] = [
  {
    slug: "tecnocentro-andino",
    name: "TecnoCentro Andino",
    logo: "TA",
    tagline: "Tecnologia, soporte y confianza para tu compra.",
    category: "Tienda y centro tecnico",
    city: "La Paz",
    rating: 4.8,
    reviewCount: 128,
    description:
      "Empresa especializada en venta de equipos, mantenimiento y soporte para usuarios y negocios. El perfil esta pensado para que el cliente vea informacion real, evalúe servicios y compare antes de comprar.",
    specialties: ["Laptops", "Accesorios", "Diagnostico", "Soporte empresarial"],
    coverage: ["Centro", "Zona sur", "Atencion a domicilio", "Cobertura por sectores cercanos"],
    hours: [
      { day: "Lunes a viernes", hours: "8:00 a. m. - 6:30 p. m." },
      { day: "Sabado", hours: "9:00 a. m. - 2:00 p. m." },
      { day: "Domingo", hours: "No atiende" },
    ],
    contact: [
      { label: "Telefono", value: "+591 2 123 4567" },
      { label: "WhatsApp", value: "+591 7123 4567" },
      { label: "Correo", value: "contacto@tecnocentroandino.bo" },
    ],
    featuredServices: ["Diagnostico express", "Mantenimiento preventivo", "Soporte remoto"],
    featuredProducts: ["NovaBook Air 14", "Kit limpieza PC", "Monitor UltraWide 34"],
  },
  {
    slug: "fixcloud-soporte",
    name: "FixCloud Soporte",
    logo: "FC",
    tagline: "Reparacion, mantenimiento y soporte rapido.",
    category: "Servicio tecnico especializado",
    city: "Santa Cruz",
    rating: 4.7,
    reviewCount: 96,
    description:
      "Perfil de empresa orientado a la contratacion de servicios tecnicos con respaldo, seguimiento y atencion a domicilio.",
    specialties: ["Mantenimiento", "Reparacion", "Redes", "Soporte remoto"],
    coverage: ["Centro", "Norte", "Zona comercial", "Atencion a domicilio"],
    hours: [
      { day: "Lunes a viernes", hours: "8:30 a. m. - 6:00 p. m." },
      { day: "Sabado", hours: "9:00 a. m. - 1:30 p. m." },
      { day: "Domingo", hours: "No atiende" },
    ],
    contact: [
      { label: "Telefono", value: "+591 3 123 4444" },
      { label: "WhatsApp", value: "+591 7512 4444" },
      { label: "Correo", value: "hola@fixcloud.bo" },
    ],
    featuredServices: ["Diagnostico en 24h", "Limpieza interna", "Instalacion de redes"],
    featuredProducts: ["Cargador USB-C 100W", "Mouse ergonomico", "Teclado mecanico TKL"],
  },
  {
    slug: "redlink-pro",
    name: "RedLink Pro",
    logo: "RL",
    tagline: "Redes, cableado y conectividad para empresas.",
    category: "Instalaciones y redes",
    city: "Cochabamba",
    rating: 4.6,
    reviewCount: 74,
    description:
      "Empresa enfocada en infraestructura de red, cableado y soporte para oficinas, hogares y pequenas empresas.",
    specialties: ["Cableado", "Redes", "Infraestructura", "Soporte empresarial"],
    coverage: ["Centro", "Zona norte", "Periferia", "Atencion programada"],
    hours: [
      { day: "Lunes a viernes", hours: "8:00 a. m. - 5:30 p. m." },
      { day: "Sabado", hours: "9:00 a. m. - 1:00 p. m." },
      { day: "Domingo", hours: "No atiende" },
    ],
    contact: [
      { label: "Telefono", value: "+591 4 123 9876" },
      { label: "WhatsApp", value: "+591 7123 9876" },
      { label: "Correo", value: "redes@redlinkpro.bo" },
    ],
    featuredServices: ["Cableado Cat 6", "Puntos de red", "Auditoria de red"],
    featuredProducts: ["Router dual band", "Switch 8 puertos", "Cable Cat 6"],
  },
];

export const getClientCompanyProfile = (slug: string) =>
  clientCompanyProfiles.find((profile) => profile.slug === slug) ?? clientCompanyProfiles[0];
