Author: Sergio Martín Ramírez
Date last update: 18-12-2018

The project consists of a simple API for a social network where users
can write publications and comments to existing publications. The author
of a publication can tag it with descriptive words so that others
users can visualize it in their walls according to the interests that have been
subscribed. The publications and their comments can be evaluated with a "Like".

In order for a user to use the social network, they must have registered
previously. Once authorized, he will be able to download his wall, where he wil 
get his publications and publications on topics of interest to which he has 
subscribed when registering. The user can subscribe to new topics of interest 
when he wishes.

The user can block other user's to avoid viewing their publications and comments.

In the SocialMedia.postman_collection.json file you will find a Postman 
collection with examples of all possible requests accepted by the API. You only
have to import the file in Postman to be able to test the API.

In the dbbackup / dump folder there is a copy of the database that can be
restore with mongodbrestore --db socialmedia

-------------

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

En la carpeta dbbackup/dump hay una copia de la base de datos que se puede
restaurar con mongodbrestore --db socialmedia
