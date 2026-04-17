import Link from "next/link";

const companyModules = [
  { title: "Perfil", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const businessData = {
  name: "TechMarket",
  logo: "TC",
  slogan: "Soluciones confiables en tecnologia para hogar y empresa.",
  specialization: "Laptops, redes y reparacion tecnica",
  rating: 4.8,
  reviewCount: 128,
  category: "Servicios y venta especializada en tecnologia",
  experienceYears: 12,
  businessType: "Tienda y centro tecnico",
};

const specialties = ["Diagnostico y reparacion", "Redes y cableado", "Mantenimiento preventivo", "Soporte para empresas"];

const coverageAreas = ["Centro de la ciudad", "Zona norte", "Corredor empresarial", "Atencion a domicilio en sectores cercanos"];

const contactChannels = [
  { label: "Telefono", value: "+57 312 456 7890" },
  { label: "WhatsApp", value: "+57 312 456 7890" },
  { label: "Correo", value: "contacto@tecnocentroandino.com" },
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
    address: "Calle 45 # 12-34, Barrio Centro",
    phone: "+57 312 456 7890",
    hours: "Lunes a viernes 8:00 a. m. - 6:30 p. m.; Sabado 9:00 a. m. - 2:00 p. m.",
  },
  {
    name: "Sucursal Norte",
    address: "Avenida 2 Norte # 18-20, Sector Comercial",
    phone: "+57 315 222 1144",
    hours: "Lunes a viernes 9:00 a. m. - 5:30 p. m.",
  },
];

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
  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="tech-card h-fit">
          <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESAS</p>
          <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
            {companyModules.map((module) => (
              <Link key={module.title} href={module.href} className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 hover:bg-cyan-100/5 transition">
                {module.title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
                <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                        {businessData.logo}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil del negocio</p>
                        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{businessData.name}</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-cyan-100/80 sm:text-base">{businessData.slogan}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">{businessData.specialization}</span>
                      <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">{businessData.businessType}</span>
                      <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">{businessData.category}</span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion general</p>
                        <div className="mt-3">
                          <RatingStars rating={businessData.rating} />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Reseñas</p>
                        <p className="mt-3 text-2xl font-bold text-white">{businessData.reviewCount}</p>
                        <p className="mt-1 text-sm text-cyan-100/70">Opiniones registradas</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Experiencia</p>
                        <p className="mt-3 text-2xl font-bold text-white">{businessData.experienceYears} años</p>
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
                          <span className="text-right text-cyan-100/80">Calle 45 # 12-34</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Ciudad</span>
                          <span className="text-right text-cyan-100/80">Cali</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Zona</span>
                          <span className="text-right text-cyan-100/80">Centro comercial</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Referencia</span>
                          <span className="text-right text-cyan-100/80">Frente al parque principal</span>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-cyan-50/90">
                        <div className="rounded-2xl bg-white/10 p-3 text-center">Zona norte</div>
                        <div className="rounded-2xl bg-cyan-300/20 p-3 text-center">Centro</div>
                        <div className="rounded-2xl bg-white/10 p-3 text-center">Corredor empresarial</div>
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
                      <p className="mt-2 font-semibold text-white">{businessData.category}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Tipo de negocio</p>
                      <p className="mt-2 font-semibold text-white">{businessData.businessType}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Areas de especializacion</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {specialties.map((item) => (
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
                      <p className="mt-2 font-semibold text-white">Calle 45 # 12-34, Barrio Centro, Cali</p>
                      <p className="mt-1 text-sm text-cyan-100/70">Referencia: frente al parque principal</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Ciudad</p>
                        <p className="mt-2 font-semibold text-white">Cali</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Zona</p>
                        <p className="mt-2 font-semibold text-white">Centro comercial</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura del servicio</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {coverageAreas.map((area) => (
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
                    {contactChannels.map((channel) => (
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
                    {schedules.map((schedule) => (
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
                  {branches.map((branch) => (
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
                      <RatingStars rating={businessData.rating} />
                    </div>
                    <p className="mt-4 text-sm text-cyan-100/75">Basado en {businessData.reviewCount} reseñas de clientes.</p>
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
    </div>
  );
}
