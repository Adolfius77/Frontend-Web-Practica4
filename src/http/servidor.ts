import express from 'express';
import { PrestamoService } from '../servicios/prestamo.service.js';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';
import { validacionError } from './htppErrrores.js';
import {validarCrearPrestamoDto} from './validar.js';
import { aResponseDto } from '../dto/prestamo-response.dto.js';
import type { errorResponseDto } from '../contratos/prestamo.dto.js';
import { error } from 'console';

const PUERTO = 3000;

const repositorio = new InMemoryPrestamoRepository();
const servicio = new PrestamoService(repositorio);

const app = express();
app.use(express.json());

app.use(express.static('publico'));
app.use(express.static("dist/cliente"));

//get
app.get('/api/prestamos', async (req, res) => {
    const libroId = req.query.libroId as string | undefined;
    if(libroId === undefined || libroId.trim() === "") {
        const error: errorResponseDto = {
            error: "Solicitud invalida",
            mensaje: "Falta el parametro libroId en la query",
        };
        res.status(400).json(error);
        return;
    }
    const prestamos = await servicio.listarPorLibro(libroId);
    res.status(200).json(prestamos.map(aResponseDto));
});
//post
app.post('/api/prestamos', async (req, res) => {
    const dto = validarCrearPrestamoDto(req.body);
    const prestamo = await servicio.crear(dto);

    res.status(201).location(`/api/prestamos/${prestamo.folio}`).json(aResponseDto(prestamo));

});

//middleware de manejo de errores
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(err instanceof EjemplarPrestadoError) {
        const error: errorResponseDto = {
            error: "VALIDACION",
            mensaje: err.message,
        };
        res.status(400).json(error);
        return;
    }
    if(err instanceof EjemplarPrestadoError) {
        const error: errorResponseDto = {
            error: "EJEMPLAR_PRESTADO",
            mensaje: err.message,
        };
        //409 es un conflicto
        res.status(409).json(error);
        return;
    }
    console.error("error no controlado: ", err);
    res.status(500).json({
        error: "ERROR_INTERNO",
        mensaje: "Error interno del servidor",
    });
});
app.listen(PUERTO, () => {
    console.log("\n API -> http://localhost:3000/api/prestamos?libroId=LIB-0417");
    console.log(`Cliente -> http://localhost:${PUERTO}/\n`);
});
