export type ServicePublication = {
  slug: string;
  title: string;
  company: string;
  city: string;
  rating: number;
  price: string;
  availability: string;
  description: string;
  tags: string[];
  image: string;
};

export const servicePublications: ServicePublication[] = [
  {
    slug: "servicio-tecnico-laptop-domicilio",
    title: "Servicio tecnico laptop a domicilio",
    company: "TechFix Lab",
    city: "La Paz",
    rating: 4.9,
    price: "Desde $120",
    availability: "Disponibilidad hoy",
    description: "Atencion rapida en casa con diagnostico, limpieza y revision de rendimiento.",
    tags: ["Laptop", "Domicilio", "Diagnostico"],
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    slug: "diagnostico-mantenimiento-preventivo",
    title: "Diagnostico y mantenimiento preventivo",
    company: "FixCloud Soporte",
    city: "Santa Cruz",
    rating: 4.8,
    price: "Desde $95",
    availability: "Agenda en 24h",
    description: "Revision completa para evitar fallas, mejorar temperatura y prolongar la vida util del equipo.",
    tags: ["Mantenimiento", "Prevencion", "Limpieza"],
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    slug: "cambio-pasta-termica-limpieza",
    title: "Cambio de pasta termica + limpieza",
    company: "ElectroCare",
    city: "Cochabamba",
    rating: 4.7,
    price: "Desde $80",
    availability: "Agenda express",
    description: "Servicio enfocado en bajar temperatura, limpiar ventilacion y optimizar rendimiento.",
    tags: ["Pasta termica", "Limpieza", "Rendimiento"],
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    slug: "instalacion-redes-oficina",
    title: "Instalacion de redes para oficina",
    company: "RedLink Pro",
    city: "Cochabamba",
    rating: 4.6,
    price: "Desde $150",
    availability: "Reserva programada",
    description: "Cableado, puntos de red y configuracion para hogares y pequenas empresas.",
    tags: ["Redes", "Cableado", "Oficina"],
    image: "/productos/teclado-tkl.jpg",
  },
];

export const getServicePublication = (slug: string) =>
  servicePublications.find((service) => service.slug === slug) ?? servicePublications[0];
