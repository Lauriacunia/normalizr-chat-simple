import express, { json, urlencoded } from 'express';
import { normalize, schema, denormalize } from 'normalizr';
import { inspect } from 'util';
import { faker } from '@faker-js/faker/locale/es';
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));


function print(obj)
{
    console.log(inspect(obj, { depth: null }));
}


const mensajesMock = () => {
    const mensajes = [];
    for(let i = 0; i < 10; i++) {
        mensajes.push({
            id: faker.random.numeric(5),
            autor: {
                id: faker.random.numeric(5),
                nombre: faker.name.firstName(),
                apellido: faker.name.lastName(),
                email: faker.internet.email(),
                alias: faker.internet.userName(),
                avatar: faker.image.avatar()
            },
            texto: faker.lorem.sentence(),
            timestamp: faker.date.past().getTime()
        });
    }
    return mensajes;
}

//print(mensajesMock());   


const chatOriginal = {
      id: '3693',
      nombre: 'Canal de chat - Comisión 30950',
      mensajes: mensajesMock()
}


/** Definir schema autor */

const autorSchema = new schema.Entity('autores');

/** Definir schema mensaje */

const mensajeSchema = new schema.Entity('mensajes', {
  id: { type: String },
  autor: autorSchema,
  texto: '',
  timestamp: { type: Number }
});

const chatSchema = new schema.Entity('chats', {
  id: { type: String },
  nombre: '',
  mensajes: [mensajeSchema]
});

/** Normalizar  */
const chatNormalized = normalize(chatOriginal, chatSchema);

print(chatNormalized);


const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
