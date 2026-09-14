import { crearPrestamoRequestDto } from "../contratos/prestamo.dto.js";
import type { CrearPrestamoDto } from "../dto/crear-prestamo.dto.js";
import { validacionError } from "./htppErrrores.js";

export function validarCrearPrestamoDto(cuerpo: unknown): crearPrestamoRequestDto {
    const errores: string[] = [];
    if(typeof cuerpo !== "object" || cuerpo === null) {
        throw new validacionError(["El cuerpo de la solicitud debe ser un objeto JSON"]);

    }

    const c = cuerpo as Record<string, unknown>;
    
    if(typeof c.libroId !== "string" || c.libroId.trim() === "") {
        errores.push("libro id debe ser un texto no vacio");

    }
    if(typeof c.socioId !== "string" || c.socioId.trim() === "") {
        errores.push("socio id debe ser un texto no vacio");
    }

    if(!Array.isArray(c.ejemplares) || c.ejemplares.length === 0 || !c.ejemplares.every(e => typeof e === "number")) {
        errores.push("ejemplares debe ser un arreglo de numeros no vacio");
    }else if(c.ejemplares.some(e => e <= 0)) {
        errores.push("ejemplares debe contener numeros positivos");
    }

    if(errores.length > 0) {
        throw new validacionError(errores);
    }
    return c as unknown as crearPrestamoRequestDto;
}
