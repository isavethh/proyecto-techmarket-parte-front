"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";

type ProductSpec = {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  weight: string;
  price: string;
  warranty: string;
  workScore: number;
  gamingScore: number;
  creatorScore: number;
};

const products: ProductSpec[] = [
  {
    id: "p-1",
    name: "NovaBook Air 14",
    brand: "TechMarket Labs",
    image: "/productos/laptop-pro-14.jpg",
    category: "Ultraligera",
    cpu: "Intel Core i7 1360P",
    gpu: "Intel Iris Xe",
    ram: "16 GB LPDDR5",
    storage: "SSD 512 GB NVMe",
    display: "14\" 2.8K OLED 90Hz",
    battery: "14 horas mixto",
    weight: "1.18 kg",
    price: "$3.650.000",
    warranty: "12 meses",
    workScore: 92,
    gamingScore: 58,
    creatorScore: 80,
  },
  {
    id: "p-2",
    name: "ForgeStation G15",
    brand: "Zona Gamer Store",
    image: "/productos/monitor-ultrawide-34.jpg",
    category: "Gaming",
    cpu: "AMD Ryzen 7 8845HS",
    gpu: "RTX 4060 8GB",
    ram: "16 GB DDR5",
    storage: "SSD 1 TB NVMe",
    display: "15.6\" QHD 165Hz",
    battery: "7 horas mixto",
    weight: "2.15 kg",
    price: "$5.150.000",
    warranty: "18 meses",
    workScore: 84,
    gamingScore: 95,
    creatorScore: 91,
  },
  {
    id: "p-3",
    name: "Creator Pro 16",
    brand: "Pixel Andino",
    image: "/productos/teclado-tkl.jpg",
    category: "Creador de contenido",
    cpu: "Intel Core Ultra 9",
    gpu: "RTX 4070 8GB",
    ram: "32 GB DDR5",
    storage: "SSD 1 TB NVMe",
    display: "16\" 3.2K Mini-LED 120Hz",
    battery: "9 horas mixto",
    weight: "1.95 kg",
    price: "$7.200.000",
    warranty: "24 meses",
    workScore: 96,
    gamingScore: 93,
    creatorScore: 98,
  },
  {
    id: "p-4",
    name: "Budget Smart 15",
    brand: "TecnoCentro Andino",
    image: "/productos/kit-limpieza-pc.jpg",
    category: "Entrada",
    cpu: "Intel Core i5 1335U",
    gpu: "Intel Iris Xe",
    ram: "8 GB DDR4",
    storage: "SSD 512 GB",
    display: "15.6\" FHD 60Hz",
    battery: "11 horas mixto",
    weight: "1.70 kg",
    price: "$2.450.000",
    warranty: "12 meses",
    workScore: 78,
    gamingScore: 42,
    creatorScore: 55,
  },
];

const specsToCompare: Array<{ label: string; key: keyof ProductSpec }> = [
  { label: "Categoria", key: "category" },
  { label: "CPU", key: "cpu" },
  { label: "GPU", key: "gpu" },
  { label: "RAM", key: "ram" },
  { label: "Almacenamiento", key: "storage" },
  { label: "Pantalla", key: "display" },
  { label: "Bateria", key: "battery" },
  { label: "Peso", key: "weight" },
  { label: "Precio", key: "price" },
  { label: "Garantia", key: "warranty" },
];

const scoreItems: Array<{ label: string; key: "workScore" | "gamingScore" | "creatorScore" }> = [
  { label: "Trabajo", key: "workScore" },
  { label: "Gaming", key: "gamingScore" },
  { label: "Creacion", key: "creatorScore" },
];

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default function ClienteVersusPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["p-1", "p-2"]);

  const pathname = usePathname();

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        if (current.length <= 2) {
          return current;
        }

        return current.filter((item) => item !== id);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, id];
    });
  };

  const bestForWork = useMemo(
    () => [...selectedProducts].sort((a, b) => b.workScore - a.workScore)[0],
    [selectedProducts],
  );

  const bestForGaming = useMemo(
    () => [...selectedProducts].sort((a, b) => b.gamingScore - a.gamingScore)[0],
    [selectedProducts],
  );

  const bestForCreator = useMemo(
    () => [...selectedProducts].sort((a, b) => b.creatorScore - a.creatorScore)[0],
    [selectedProducts],
  );

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Versus" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Cliente activo en TechMarket</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {clientMenuItems.map((item) => {
                const isActive =
                  item.href === "/cliente"
                    ? pathname === "/cliente"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`auth-action ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">VERSUS CONFIG</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Comparacion guiada</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Compara equipos lado a lado para elegir con mas claridad segun trabajo, gaming o creacion.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Comparacion", "Rendimiento", "Decision", "Analisis"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <section className="tech-card space-y-2">
              {products.map((product) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-cyan-300/55 bg-cyan-300/12"
                        : "border-cyan-100/15 bg-slate-950/25 hover:bg-slate-950/40"
                    }`}
                  >
                    <p className="text-sm font-semibold text-cyan-50">{product.name}</p>
                    <p className="mt-1 text-xs text-cyan-100/75">{product.brand}</p>
                    <p className="mt-1 text-xs text-cyan-200/70">{product.price}</p>
                  </button>
                );
              })}
            </section>

            <section className="tech-card">
              <p className="text-sm font-semibold text-cyan-50">Resumen IA</p>
              <p className="mt-3 text-sm text-cyan-100/80">
                Mejor para trabajo: {bestForWork?.name ?? "N/D"}
              </p>
              <p className="mt-2 text-sm text-cyan-100/80">
                Mejor para gaming: {bestForGaming?.name ?? "N/D"}
              </p>
              <p className="mt-2 text-sm text-cyan-100/80">
                Mejor para creacion: {bestForCreator?.name ?? "N/D"}
              </p>
            </section>

            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/marketplace", label: "Explorar marketplace" },
                { href: "#versus-activo", label: "Ver comparacion activa" },
              ]}
            />
          </div>
        </aside>

        <section  id="versus-activo"  className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">MOCKUP VERSUS</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Comparador visual de productos</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Pensado para reducir incertidumbre de compra: comparacion tecnica, scores por uso y decision
              guiada en una sola vista.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {selectedProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="text-xs text-cyan-200/80">{product.brand}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
                  <p className="mt-2 text-sm text-cyan-100/80">{product.category}</p>
                  <p className="mt-3 text-base font-bold text-cyan-100">{product.price}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="tech-card overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-cyan-200/75">Caracteristica</th>
                  {selectedProducts.map((product) => (
                    <th key={`head-${product.id}`} className="px-3 py-2 text-cyan-50">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specsToCompare.map((spec) => (
                  <tr key={spec.key}>
                    <td className="rounded-l-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 font-semibold text-cyan-100/90">
                      {spec.label}
                    </td>
                    {selectedProducts.map((product, index) => (
                      <td
                        key={`${spec.key}-${product.id}`}
                        className={`border border-cyan-100/10 bg-slate-950/35 px-3 py-2 text-cyan-100/80 ${
                          index === selectedProducts.length - 1 ? "rounded-r-xl" : ""
                        }`}
                      >
                        {String(product[spec.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="tech-card">
            <h3 className="text-lg font-semibold text-cyan-50">Scores por escenario</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {scoreItems.map((score) => (
                <article key={score.key} className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
                  <p className="text-sm font-semibold text-cyan-100">{score.label}</p>
                  <div className="mt-3 space-y-2">
                    {selectedProducts.map((product) => (
                      <div key={`${score.key}-${product.id}`}>
                        <div className="mb-1 flex items-center justify-between text-xs text-cyan-100/80">
                          <span>{product.name}</span>
                          <span>{product[score.key]}/100</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-900/80">
                          <div
                            className="h-full rounded-full bg-cyan-300"
                            style={{ width: `${product[score.key]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="tech-card">
            <h3 className="text-lg font-semibold text-cyan-50">Decision sugerida</h3>
            <p className="mt-3 text-sm text-cyan-100/85">
              Si priorizas movilidad y bateria: <span className="font-semibold text-cyan-50">{bestForWork?.name}</span>.
            </p>
            <p className="mt-2 text-sm text-cyan-100/85">
              Si priorizas rendimiento bruto: <span className="font-semibold text-cyan-50">{bestForGaming?.name}</span>.
            </p>
            <p className="mt-2 text-sm text-cyan-100/85">
              Si trabajas con diseno y video: <span className="font-semibold text-cyan-50">{bestForCreator?.name}</span>.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
