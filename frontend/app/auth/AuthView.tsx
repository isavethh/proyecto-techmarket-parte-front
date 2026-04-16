"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa";
type EnterpriseType = "tienda" | "servicio_tecnico";

type AuthViewProps = {
  initialMode: Mode;
  initialType: AccountType;
};

export default function AuthView({ initialMode, initialType }: AuthViewProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [accountType, setAccountType] = useState<AccountType>(initialType);
  const [enterpriseType, setEnterpriseType] =
    useState<EnterpriseType>("tienda");
  const [feedback, setFeedback] = useState<string>("");

  const title = useMemo(() => {
    if (mode === "login") {
      return "Accede a tu espacio TechMarket";
    }
    if (accountType === "empresa") {
      return "Registra tu empresa en TechMarket";
    }
    return "Crea tu cuenta de cliente";
  }, [mode, accountType]);

  const subtitle = useMemo(() => {
    if (mode === "login") {
      return "Accede con tu cuenta y retoma tu espacio personalizado.";
    }
    if (accountType === "empresa") {
      return "Selecciona si tu empresa opera como tienda o servicio tecnico.";
    }
    return "Empieza a descubrir productos y servicios con confianza.";
  }, [mode, accountType]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "login") {
      setFeedback(
        `Login preparado para ${accountType}. En el siguiente paso conectamos API y JWT.`,
      );
      return;
    }

    if (accountType === "empresa") {
      const label =
        enterpriseType === "servicio_tecnico" ? "servicio tecnico" : "tienda";
      setFeedback(
        `Registro empresa (${label}) capturado. Siguiente paso: guardar en backend y validar correo.`,
      );
      return;
    }

    setFeedback(
      "Registro cliente capturado. Siguiente paso: persistencia en backend y verificacion de cuenta.",
    );
  };

  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav sticky top-0 z-20">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Acceso seguro</span>
        </div>
      </header>

      <main className="tech-shell mt-8 md:mt-10">
        <section className="auth-layout">
          <article className="auth-panel auth-panel-main">
            <div className="auth-orb" aria-hidden="true" />
            <p className="tech-mono text-xs text-cyan-300/80">AUTH GATE</p>
            <h1 className="auth-title mt-2 text-cyan-50">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <p className="auth-label">Modo</p>
                <div className="auth-switch">
                  <button
                    type="button"
                    className={mode === "login" ? "active" : undefined}
                    onClick={() => setMode("login")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={mode === "register" ? "active" : undefined}
                    onClick={() => setMode("register")}
                  >
                    Registro
                  </button>
                </div>
              </div>

              {mode === "register" && accountType === "empresa" && (
                <div>
                  <p className="auth-label">Subtipo de empresa</p>
                  <div className="auth-pill-group">
                    <button
                      type="button"
                      className={`auth-pill ${enterpriseType === "tienda" ? "active" : ""}`}
                      onClick={() => setEnterpriseType("tienda")}
                    >
                      Tienda
                    </button>
                    <button
                      type="button"
                      className={`auth-pill ${enterpriseType === "servicio_tecnico" ? "active" : ""}`}
                      onClick={() => setEnterpriseType("servicio_tecnico")}
                    >
                      Servicio tecnico
                    </button>
                  </div>
                </div>
              )}

            </div>

            <form className="mt-6 auth-row" onSubmit={onSubmit}>
              {mode === "register" && (
                <div className="auth-row two">
                  <div>
                    <label className="auth-label" htmlFor="name">
                      {accountType === "empresa" ? "Nombre comercial" : "Nombre completo"}
                    </label>
                    <input
                      className="auth-input"
                      id="name"
                      name="name"
                      placeholder={
                        accountType === "empresa" ? "TechMarket Solutions" : "Juan Perez"
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="auth-label" htmlFor="phone">
                      Telefono
                    </label>
                    <input
                      className="auth-input"
                      id="phone"
                      name="phone"
                      placeholder="+57 300 000 0000"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === "register" && accountType === "empresa" && (
                <div>
                  <label className="auth-label" htmlFor="responsable">
                    Responsable de cuenta
                  </label>
                  <input
                    className="auth-input"
                    id="responsable"
                    name="responsable"
                    placeholder="Nombre del encargado"
                    required
                  />
                </div>
              )}

              <div>
                <label className="auth-label" htmlFor="email">
                  Correo
                </label>
                <input
                  className="auth-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div>
                <label className="auth-label" htmlFor="password">
                  Contrasena
                </label>
                <input
                  className="auth-input"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="auth-label" htmlFor="confirmPassword">
                    Confirmar contrasena
                  </label>
                  <input
                    className="auth-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="auth-inline">
                  <label className="auth-checkbox">
                    <input type="checkbox" name="remember" />
                    Recordarme en este dispositivo
                  </label>
                  <button type="button" className="auth-link">
                    Olvidaste tu contrasena?
                  </button>
                </div>
              )}

              <button type="submit" className="tech-button tech-button-primary mt-2">
                {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
              </button>
            </form>

            {feedback && <p className="auth-message mt-4">{feedback}</p>}
          </article>

          <aside className="auth-panel auth-panel-side">
            <div className="auth-hero">
              <p className="tech-mono text-xs text-cyan-300/80">BIENVENIDO</p>
              <h2 className="mt-2 text-2xl font-semibold text-cyan-50">
                Acceso inteligente para un ecosistema confiable
              </h2>
              <p className="mt-3 text-sm text-cyan-100/80">
                Un unico lugar para clientes, tiendas y servicios tecnicos con
                identidad verificada.
              </p>
              <div className="mt-5 grid gap-3">
                <div className="auth-stat">
                  <span>Verificacion rapida</span>
                  <strong>En minutos</strong>
                </div>
                <div className="auth-stat">
                  <span>Perfiles visibles</span>
                  <strong>Mayor confianza</strong>
                </div>
                <div className="auth-stat">
                  <span>Contacto directo</span>
                  <strong>Sin intermediarios</strong>
                </div>
              </div>
            </div>

            <div className="auth-panel-sub mt-5">
              <p className="auth-helper">Necesitas ayuda?</p>
              <div className="mt-3 grid gap-2 text-sm text-cyan-100/80">
                <span>Soporte en vivo para empresas</span>
                <span>Guia rapida para clientes</span>
                <span>Buenas practicas de seguridad</span>
              </div>
              <button className="tech-button tech-button-secondary mt-4" type="button">
                Hablar con soporte
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
