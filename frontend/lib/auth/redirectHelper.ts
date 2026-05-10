/**
 * Mapea el tipo de usuario a la ruta de redirección correspondiente.
 * @param tipo - El tipo de usuario (cliente, empresa, especialista, embajador)
 * @returns La ruta a la cual redirigir
 */
export function getRedirectPathByUserType(tipo: unknown): string {
  if (typeof tipo === "string") {
    switch (tipo.toLowerCase()) {
      case "empresa":
        return "/empresa";
      case "especialista":
        return "/especialista";
      case "embajador":
        return "/embajador";
      case "cliente":
      default:
        return "/cliente";
    }
  }
  return "/cliente";
}
