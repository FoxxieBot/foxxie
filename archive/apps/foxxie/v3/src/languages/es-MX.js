/**
 * Co-authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 * Co-authored by Raindrop <Waindrop | ᓚᘏᗢ#7799>
 */
 const { util, Language } = require('@foxxie/tails');
 const { italic, underline, bold, code } = require('@foxxie/md-tags');
 const { emojis: { infinity, perms: { notSpecified, granted }, covid: { cases, tests, deaths, recoveries }, weather: { temperature, date, humidity, winds, feels, timezone, dayCurrent } }, credits: { developer, spanishTranslation, additionalHelp } } = require('~/lib/util/constants');

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.language = {
            
        }
    }
}
// const { credits: { developer, spanishTranslation, additionalHelp }, emojis: { infinity } } = require('../../lib/util/constants')
// const { topggURL, supportServer, inviteURL, commands, aliases, version } = require('../../config/foxxie')
// module.exports = {
//     name: 'es',
//     COMMAND_ABOUT_COMMANDS: "**Commandos**",
//     COMMAND_ABOUT_COMMANDS_NOW: `**•** Ahorita tengo **${commands}** commandos y **${aliases}** alias.`,
//     COMMAND_ABOUT_CREATED: "**Creado**",
//     COMMAND_ABOUT_CREDITS: "**Créditos**",
//     COMMAND_ABOUT_CREDITS_LIST: `**•** Desarrollador: ${developer}
// **•** Traducciones de Español: ${spanishTranslation}
// **•** Ayuda adicional: ${additionalHelp}`,
//     COMMAND_ABOUT_CURRENTVER: `**•** Por el momento estoy en la versión **${version}**, casi siempre estoy siendo revisado ;)`,
//     COMMAND_ABOUT_GUILDS: "**Gremios**",
//     COMMAND_ABOUT_GUILDS_SIZE: `**•** Estoy cuidando **1** servidores.`,
//     COMMAND_ABOUT_LINKS: "**Enlaces e información adicionales**",
//     COMMAND_ABOUT_LINKS_LINKS: `[[Invitar Foxxie](${inviteURL}})] | [[Servidor Soporte](${supportServer})] | [[The Corner Store](${topggURL})] | [[Patreon](https://www.patreon.com/Thecornerstore)]`,
//     COMMAND_ABOUT_SUMMARY: "Empecé como un proyecto de desarrollo de **Ruffpuff#0017** como forma de aprender node.js y JavaScript. Luego fui agregado a este servidor **The Corner Store** para reducir los números de bots. Ahora espero ser agregado a muchos gremios y tal vez ser de alguna ayuda para ustedes.",
//     COMMAND_ABOUT_TITLE: "¡Sobre Foxxie!",
//     COMMAND_ABOUT_USERS: "**Usuarios**",
//     COMMAND_ABOUT_USERS_SIZE: `**•** Al momento estoy limpiando después de **1** usuarios.`,
//     COMMAND_ABOUT_VERSION: "Versión",
//     COMMAND_ABOUT_WASCREATED: `**•** Fui creado el lunes 15 de febrero de 2021. **(Hace ${moment([moment('2021-02-15').format('YYYY'), moment('2021-02-15').format('M') - 1, moment('2021-02-15').format('D')]).toNow(true)}.)**`,
//     COMMAND_AFK_HAS_SET: `ha establecido un afk`,
//     COMMAND_AFK_ISSET: "esta establecido como afk",
//     COMMAND_AFK_REASON: '**Razón:**',
//     COMMAND_AFK_WELCOMEBACK: "Hola, bienvenido de nuevo, déjame quitarte ese afk por ti.",
//     COMMAND_AVATAR_FOXXIEAV: "**Aqui esta mi avatar, el que tengo ahorita es temporal.**",
//     COMMAND_COLOR_NOCOLOR: "**Oye,** Tienes que decirme cual color quieres que te muestre. Puedo usar hex, rgb,hsv,hsl…",
//     COMMAND_COLOR_PREVIEW: "Vista previa de color",
//     COMMAND_CORONA_ABSOLUTEINFECTION: "tasa de infección absoluta",
//     COMMAND_CORONA_ABSOLUTEFATAL: "tasa de fatalidad absoluta",
//     COMMAND_CORONA_CASES: "**Casos**",
//     COMMAND_CORONA_CASEFATAL: "tasa de fatalidad de casos",
//     COMMAND_CORONA_CASERECOVERY: "Tasa de recuperación de casos",
//     COMMAND_CORONA_CRITICAL: "crítico",
//     COMMAND_CORONA_DEATHS: "**Fallecidos**",
//     COMMAND_CORONA_FOOTER: "Tengo que decirte que estas estadísticas no tienen toda la información exacta.\nNo vayan a tratar de usar esto como consejo médico.",
//     COMMAND_CORONA_NOARGS: "**Oye,** tienes que decirme el país para el que quieres estadísticas o ‘global’ para todo el mundo.",
//     COMMAND_CORONA_NOSTATS: "**Oye,** eso eso es un pais invalido o no tiene estadísticas",
//     COMMAND_CORONA_POPTESTED: "de la población probada",
//     COMMAND_CORONA_RECOVERIES: "**Recuperaciones**",
//     COMMAND_CORONA_STATS: "Estadísticas de COVID-19",
//     COMMAND_CORONA_TEST: "**Pruebas**",
//     COMMAND_CORONA_TODAY: "hoy",
//     COMMAND_DEFINE_NO_DATA: "Yo **no pude** encontrar ninguna información para eso, lo siento.",
//     COMMAND_DEFINE_NO_WORD: "**Bueno,** como quieres que defina una palabra si no me la entregas.",
//     COMMAND_EVAL_OUTPUT: "**Producción**:",
//     COMMAND_EVAL_OVER: "Caracteres de más de 2000!",
//     COMMAND_EVAL_TOKEN: "Token Detectado",
//     COMMAND_EVAL_TYPE: "**Tipo**:",
//     COMMAND_EVAL_UNDEFINED: "Indefinido",
//     COMMAND_HELP_DESCRIPTION: `Aquí hay una lista de todos mis comandos.
// Para obtener más información sobre cada comando, utilice \`fox help [comando]\`.
// Si necesitas mi ayuda puedes unirte a mi [servidor.](${supportServer})`,
//     COMMAND_HELP_DMERROR: `**Ay no,** intente enviando un mensaje pero no pude, por favor asegurate que tus mensajes están abiertos para todos de esta manera podemos continuar.`,
//     COMMAND_HELP_FALSE: "falso",
//     COMMAND_HELP_FUN: "**Divertido**",
//     COMMAND_HELP_MODERATION: "**Moderación**",
//     COMMAND_HELP_NOTVALID: "Eso no es un comando válido!",
//     COMMAND_HELP_ROLEPLAY: "**Actuar**",
//     COMMAND_HELP_SETTINGS: "**Ajustes**",
//     COMMAND_HELP_TITLE: "Comandos de Foxxie!",
//     COMMAND_HELP_TRUE: "cierto",
//     COMMAND_HELP_USAGE: "• Uso (solo servidor:",
//     COMMAND_HELP_UTILITY: "**Utilidad**",
//     COMMAND_INVITE_HERE: "Oye oye, aqui esta el enlace para que puedas invitar.",
//     COMMAND_INVITE_BODY: `[Haz click aquí!](${version})
// Espero poder arreglar las cosas por ti.`,
//     COMMAND_LANGUAGE_ENGLISH: "**Entendido,** cambiaré el lenguaje de este servidor a \`Inglés/En\`.",
//     COMMAND_LANGUAGE_NOARGS: "**Uhhh,** Yo no puedo cambiar el lenguaje si no me dices a qué lo quieres cambiar. Intenta de nuevo con \`fox language [lenguaje]\`.",
//     COMMAND_LANGUAGE_NOTVALIDLANG: `**Uhhhh,** ese lenguaje no parece estar en mi lista de lenguajes soportados. Deberías intentar uno de los siguientes:
// \`Inglés/En\`
// \`Español/Es\`
// \`None\``,
//     COMMAND_LANGUAGE_RESET: "**Entendido,** cambiaré el lenguaje de este servidor a mi Configuración predeterminada \`Inglés/En\`.",
//     COMMAND_LANGUAGE_SPANISH: "**Entendido,** cambiaré el lenguaje de este servidor a \`Español/Es\`.",
//     COMMAND_MESSAGE_LOADING: `${infinity} **Tomando su orden,** esto va tomar unos segundos.`,
//     COMMAND_NSFW_ERROR: "**Heh,** debido al riesgo natural de ese comando solo se puedo usar en canals marcados como NSFW ;)",
//     COMMAND_PING: "¿Ping?",
//     COMMAND_PING_DISCORD: "Latencia de Discordia",
//     COMMAND_PING_FOOTER: "Ping puede ser alto a causa de Discordia fallando, no es mi problema.",
//     COMMAND_PING_NETWORK: "Latencia de Red",
//     COMMAND_REMINDME_AGOFOR: "atrás para:",
//     COMMAND_REMINDME_CONFIRMED: "**Está bien,** Te enviaré tu recordatorio en",
//     COMMAND_REMINDME_FOR: "Recordatorio para",
//     COMMAND_REMINDER_HERE: "Hola, aquí está ese recordatorio que has programado",
//     COMMAND_REMINDME_NOREASON: "Necesitas darnos una razón para tu recordatorio, intenta Orta ves.",
//     COMMAND_REMINDME_NOTIME: "Necesitas ser específico cuando estableces a que hora quieres tu mensajes, por ejemplo: [1s/1m/1h/1d] gracias.",
//     COMMAND_ROLE_ALLPERMS: "Administrador (todos los permisos)",
//     COMMAND_ROLE_BOTS: "bot",
//     COMMAND_ROLE_COLOR: "**Color**",
//     COMMAND_ROLE_CONFIGURABLE: "configurable",
//     COMMAND_ROLE_CREATED: "**Creado**",
//     COMMAND_ROLE_CREATED_AGO: "ago",
//     COMMAND_ROLE_INTEGRATION: "gestionado por integración",
//     COMMAND_ROLE_MEMBERS: "**Miembros**",
//     COMMAND_ROLE_MENTIONABLE: "mencionable como",
//     COMMAND_ROLE_NOCOLOR: "ninguno",
//     COMMAND_ROLE_NOT_MENTIONABLE: "no mencionable",
//     COMMAND_ROLE_NOTSEPERATE: "no se muestra separado",
//     COMMAND_ROLE_PERMISSIONS: "**Permisos**",
//     COMMAND_ROLE_PLURAL: "s",
//     COMMAND_ROLE_PROPERTIES: "**Properties**",
//     COMMAND_ROLE_SEPERATE: "se muestra separado",
//     COMMAND_ROLE_USER: "usario",
//     COMMAND_SERVERLIST: "Servidores usando Foxxie",
//     COMMAND_SERVERLIST_MEMBERCOUNT: "miembros",
//     COMMAND_SERVERLIST_TOTALSERVERS: "servidores en total",
//     COMMAND_SERVERLIST_PAGE: "Página",
//     COMMAND_SUPPORT_HERE: "Oye oye, aquí esta el enlace para mi servidor de soporte.",
//     COMMAND_SUPPORT_BODY: `[Haz click aquí!](${supportServer})
// Espero que te podemos ayudar un poquito.`,
//     TESTING: "Prueba de",
//     COMMAND_UPTIME: `Hola! Foxxie **v${version}** por última vez desde`,
//     COMMAND_UPTIME_DAYS: 'días,',
//     COMMAND_UPTIME_HOURS: 'horas,',
//     COMMAND_UPTIME_MINUTES: 'minutos, y',
//     COMMAND_UPTIME_SECONDS: 'hace segundos.',
//     COMMAND_URBAN_NO_DATA: "**Ay no,** no pude encontrar datos para esa palabra.",
//     COMMAND_URBAN_NO_WORD: "**Y,** tu como quieres que defina una palabra si no proporcionas una?",

//     COMMAND_DESCRIPTIONS : {

//         EVAL: "Le permite evaluar el código JavaScript directamente desde Discordia.",
//         SERVERLIST: "Proporciona lista de todos los servidores en los que estoy.",

//         CAT: "Agarro una imagen aleatorio de un gato usando api.thecatapi.com.",
//         DOG: "Muestra una imagen aleatorio de un perro del sitio web dog.co/api.",
//         FOX: "Muestra una imagen aleatorio de un zorro del sitio web randomfox.ca/floof.",
//         POKEMON: "Muestra estadísticas y una imagen de un pokemon dado.",
//         URBAN: "Define una palabra usando su definición usando Urban Dictionary. Solo funciona en canales marcados como NSFW debido a la posibilidad de que tenga contenido inapropiado.",

//         CLEARNOTE: "Borra todas las notas públicas de un perfil de usuario.",
//         NOTE: "Anidé una nota solo para el servidor a el perfil de usuario.",

//         BLUSH: "Sonrojarse con alguien.",
//         BONK: "Golpear a alguien en la cabeza.",
//         BOOP: "Boop a alguien en la nariz.",
//         CRY: "Llorar a alguien.",
//         CUDDLE: "Acurrucarse con tus amigos.",
//         DAB: "Dab en los que odian.",
//         FACEPALM: "Facepalm... se explica solo.",
//         HUG: "Abraza tus amigos.",
//         PAT: "Da palmaditas en la cabeza.",

//         DISBOARDCHANNEL: "Si usas el bot de discord puedes instalar un canal dónde puedes promover tu servidor cada 2 horas. Alternativamente puedes desactivar estos recordatorios usando `fox disboardchannel none`.",
//         DISBOARDMESSAGE: "Cambia el texto yo te mandaré cuando disboard se actualice. Ponga `none` si quiere reiniciar mi configuración por defecto, o nomás puede usar `fox disboardmessage` para enseñar el mensaje actual si está establecido.",
//         LANGUAGE: "Establece el idioma del gremio. Elige Ingles, Espanol, o ninguno para restablecer la configuración por defecto.",
//         TESTJOIN: "Simula lo que pueda pasar si una nueva persona se une al servidor.",
//         WELCOMECHANNEL: "Establece el canal donde pueda mandar un mensaje de bienvenida. Esto iniciará cuando un nuevo miembro se una o puede usar `fox testwelcome` para probar de antemano.",

//         ABOUT: "Obtiene información básica sobre mí, mis estadísticas, y mis créditos.",
//         AFK: "Establece un afk para cuando la gente te haga ping. Puedes dar una razón si quieres pero si no das razón se mostrará como ninguno. Cuando se hace Ping en la sala de chat mostrara tu estado de afk, la próxima ves que hables esto se borrará.",
//         AVATAR: "Obtenga una imagen de alta resolución para el perfil de un usuario. En formatos PNG, JPEG y WEBP.",
//         BUGREPORT: "Send a bugreport straight to the developer in case something goes wrong.", //translate
//         CORONA: "Obtiene las estadísticas actuales de la pandemia. Puedes ingresar el nombre de un país, o para las estadísticas del mundo entero.",
//         DEFINE: "Define un termino usando Merriam-Webster Dictionary API.",
//         HELP: "Mostrar ayuda para un comando cuando se especifica un comando o sin ningún comando proporcionará una lista de todos los comandos.",
//         INFO: "Proporciona información de usuarios, servidores, canals, o roles dependiendo en lo que especificas.",
//         INVITE: "Te doy mi enlace para que me ayudes en mi servidor.",
//         PING: "Ejecuta una prueba de conexión a la Discordia.",
//         REMINDME: "Envía un recordatorio a tus mensajes.",
//         ROLE: "Obtiene información sobre cualquier rol en el servidor, incluyendo permisos, colores, y miembros.",
//         SAY: "Permite que los moderadores me usen como una marioneta ;)",
//         SUPPORT: "Te doy un el enlace para mi servidor de soporte, le puedes preguntar a mi desarrollador preguntas o sugerencias sobre mis nuevos características.",
//         UPTIME: "Enseña cuanto tiempo ha pasado desde la ultima reiniciar y cuantos Gremios y usuarios hay.",
//         WEATHER: "Proporciona el clima para una ciudad. Apoya cualquier ciudad en el mundo y puede mostrar clima,zona horaria, humedad, y más."

//     },

//     MESSAGE_ERROR_CODE_ERROR: "**Uh oh,** there seems to be some sort of problem with my source code. Now don't worry I'm not dying on ya but I'd appreciate it if you did \`fox bugreport [bug]\` to send a message to my developer about it.", // needs spanish

//     PERMISSIONS : {
//         ADMINISTRATOR: 'Administrador',
//         VIEW_AUDIT_LOG: 'Ver el registro de auditoría',
//         MANAGE_GUILD: 'Gestionar servidor',
//         MANAGE_ROLES: 'Gestionar Roles',
//         MANAGE_CHANNELS: 'Gestionar Canales',
//         KICK_MEMBERS: 'Expulsar Miembros',
//         BAN_MEMBERS: 'Banear Miembros',
//         CREATE_INSTANT_INVITE: 'Crear invitación',
//         CHANGE_NICKNAME: 'Cambiar apodo',
//         MANAGE_NICKNAMES: 'Gestionar apodos',
//         MANAGE_EMOJIS: 'Gestionar emojis',
//         MANAGE_WEBHOOKS: 'Gestionar Webhooks',
//         VIEW_CHANNEL: 'Ver canalas',
//         SEND_MESSAGES: 'Enviar Mensajes',
//         SEND_TTS_MESSAGES: 'Enviar mensajes de TAV',
//         MANAGE_MESSAGES: 'Gestionar Mensajes',
//         EMBED_LINKS: 'Insertar enlaces',
//         ATTACH_FILES: 'Adjuntar Archivos',
//         READ_MESSAGE_HISTORY: 'Leer el historial de mensajes',
//         MENTION_EVERYONE: 'Mencionar Everyone',
//         USE_EXTERNAL_EMOJIS: 'Usar Emojis Externos',
//         ADD_REACTIONS: 'Añadir reacciones',
//         CONNECT: 'Conectar',
//         SPEAK: 'Hablar',
//         MUTE_MEMBERS: 'Silenciar miembros',
//         DEAFEN_MEMBERS: 'Ensordecer miembros',
//         MOVE_MEMBERS: 'Mover Miembros',
//         USE_VAD: 'Usar Actividad de Voz',
//         STREAM: 'Lanzarse'
//     }
// }
