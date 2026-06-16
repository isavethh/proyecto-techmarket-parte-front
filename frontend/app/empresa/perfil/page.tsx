"use client";

import { FormEvent, useEffect, useState } from "react";
import { CompanyPageHeader } from "../../components/CompanyPageSections";
import { CompanySidebar } from "../CompanySidebar";
import { fetchCompanyProfile, updateCompanyProfile, type CompanyProfileData } from "../companyEndpoints";

const businessData = {
  name: "",
  logo: "",
  slogan: "",
  specialization: "",
  rating: 0,
  reviewCount: 0,
  category: "",
  experienceYears: 0,
  businessType: "",
};

const specialties: string[] = [];

const coverageAreas: string[] = [];

const contactChannels: CompanyProfileData["contactChannels"] = [];

const socialLinks: CompanyProfileData["socialLinks"] = [];

const schedules: CompanyProfileData["schedules"] = [];

const branches: CompanyProfileData["branches"] = [];

const locationOverview = {
  mainAddressShort: "",
  mainAddressLong: "",
  city: "",
  zone: "",
  reference: "",
  mapAreas: [] as string[],
};

type ProfileEditForm = {
  name: string;
  logo: string;
  slogan: string;
  specialization: string;
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
    <div
      className="inline-flex items-center gap-1"
      aria-label={`Calificacion ${rating} de 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return (
          <span
            key={index}
            className={`text-base leading-none ${
              filled ? "text-amber-400" : "text-cyan-100/20"
            }`}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function EmptyData({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/35 p-4 text-sm text-cyan-100/70 ${className}`}>
      No hay datos para mostrar
    </div>
  );
}

export default function Perfil() {
  const [businessProfile, setBusinessProfile] = useState(businessData);
  const [profileDescription, setProfileDescription] = useState("");
  const [profileAbout, setProfileAbout] = useState<string[]>([]);
  const [specialtyItems, setSpecialtyItems] = useState(specialties);
  const [coverageItems, setCoverageItems] = useState(coverageAreas);
  const [contactItems, setContactItems] = useState(contactChannels);
  const [socialLinkItems, setSocialLinkItems] = useState(socialLinks);
  const [scheduleItems, setScheduleItems] = useState(schedules);
  const [branchItems, setBranchItems] = useState(branches);
  const [locationCard, setLocationCard] = useState(locationOverview);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("general");
  const [editMessage, setEditMessage] = useState("");
  const [editForm, setEditForm] = useState<ProfileEditForm>({
    name: businessData.name,
    logo: businessData.logo,
    slogan: businessData.slogan,
    specialization: businessData.specialization,
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

  useEffect(() => {
    void fetchCompanyProfile().then((profile) => {
      const { businessData: profileBusinessData, specialties: profileSpecialties, coverageAreas: profileCoverageAreas, contactChannels: profileContactChannels, socialLinks: profileSocialLinks, schedules: profileSchedules, branches: profileBranches, locationOverview: profileLocation } = profile;

      setBusinessProfile(profileBusinessData);
      setProfileDescription(profile.description ?? "");
      setProfileAbout(profile.about ?? []);
      setSpecialtyItems(profileSpecialties);
      setCoverageItems(profileCoverageAreas);
      setContactItems(profileContactChannels);
      setSocialLinkItems(profileSocialLinks);
      setScheduleItems(profileSchedules);
      setBranchItems(profileBranches);
      setLocationCard(profileLocation);
    });
  }, []);

  const openEditModal = () => {
    setEditForm({
      name: businessProfile.name,
      logo: businessProfile.logo,
      slogan: businessProfile.slogan,
      specialization: businessProfile.specialization,
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
    setActiveProfileTab("general");
    setShowEditModal(true);
  };

  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const profileTabs: Array<{ id: string; label: string }> = [
    { id: "general", label: "General" },
    { id: "contacto", label: "Contacto" },
    { id: "servicios", label: "Servicios" },
    { id: "ubicacion", label: "Ubicacion" },
    { id: "sucursales", label: "Sucursales" },
  ];

  const renderField = (label: string, key: keyof ProfileEditForm, fullWidth = false) => (
    <label className={`space-y-2 text-sm text-cyan-100/85 ${fullWidth ? "md:col-span-2" : ""}`}>
      <span>{label}</span>
      <input
        value={editForm[key]}
        onChange={(event) => setEditForm((current) => ({ ...current, [key]: event.target.value }))}
        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 placeholder:text-cyan-100/35 transition focus:border-cyan-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
      />
    </label>
  );

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

    void updateCompanyProfile({
      businessData: {
        name: editForm.name.trim() || businessProfile.name,
        logo: editForm.logo.trim() || businessProfile.logo,
        slogan: editForm.slogan.trim() || businessProfile.slogan,
        specialization: editForm.specialization.trim() || businessProfile.specialization,
        rating: businessProfile.rating,
        reviewCount: businessProfile.reviewCount,
        category: editForm.category.trim() || businessProfile.category,
        experienceYears: Number(editForm.experienceYears) >= 0 ? Number(editForm.experienceYears) : businessProfile.experienceYears,
        businessType: editForm.businessType.trim() || businessProfile.businessType,
      },
      description: profileDescription,
      about: profileAbout,
      specialties: parseList(editForm.specialties),
      coverageAreas: parseList(editForm.coverageAreas),
      contactChannels: [
        { label: "Telefono", value: editForm.phone.trim() },
        { label: "WhatsApp", value: editForm.whatsapp.trim() },
        { label: "Correo", value: editForm.email.trim() },
      ],
      socialLinks: socialLinkItems,
      schedules: [
        { day: "Lunes a viernes", hours: editForm.scheduleWeek.trim() },
        { day: "Sabado", hours: editForm.scheduleSaturday.trim() },
        { day: "Domingo y festivos", hours: editForm.scheduleSunday.trim() },
      ],
      branches: [
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
      ],
      locationOverview: {
        mainAddressShort: editForm.mainAddressShort.trim(),
        mainAddressLong: editForm.mainAddressLong.trim(),
        city: editForm.city.trim(),
        zone: editForm.zone.trim(),
        reference: editForm.reference.trim(),
        mapAreas: parseList(editForm.mapAreas),
      },
    });

    setEditMessage("Perfil actualizado correctamente.");
    setShowEditModal(false);
  };

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Perfil"
        brandHref="/empresa"
        rightSlot={
          <button
            type="button"
            onClick={openEditModal}
            className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/30"
          >
            Editar
          </button>
        }
      />

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL EMPRESA</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Identidad y datos del negocio</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Gestiona la informacion clave de tu empresa para mantener un perfil claro y confiable.
            </p>
          </section>
          <CompanySidebar />
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
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
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">
                          Calificacion general
                        </p>
                        <div className="mt-4 space-y-3">
                          <div className="space-y-1">
                            <p className="mt-3 text-3xl font-bold text-white">
                              {businessProfile.rating.toFixed(1)}
                            </p>
                            <p className="text-sm text-cyan-100/70">de 5 puntos</p>
                          </div>
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
                        {locationCard.mapAreas.length ? (
                          locationCard.mapAreas.map((area) => (
                            <div key={area} className="rounded-2xl bg-white/10 p-3 text-center">{area}</div>
                          ))
                        ) : (
                          <EmptyData className="col-span-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
                <article className="h-full rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Informacion general</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Descripcion del negocio</h2>
                  {profileDescription ? (
                    <p className="mt-4 text-sm leading-7 text-cyan-100/80">{profileDescription}</p>
                  ) : (
                    <EmptyData className="mt-4" />
                  )}

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
                      {specialtyItems.length ? (
                        specialtyItems.map((item) => (
                          <span key={item} className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50">
                            {item}
                          </span>
                        ))
                      ) : (
                        <EmptyData className="w-full" />
                      )}
                    </div>
                  </div>
                </article>

                <article className="h-full rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
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
                        {coverageItems.length ? (
                          coverageItems.map((area) => (
                            <span key={area} className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                              {area}
                            </span>
                          ))
                        ) : (
                          <EmptyData className="w-full" />
                        )}
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
                    {contactItems.length ? (
                      contactItems.map((channel) => (
                        <div key={channel.label} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4 break-words">
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{channel.label}</p>
                          <p className="mt-2 text-sm font-semibold text-white break-words">{channel.value}</p>
                        </div>
                      ))
                    ) : (
                      <EmptyData className="md:col-span-2 lg:col-span-3" />
                    )}
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Redes sociales</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {socialLinkItems.length ? (
                        socialLinkItems.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50 transition hover:bg-cyan-300/20"
                          >
                            {social.label}
                          </a>
                        ))
                      ) : (
                        <EmptyData className="w-full" />
                      )}
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Horarios de atencion</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Disponibilidad semanal</h2>

                  <div className="mt-5 space-y-3">
                    {scheduleItems.length ? (
                      scheduleItems.map((schedule) => (
                        <div key={schedule.day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                          <span className="font-semibold text-white">{schedule.day}</span>
                          <span className="text-sm text-cyan-100/75">{schedule.hours}</span>
                        </div>
                      ))
                    ) : (
                      <EmptyData />
                    )}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Sucursales o sedes</p>
                <h2 className="mt-3 text-2xl font-bold text-white">Puntos de atencion</h2>
                <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {branchItems.length ? (
                    branchItems.map((branch, branchIndex) => (
                      <div key={branch.name || branchIndex} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-5">
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
                    ))
                  ) : (
                    <EmptyData className="lg:col-span-2" />
                  )}
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
                    {profileAbout.length ? (
                      profileAbout.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                    ) : (
                      <EmptyData />
                    )}
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

            <div className="mt-6 flex flex-wrap gap-1 border-b border-cyan-100/10">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`relative rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeProfileTab === tab.id
                      ? "text-cyan-50"
                      : "text-cyan-100/50 hover:text-cyan-100/85"
                  }`}
                >
                  {tab.label}
                  {activeProfileTab === tab.id ? (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)]" />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-5 min-h-[300px]">
              {activeProfileTab === "general" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderField("Nombre comercial", "name")}
                  {renderField("Logo (siglas)", "logo")}
                  {renderField("Slogan", "slogan", true)}
                  {renderField("Especializacion", "specialization")}
                  {renderField("Categoria", "category")}
                  {renderField("Tipo de negocio", "businessType")}
                  {renderField("Años de experiencia", "experienceYears")}
                  <p className="md:col-span-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-4 py-3 text-xs leading-5 text-cyan-100/60">
                    La calificacion y el numero de resenas se calculan automaticamente a partir de las
                    resenas de tus clientes; no se editan aqui.
                  </p>
                </div>
              ) : null}

              {activeProfileTab === "contacto" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderField("Telefono", "phone")}
                  {renderField("WhatsApp", "whatsapp")}
                  {renderField("Correo", "email", true)}
                </div>
              ) : null}

              {activeProfileTab === "servicios" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderField("Areas de especializacion (separadas por coma)", "specialties", true)}
                  {renderField("Cobertura (separada por coma)", "coverageAreas", true)}
                </div>
              ) : null}

              {activeProfileTab === "ubicacion" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderField("Direccion corta (mapa)", "mainAddressShort")}
                  {renderField("Direccion completa", "mainAddressLong")}
                  {renderField("Ciudad", "city")}
                  {renderField("Zona", "zone")}
                  {renderField("Referencia", "reference", true)}
                  {renderField("Zonas del mapa (separadas por coma)", "mapAreas", true)}
                  {renderField("Horario lunes a viernes", "scheduleWeek")}
                  {renderField("Horario sabado", "scheduleSaturday")}
                  {renderField("Horario domingo y festivos", "scheduleSunday", true)}
                </div>
              ) : null}

              {activeProfileTab === "sucursales" ? (
                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/65">
                      Sede principal
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {renderField("Nombre", "branchMainName")}
                      {renderField("Telefono", "branchMainPhone")}
                      {renderField("Direccion", "branchMainAddress", true)}
                      {renderField("Horario", "branchMainHours", true)}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/65">
                      Sucursal norte
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {renderField("Nombre", "branchNorthName")}
                      {renderField("Telefono", "branchNorthPhone")}
                      {renderField("Direccion", "branchNorthAddress", true)}
                      {renderField("Horario", "branchNorthHours", true)}
                    </div>
                  </div>
                </div>
              ) : null}
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


