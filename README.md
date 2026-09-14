Preguntas de reflexión:
1. Express manda los rechazos de un handler async directo al middleware de errores, sin try/catch en cada ruta. ¿Qué tendrían que agregar en cada ruta si esto no fuera así?
   pues tendria que meter cada metodo async a un try catch y dentro del catch llamar el metodo de next(error) para asi rechazar la promesa 
2. ¿Por qué el servicio no lanza directamente un 409 en vez de EjemplarPrestadoError?
   por la separación de responsabilidades la capa de servicio no debe de conocer que es un codigo htpp como 409 por que en esa capa solo conoce las reglas del negocio como validaciones etc, y la capa que debe saber sobre las respuestas htpp es la capa htpp válgame la redundancia
   esa capa es la que conoce todos eso códigos htpp si el servicio devolviera un 409 estaríamos acoplando la lógica de dominio con htpp, al separar estas dos capas mantendremos el código limpio y desacoplado 
   
4. Si mañana agregaran una app móvil que también consume esta API, ¿qué archivos de esta práctica tendrían que tocar?
   ninguno por que como trabajamos con contratos como los dto, que gracias a ellos separamos los datos de la interfaz usuario la app movil simplemente seria otro cliente mas al igual como el front que tenemos actualmente en el proyecto y este consumira los mismos endpoints y logica de negocio
