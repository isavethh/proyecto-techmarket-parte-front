/**
 * Mapea el tipo de usuario a la ruta de redirección correspondiente.
 * @param tipo - El tipo de usuario (cliente, empresa, especialista, embajador)
 * @returns La ruta a la cual redirigir
 */
export function getRedirectPathByUserType(tipo: unknown): string {
  console.log("[getRedirectPathByUserType] Tipo recibido:", tipo, "Tipo de dato:", typeof tipo);
  
  if (typeof tipo === "string") {
    const tipoLower = tipo.toLowerCase().trim();
    console.log("[getRedirectPathByUserType] Tipo normalizado:", tipoLower);
    
    switch (tipoLower) {
      case "empresa":
        console.log("[getRedirectPathByUserType] Retornando /empresa");
        return "/empresa";
      case "especialista":
        console.log("[getRedirectPathByUserType] Retornando /especialista");
        return "/especialista";
      case "embajador":
        console.log("[getRedirectPathByUserType] Retornando /embajador");
        return "/embajador";
      case "cliente":
        console.log("[getRedirectPathByUserType] Retornando /cliente (match)");
        return "/cliente";
      default:
        console.log("[getRedirectPathByUserType] Retornando /cliente (default)");
        return "/cliente";
    }
  }
  
  console.log("[getRedirectPathByUserType] tipo no es string, retornando /cliente (fallback)");
  return "/cliente";
}
