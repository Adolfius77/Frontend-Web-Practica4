// =====================================================================
//  CHECKPOINT 4  —  el Service: aqui y SOLO aqui viven las reglas
// =====================================================================
//  Regla de negocio de esta practica:
//    "no se puede prestar un ejemplar que ya esta prestado"
//
//  TODO 4:
//    1. Recibir el repositorio POR CONSTRUCTOR, tipado con la
//       INTERFAZ `PrestamoRepository`, nunca con la clase concreta.
//    2. Metodo `crear(dto: CrearPrestamoDto): Promise<Prestamo>`:
//         a. pedir al repositorio los prestamos de ese libro
//         b. juntar los ejemplares que ya estan fuera
//            (pista: `.filter(...)` por estado + `.flatMap(...)`)
//         c. si alguno de los solicitados choca, lanzar
//            `new EjemplarPrestadoError(numero)`
//         d. si no, guardar el prestamo nuevo y devolverlo
//    3. Metodo `listarPorLibro(libroId)` que solo delega al repositorio.
//
//  LA PRUEBA DE FUEGO de este archivo:
//    ¿aparece la palabra `InMemory` en algun import? Si aparece, el
//    Service quedo acoplado a la infraestructura y el patron se rompio.
// =====================================================================

import type { PrestamoRepository } from '../dominio/prestamo.repository.js';
import type { Prestamo } from '../dominio/prestamo.entity.js';
import { nuevoFolio } from '../dominio/prestamo.entity.js';
import type { CrearPrestamoDto } from '../dto/crear-prestamo.dto.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

export class PrestamoService {
  // TODO 4.1: constructor que recibe el repositorio
  constructor(private readonly repo: PrestamoRepository) {}
  // TODO 4.2: metodo crear()
  async crear(dto: CrearPrestamoDto): Promise<Prestamo> {
    // 1. pedir al repositorio los prestamos de ese libro
    const prestamos = await this.repo.findByLibro(dto.libroId);

    // 2. juntar los ejemplares que ya estan fuera
    const ejemplaresPrestados = prestamos
      .filter(p => p.estado === 'activo') // solo los activos
      .flatMap(p => p.ejemplares);        // todos los ejemplares

    // 3. si alguno de los solicitados choca, lanzar error
    const choque = dto.ejemplares.find(e => ejemplaresPrestados.includes(e));
    if (choque !== undefined) {
      throw new EjemplarPrestadoError(choque);
    }
    // 4. si no, guardar el prestamo nuevo y devolverlo
    const nuevoPrestamo: Prestamo = {
      ...dto,
      folio: nuevoFolio(),
      creadoEn: new Date(),
      estado: 'activo',
      costoReposicion: 0,
      ejemplares: [...dto.ejemplares], 
    };
    return await this.repo.save(nuevoPrestamo);
  }
  // TODO 4.3: metodo listarPorLibro()
  async listarPorLibro(libroId: string): Promise<Prestamo[]> {
    return await this.repo.findByLibro(libroId);
  }
}

