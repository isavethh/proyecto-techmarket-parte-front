"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CompanySidebar } from "../CompanySidebar";

const businessData = {
  name: "TechMarket Santa Cruz",
  logo: "TC",
  slogan: "Soluciones confiables en tecnologia para hogar y empresa en Santa Cruz de la Sierra.",
  specialization: "Laptops, redes y reparacion tecnica",
  rating: 4.8,
  reviewCount: 128,
  category: "Servicios y venta especializada en tecnologia en Bolivia",
  experienceYears: 12,
  businessType: "Tienda y centro tecnico en Santa Cruz",
};

const specialties = ["Diagnostico y reparacion", "Redes y cableado", "Mantenimiento preventivo", "Soporte para empresas"];

const coverageAreas = ["Centro de Santa Cruz", "Zona norte", "Equipetrol", "Atencion a domicilio en sectores cercanos"];

const contactChannels = [
  { label: "Telefono", value: "+591 7500 0001" },
  { label: "WhatsApp", value: "+591 7500 0001" },
  { label: "Correo", value: "contacto@techmarketscz.com" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

const schedules = [
  { day: "Lunes a viernes", hours: "8:00 a. m. - 6:30 p. m." },
  { day: "Sabado", hours: "9:00 a. m. - 2:00 p. m." },
  { day: "Domingo y festivos", hours: "No atiende" },
];

const branches = [
  {
    name: "Sede Principal",
    address: "Av. Monseñor Rivero # 120, Santa Cruz de la Sierra",
    phone: "+591 7500 0001",
    hours: "Lunes a viernes 8:00 a. m. - 6:30 p. m.; Sabado 9:00 a. m. - 2:00 p. m.",
  },
  {
    name: "Sucursal Norte",
    address: "Avenida Cristo Redentor # 2800, Zona Norte",
    phone: "+591 7500 0002",
    hours: "Lunes a viernes 9:00 a. m. - 5:30 p. m.",
  },
];

const locationOverview = {
  mainAddressShort: "Av. Monseñor Rivero # 120",
  mainAddressLong: "Av. Monseñor Rivero # 120, Santa Cruz de la Sierra",
  city: "Santa Cruz de la Sierra",
  zone: "Centro",
  reference: "Cerca del Cristo Redentor",
  mapAreas: ["Zona norte", "Centro", "Equipetrol"],
};

type ProfileEditForm = {
  name: string;
  logo: string;
  slogan: string;
  specialization: string;
  rating: string;
  reviewCount: string;
  category: string;
  experienceYears: string;
  businessType: string;
  specialties: string;
  coverageAreas: string;
  phone: string;
  whatsapp: string;
  email: string;
  scheduleWeek: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  branchMainName: string;
  branchMainAddress: string;
  branchMainPhone: string;
  branchMainHours: string;
  branchNorthName: string;
  branchNorthAddress: string;
  branchNorthPhone: string;
  branchNorthHours: string;
  mainAddressShort: string;
  mainAddressLong: string;
  city: string;
  zone: string;
  reference: string;
  mapAreas: string;
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Calificacion ${rating} de 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return (
          <span
            key={index}
            className={filled ? "text-amber-400" : "text-cyan-100/25"}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
      <span className="ml-2 text-sm text-cyan-100/80">{rating.toFixed(1)} / 5</span>
    </div>
  );
}

export default function Perfil() {
  const [businessProfile, setBusinessProfile] = useState(businessData);
  const [specialtyItems, setSpecialtyItems] = useState(specialties);
  const [coverageItems, setCoverageItems] = useState(coverageAreas);
  const [contactItems, setContactItems] = useState(contactChannels);
  const [scheduleItems, setScheduleItems] = useState(schedules);
  const [branchItems, setBranchItems] = useState(branches);
  const [locationCard, setLocationCard] = useState(locationOverview);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editForm, setEditForm] = useState<ProfileEditForm>({
    name: businessData.name,
    logo: businessData.logo,
    slogan: businessData.slogan,
    specialization: businessData.specialization,
    rating: String(businessData.rating),
    reviewCount: String(businessData.reviewCount),
    category: businessData.category,
    experienceYears: String(businessData.experienceYears),
    businessType: businessData.businessType,
    specialties: specialties.join(", "),
    coverageAreas: coverageAreas.join(", "),
    phone: contactChannels.find((item) => item.label === "Telefono")?.value ?? "",
    whatsapp: contactChannels.find((item) => item.label === "WhatsApp")?.value ?? "",
    email: contactChannels.find((item) => item.label === "Correo")?.value ?? "",
    scheduleWeek: schedules[0]?.hours ?? "",
    scheduleSaturday: schedules[1]?.hours ?? "",
    scheduleSunday: schedules[2]?.hours ?? "",
    branchMainName: branches[0]?.name ?? "",
    branchMainAddress: branches[0]?.address ?? "",
    branchMainPhone: branches[0]?.phone ?? "",
    branchMainHours: branches[0]?.hours ?? "",
    branchNorthName: branches[1]?.name ?? "",
    branchNorthAddress: branches[1]?.address ?? "",
    branchNorthPhone: branches[1]?.phone ?? "",
    branchNorthHours: branches[1]?.hours ?? "",
    mainAddressShort: locationOverview.mainAddressShort,
    mainAddressLong: locationOverview.mainAddressLong,
    city: locationOverview.city,
    zone: locationOverview.zone,
    reference: locationOverview.reference,
    mapAreas: locationOverview.mapAreas.join(", "),
  });

  const openEditModal = () => {
    setEditForm({
      name: businessProfile.name,
      logo: businessProfile.logo,
      slogan: businessProfile.slogan,
      specialization: businessProfile.specialization,
      rating: String(businessProfile.rating),
      reviewCount: String(businessProfile.reviewCount),
      category: businessProfile.category,
      experienceYears: String(businessProfile.experienceYears),
      businessType: businessProfile.businessType,
      specialties: specialtyItems.join(", "),
      coverageAreas: coverageItems.join(", "),
      phone: contactItems.find((item) => item.label === "Telefono")?.value ?? "",
      whatsapp: contactItems.find((item) => item.label === "WhatsApp")?.value ?? "",
      email: contactItems.find((item) => item.label === "Correo")?.value ?? "",
      scheduleWeek: scheduleItems[0]?.hours ?? "",
      scheduleSaturday: scheduleItems[1]?.hours ?? "",
      scheduleSunday: scheduleItems[2]?.hours ?? "",
      branchMainName: branchItems[0]?.name ?? "",
      branchMainAddress: branchItems[0]?.address ?? "",
      branchMainPhone: branchItems[0]?.phone ?? "",
      branchMainHours: branchItems[0]?.hours ?? "",
      branchNorthName: branchItems[1]?.name ?? "",
      branchNorthAddress: branchItems[1]?.address ?? "",
      branchNorthPhone: branchItems[1]?.phone ?? "",
      branchNorthHours: branchItems[1]?.hours ?? "",
      mainAddressShort: locationCard.mainAddressShort,
      mainAddressLong: locationCard.mainAddressLong,
      city: locationCard.city,
      zone: locationCard.zone,
      reference: locationCard.reference,
      mapAreas: locationCard.mapAreas.join(", "),
    });
    setEditMessage("");
    setShowEditModal(true);
  };

  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBusinessProfile((current) => ({
      ...current,
      name: editForm.name.trim() || current.name,
      logo: editForm.logo.trim() || current.logo,
      slogan: editForm.slogan.trim() || current.slogan,
      specialization: editForm.specialization.trim() || current.specialization,
      category: editForm.category.trim() || current.category,
      businessType: editForm.businessType.trim() || current.businessType,
      rating: Number(editForm.rating) > 0 ? Number(editForm.rating) : current.rating,
      reviewCount: Number(editForm.reviewCount) >= 0 ? Number(editForm.reviewCount) : current.reviewCount,
      experienceYears: Number(editForm.experienceYears) >= 0 ? Number(editForm.experienceYears) : current.experienceYears,
    }));

    setSpecialtyItems(parseList(editForm.specialties));
    setCoverageItems(parseList(editForm.coverageAreas));
    setContactItems([
      { label: "Telefono", value: editForm.phone.trim() },
      { label: "WhatsApp", value: editForm.whatsapp.trim() },
      { label: "Correo", value: editForm.email.trim() },
    ]);
    setScheduleItems([
      { day: "Lunes a viernes", hours: editForm.scheduleWeek.trim() },
      { day: "Sabado", hours: editForm.scheduleSaturday.trim() },
      { day: "Domingo y festivos", hours: editForm.scheduleSunday.trim() },
    ]);
    setBranchItems([
      {
        name: editForm.branchMainName.trim(),
        address: editForm.branchMainAddress.trim(),
        phone: editForm.branchMainPhone.trim(),
        hours: editForm.branchMainHours.trim(),
      },
      {
        name: editForm.branchNorthName.trim(),
        address: editForm.branchNorthAddress.trim(),
        phone: editForm.branchNorthPhone.trim(),
        hours: editForm.branchNorthHours.trim(),
      },
    ]);
    setLocationCard({
      mainAddressShort: editForm.mainAddressShort.trim(),
      mainAddressLong: editForm.mainAddressLong.trim(),
      city: editForm.city.trim(),
      zone: editForm.zone.trim(),
      reference: editForm.reference.trim(),
      mapAreas: parseList(editForm.mapAreas),
    });

    setEditMessage("Perfil actualizado correctamente.");
    setShowEditModal(false);
  };

  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openEditModal}
              className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/30"
            >
              Editar
            </button>
            <span className="tech-chip">Panel empresa</span>
          </div>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit">
          <CompanySidebar />
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
                <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                        {businessProfile.logo}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil del negocio</p>
                        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{businessProfile.name}</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-cyan-100/80 sm:text-base">{businessProfile.slogan}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">{businessProfile.specialization}</span>
                      <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">{businessProfile.businessType}</span>
                      <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">{businessProfile.category}</span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion general</p>
                        <div className="mt-3">
                          <RatingStars rating={businessProfile.rating} />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Reseñas</p>
                        <p className="mt-3 text-2xl font-bold text-white">{businessProfile.reviewCount}</p>
                        <p className="mt-1 text-sm text-cyan-100/70">Opiniones registradas</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Experiencia</p>
                        <p className="mt-3 text-2xl font-bold text-white">{businessProfile.experienceYears} años</p>
                        <p className="mt-1 text-sm text-cyan-100/70">Trayectoria en el sector</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura</p>
                        <p className="mt-3 text-base font-semibold text-white">Atencion local y a domicilio</p>
                        <p className="mt-1 text-sm text-cyan-100/70">Segun zona de servicio</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Referencia visual</p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/10 bg-[linear-gradient(135deg,_rgba(14,116,144,0.9),_rgba(8,47,73,0.96))] p-5 text-sm text-cyan-50">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em]">Mapa</span>
                        <span className="text-xs text-cyan-100/70">Ubicacion principal</span>
                      </div>
                      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Direccion principal</span>
                          <span className="text-right text-cyan-100/80">{locationCard.mainAddressShort}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Ciudad</span>
                          <span className="text-right text-cyan-100/80">{locationCard.city}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Zona</span>
                          <span className="text-right text-cyan-100/80">{locationCard.zone}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Referencia</span>
                          <span className="text-right text-cyan-100/80">{locationCard.reference}</span>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-cyan-50/90">
                        {locationCard.mapAreas.map((area) => (
                          <div key={area} className="rounded-2xl bg-white/10 p-3 text-center">{area}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Informacion general</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Descripcion del negocio</h2>
                  <p className="mt-4 text-sm leading-7 text-cyan-100/80">
                    plataforma inteligente, social y comercial especializada en Electrónica y Computación,
                    que conecta empresas, técnicos, usuarios y embajadores para generar confianza, visibilidad, ventas y
                    crecimiento sostenible dentro de un ecosistema digital escalable.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Categoria o rubro</p>
                      <p className="mt-2 font-semibold text-white">{businessProfile.category}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Tipo de negocio</p>
                      <p className="mt-2 font-semibold text-white">{businessProfile.businessType}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Areas de especializacion</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {specialtyItems.map((item) => (
                        <span key={item} className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Ubicacion y cobertura</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Donde atiende</h2>

                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Direccion principal</p>
                      <p className="mt-2 font-semibold text-white">{locationCard.mainAddressLong}</p>
                      <p className="mt-1 text-sm text-cyan-100/70">Referencia: {locationCard.reference}</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Ciudad</p>
                        <p className="mt-2 font-semibold text-white">{locationCard.city}</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Zona</p>
                        <p className="mt-2 font-semibold text-white">{locationCard.zone}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura del servicio</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {coverageItems.map((area) => (
                          <span key={area} className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Contacto</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Datos para comunicarse</h2>

                  <div className="mt-5 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {contactItems.map((channel) => (
                      <div key={channel.label} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4 break-words">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{channel.label}</p>
                        <p className="mt-2 text-sm font-semibold text-white break-words">{channel.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Redes sociales</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50 transition hover:bg-cyan-300/20"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Horarios de atencion</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Disponibilidad semanal</h2>

                  <div className="mt-5 space-y-3">
                    {scheduleItems.map((schedule) => (
                      <div key={schedule.day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                        <span className="font-semibold text-white">{schedule.day}</span>
                        <span className="text-sm text-cyan-100/75">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Sucursales o sedes</p>
                <h2 className="mt-3 text-2xl font-bold text-white">Puntos de atencion</h2>
                <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {branchItems.map((branch) => (
                    <div key={branch.name} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-5">
                      <p className="text-lg font-semibold text-white">{branch.name}</p>
                      <div className="mt-4 space-y-3 text-sm text-cyan-100/80">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Direccion</p>
                          <p className="mt-1 break-words">{branch.address}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Telefono</p>
                          <p className="mt-1 break-words">{branch.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Horario de atencion</p>
                          <p className="mt-1 leading-7 break-words">{branch.hours}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
                <article className="rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.95),_rgba(5,12,22,0.98))] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Confianza</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Resumen visual</h2>
                  <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion promedio</p>
                    <div className="mt-3">
                      <RatingStars rating={businessProfile.rating} />
                    </div>
                    <p className="mt-4 text-sm text-cyan-100/75">Basado en {businessProfile.reviewCount} reseñas de clientes.</p>
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Descripcion completa</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Quienes somos</h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-cyan-100/80">
                    <p>
                      Somos una empresa enfocada en soluciones tecnicas para equipos de computo, redes y
                      soporte operativo. Nuestra prioridad es ofrecer informacion clara del negocio para
                      que cada usuario entienda con rapidez quienes somos y como contactarnos.
                    </p>
                    <p>
                      Trabajamos con criterios de seriedad, cobertura definida y canales de atencion
                      visibles para facilitar una relacion confiable con clientes residenciales y
                      empresariales.
                    </p>
                  </div>
                </article>
              </section>
            </section>
        
      </main>

      {showEditModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
          <form onSubmit={handleSaveProfile} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Perfil empresa</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Editar informacion del perfil</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Nombre</span><input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Logo (siglas)</span><input value={editForm.logo} onChange={(event) => setEditForm((current) => ({ ...current, logo: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Slogan</span><input value={editForm.slogan} onChange={(event) => setEditForm((current) => ({ ...current, slogan: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Especializacion</span><input value={editForm.specialization} onChange={(event) => setEditForm((current) => ({ ...current, specialization: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Categoria</span><input value={editForm.category} onChange={(event) => setEditForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Tipo de negocio</span><input value={editForm.businessType} onChange={(event) => setEditForm((current) => ({ ...current, businessType: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Calificacion</span><input value={editForm.rating} onChange={(event) => setEditForm((current) => ({ ...current, rating: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Reseñas</span><input value={editForm.reviewCount} onChange={(event) => setEditForm((current) => ({ ...current, reviewCount: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Años de experiencia</span><input value={editForm.experienceYears} onChange={(event) => setEditForm((current) => ({ ...current, experienceYears: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Areas de especializacion (separadas por coma)</span><input value={editForm.specialties} onChange={(event) => setEditForm((current) => ({ ...current, specialties: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Cobertura (separada por coma)</span><input value={editForm.coverageAreas} onChange={(event) => setEditForm((current) => ({ ...current, coverageAreas: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>

              <label className="space-y-2 text-sm text-cyan-100/85"><span>Telefono</span><input value={editForm.phone} onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>WhatsApp</span><input value={editForm.whatsapp} onChange={(event) => setEditForm((current) => ({ ...current, whatsapp: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Correo</span><input value={editForm.email} onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>

              <label className="space-y-2 text-sm text-cyan-100/85"><span>Direccion corta (mapa)</span><input value={editForm.mainAddressShort} onChange={(event) => setEditForm((current) => ({ ...current, mainAddressShort: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Direccion completa</span><input value={editForm.mainAddressLong} onChange={(event) => setEditForm((current) => ({ ...current, mainAddressLong: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Ciudad</span><input value={editForm.city} onChange={(event) => setEditForm((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Zona</span><input value={editForm.zone} onChange={(event) => setEditForm((current) => ({ ...current, zone: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Referencia</span><input value={editForm.reference} onChange={(event) => setEditForm((current) => ({ ...current, reference: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Zonas del mapa (separadas por coma)</span><input value={editForm.mapAreas} onChange={(event) => setEditForm((current) => ({ ...current, mapAreas: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>

              <label className="space-y-2 text-sm text-cyan-100/85"><span>Horario lunes a viernes</span><input value={editForm.scheduleWeek} onChange={(event) => setEditForm((current) => ({ ...current, scheduleWeek: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Horario sabado</span><input value={editForm.scheduleSaturday} onChange={(event) => setEditForm((current) => ({ ...current, scheduleSaturday: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Horario domingo y festivos</span><input value={editForm.scheduleSunday} onChange={(event) => setEditForm((current) => ({ ...current, scheduleSunday: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>

              <label className="space-y-2 text-sm text-cyan-100/85"><span>Sede principal - nombre</span><input value={editForm.branchMainName} onChange={(event) => setEditForm((current) => ({ ...current, branchMainName: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Sede principal - telefono</span><input value={editForm.branchMainPhone} onChange={(event) => setEditForm((current) => ({ ...current, branchMainPhone: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Sede principal - direccion</span><input value={editForm.branchMainAddress} onChange={(event) => setEditForm((current) => ({ ...current, branchMainAddress: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Sede principal - horario</span><input value={editForm.branchMainHours} onChange={(event) => setEditForm((current) => ({ ...current, branchMainHours: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>

              <label className="space-y-2 text-sm text-cyan-100/85"><span>Sucursal norte - nombre</span><input value={editForm.branchNorthName} onChange={(event) => setEditForm((current) => ({ ...current, branchNorthName: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85"><span>Sucursal norte - telefono</span><input value={editForm.branchNorthPhone} onChange={(event) => setEditForm((current) => ({ ...current, branchNorthPhone: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Sucursal norte - direccion</span><input value={editForm.branchNorthAddress} onChange={(event) => setEditForm((current) => ({ ...current, branchNorthAddress: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2"><span>Sucursal norte - horario</span><input value={editForm.branchNorthHours} onChange={(event) => setEditForm((current) => ({ ...current, branchNorthHours: event.target.value }))} className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30" /></label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30">Guardar cambios</button>
              <button type="button" onClick={() => setShowEditModal(false)} className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">Cancelar</button>
            </div>
          </form>
        </div>
      ) : null}

      {editMessage ? (
        <div className="fixed bottom-5 right-5 z-40 rounded-2xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {editMessage}
        </div>
      ) : null}
    </div>
  );
}
