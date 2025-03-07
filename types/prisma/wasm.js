
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  image: 'image',
  password: 'password'
};

exports.Prisma.SettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  language: 'language'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  type: 'type',
  image: 'image',
  email: 'email',
  about: 'about',
  userId: 'userId'
};

exports.Prisma.InterestScalarFieldEnum = {
  id: 'id',
  title: 'title',
  language: 'language',
  links: 'links',
  ask: 'ask',
  invites: 'invites',
  access: 'access'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  xCoordinate: 'xCoordinate',
  yCoordinate: 'yCoordinate',
  latitude: 'latitude',
  longitude: 'longitude',
  geom: 'geom',
  zoom: 'zoom',
  links: 'links',
  ask: 'ask',
  invites: 'invites',
  access: 'access'
};

exports.Prisma.RelationScalarFieldEnum = {
  id: 'id',
  key: 'key',
  type: 'type',
  data: 'data',
  interestId: 'interestId',
  locationId: 'locationId'
};

exports.Prisma.DiscussionScalarFieldEnum = {
  id: 'id',
  type: 'type',
  text: 'text',
  limit: 'limit',
  voters: 'voters',
  votes: 'votes',
  attachment: 'attachment',
  createdAt: 'createdAt',
  interestId: 'interestId',
  locationId: 'locationId'
};

exports.Prisma.InviteScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  profileId: 'profileId',
  interestId: 'interestId',
  locationId: 'locationId'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  text: 'text',
  href: 'href',
  status: 'status',
  type: 'type',
  date: 'date',
  profileId: 'profileId',
  locationId: 'locationId',
  interestId: 'interestId'
};

exports.Prisma.PluginSettingsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  path: 'path',
  key: 'key',
  pluginId: 'pluginId',
  profileId: 'profileId',
  active: 'active',
  settings: 'settings'
};

exports.Prisma.ProfileInterestScalarFieldEnum = {
  id: 'id',
  key: 'key',
  profileId: 'profileId',
  interestId: 'interestId',
  createdAt: 'createdAt'
};

exports.Prisma.ProfileLocationScalarFieldEnum = {
  id: 'id',
  key: 'key',
  profileId: 'profileId',
  locationId: 'locationId',
  createdAt: 'createdAt'
};

exports.Prisma.ProfileProfileScalarFieldEnum = {
  id: 'id',
  key: 'key',
  profileId: 'profileId',
  otherProfileId: 'otherProfileId',
  createdAt: 'createdAt'
};

exports.Prisma.InterestLocationScalarFieldEnum = {
  id: 'id',
  key: 'key',
  interestId: 'interestId',
  locationId: 'locationId',
  createdAt: 'createdAt'
};

exports.Prisma.InterestInterestScalarFieldEnum = {
  id: 'id',
  key: 'key',
  interestId: 'interestId',
  otherInterestId: 'otherInterestId',
  createdAt: 'createdAt'
};

exports.Prisma.LocationLocationScalarFieldEnum = {
  id: 'id',
  key: 'key',
  locationId: 'locationId',
  otherLocationId: 'otherLocationId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Status = exports.$Enums.Status = {
  IMPORTANT: 'IMPORTANT',
  ONGOING: 'ONGOING',
  LEARNING: 'LEARNING',
  TEACHING: 'TEACHING',
  INTERESTED: 'INTERESTED',
  FAVOURITE: 'FAVOURITE',
  CURRENTLY_AT: 'CURRENTLY_AT',
  GOING_NEXT: 'GOING_NEXT'
};

exports.Type = exports.$Enums.Type = {
  NORMAL: 'NORMAL',
  DISCUSSION: 'DISCUSSION',
  POLL: 'POLL',
  GOVERNANCE: 'GOVERNANCE',
  EVENT: 'EVENT'
};

exports.Prisma.ModelName = {
  User: 'User',
  Settings: 'Settings',
  Profile: 'Profile',
  Interest: 'Interest',
  Location: 'Location',
  Relation: 'Relation',
  Discussion: 'Discussion',
  Invite: 'Invite',
  Activity: 'Activity',
  PluginSettings: 'PluginSettings',
  ProfileInterest: 'ProfileInterest',
  ProfileLocation: 'ProfileLocation',
  ProfileProfile: 'ProfileProfile',
  InterestLocation: 'InterestLocation',
  InterestInterest: 'InterestInterest',
  LocationLocation: 'LocationLocation'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
