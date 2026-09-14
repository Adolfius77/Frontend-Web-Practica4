import type { Prestamo, EstadoPrestamo } from '../dominio/prestamo.entity.js';

//lo que el cliente recibe
export interface PrestamoResponseDto {
  folio: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
  creadoEn: string; // ISO format
}

//lo que el cliente manda
export interface CrearPrestamoRequestDto {
  libroId: string;
  socioId: string;
  ejemplares: number[];
}

//LA FORMA DE LOS ERRORES QUE TAMBIEN ES PARTE DEL CONTRATO
export interface ErrorResponseDto {
  error: string;
  mensaje: string;
  detalles?: string;
}

// aliases para compatibilidad con el resto del proyecto
export type crearPrestamoRequestDto = CrearPrestamoRequestDto;
export type errorResponseDto = ErrorResponseDto;

//mapper entidad a dto
export function aResponseDto(p: Prestamo): PrestamoResponseDto {
  return {
    folio: p.folio,
    libroId: p.libroId,
    ejemplares: p.ejemplares,
    socioId: p.socioId,
    estado: p.estado,
    creadoEn: p.creadoEn.toISOString(),
  };
}
