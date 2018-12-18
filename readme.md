PROYECTO BACK-END: NODEJS+EXPRESSJS+MONGODB

Autor: Sergio Martín Ramírez 
Fecha última actualización: 18-12-2018

El proyecto consiste en una sencilla API para una red social donde los usuarios 
pueden escribir publicaciones y comentarios a publicaciones existentes. El autor 
de una publicación la etiquetará con una palabra descriptiva para que otros 
usuarios puedan visualizarla en sus muros según los intereses a los que se haya 
suscrito. Las publicaciones y sus comentarios pueden ser valorardos con un "Me gusta".

Para que un usuario pueda utilizar la red social tendrá que haberse registrado 
previamente. Una vez autorizado, pordrá descargar su muro, donde estarán sus 
publicaciones y las publicaciones sobre temas de interés a los que se haya suscrito
al registarse. El usuario podrá suscribirse a nuevos temas de interés cuando desee.

El usuario podrá bloquear a otro usuario para evitar visualizar sus publicaciones 
y sus comentarios.

En el archivo SocialMedia.postman_collection.json se encuentra la colección de 
Postman con un ejemplo de todas las peticiones posibles que acepta el API. Sólo 
hay importar el archivo en Postman para poder probar el API.

En la carpeta dbbackup/dump hay una compia de la base de datos que se puede
restaurar con mongodbrestore --db socialmedia