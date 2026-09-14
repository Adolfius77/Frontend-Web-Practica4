export class validacionError extends Error {
    constructor(public readonly detalles: String[]) {
        super("La peticion no cumple con el contrato");
        this.name = "validacionError";
    }
}