
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model Citation
 * 
 */
export type Citation = $Result.DefaultSelection<Prisma.$CitationPayload>
/**
 * Model Resource
 * 
 */
export type Resource = $Result.DefaultSelection<Prisma.$ResourcePayload>
/**
 * Model Cryptocurrency
 * 
 */
export type Cryptocurrency = $Result.DefaultSelection<Prisma.$CryptocurrencyPayload>
/**
 * Model CopilotActivity
 * 
 */
export type CopilotActivity = $Result.DefaultSelection<Prisma.$CopilotActivityPayload>
/**
 * Model AutomationTask
 * 
 */
export type AutomationTask = $Result.DefaultSelection<Prisma.$AutomationTaskPayload>
/**
 * Model CopilotReport
 * 
 */
export type CopilotReport = $Result.DefaultSelection<Prisma.$CopilotReportPayload>
/**
 * Model CommunityStory
 * 
 */
export type CommunityStory = $Result.DefaultSelection<Prisma.$CommunityStoryPayload>
/**
 * Model SocialProject
 * 
 */
export type SocialProject = $Result.DefaultSelection<Prisma.$SocialProjectPayload>
/**
 * Model ProjectMap
 * 
 */
export type ProjectMap = $Result.DefaultSelection<Prisma.$ProjectMapPayload>
/**
 * Model UserProgress
 * 
 */
export type UserProgress = $Result.DefaultSelection<Prisma.$UserProgressPayload>
/**
 * Model ArticleFactCheck
 * 
 */
export type ArticleFactCheck = $Result.DefaultSelection<Prisma.$ArticleFactCheckPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Sentiment: {
  positive: 'positive',
  neutral: 'neutral',
  negative: 'negative'
};

export type Sentiment = (typeof Sentiment)[keyof typeof Sentiment]


export const WarningLevel: {
  info: 'info',
  warning: 'warning',
  critical: 'critical'
};

export type WarningLevel = (typeof WarningLevel)[keyof typeof WarningLevel]


export const StoryCategory: {
  transformation: 'transformation',
  social_project: 'social_project',
  achievement: 'achievement'
};

export type StoryCategory = (typeof StoryCategory)[keyof typeof StoryCategory]


export const ProjectCategory: {
  donations: 'donations',
  microcredit: 'microcredit',
  education: 'education',
  infrastructure: 'infrastructure'
};

export type ProjectCategory = (typeof ProjectCategory)[keyof typeof ProjectCategory]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Sentiment = $Enums.Sentiment

export const Sentiment: typeof $Enums.Sentiment

export type WarningLevel = $Enums.WarningLevel

export const WarningLevel: typeof $Enums.WarningLevel

export type StoryCategory = $Enums.StoryCategory

export const StoryCategory: typeof $Enums.StoryCategory

export type ProjectCategory = $Enums.ProjectCategory

export const ProjectCategory: typeof $Enums.ProjectCategory

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.citation`: Exposes CRUD operations for the **Citation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Citations
    * const citations = await prisma.citation.findMany()
    * ```
    */
  get citation(): Prisma.CitationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resource`: Exposes CRUD operations for the **Resource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resources
    * const resources = await prisma.resource.findMany()
    * ```
    */
  get resource(): Prisma.ResourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cryptocurrency`: Exposes CRUD operations for the **Cryptocurrency** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cryptocurrencies
    * const cryptocurrencies = await prisma.cryptocurrency.findMany()
    * ```
    */
  get cryptocurrency(): Prisma.CryptocurrencyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.copilotActivity`: Exposes CRUD operations for the **CopilotActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CopilotActivities
    * const copilotActivities = await prisma.copilotActivity.findMany()
    * ```
    */
  get copilotActivity(): Prisma.CopilotActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.automationTask`: Exposes CRUD operations for the **AutomationTask** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AutomationTasks
    * const automationTasks = await prisma.automationTask.findMany()
    * ```
    */
  get automationTask(): Prisma.AutomationTaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.copilotReport`: Exposes CRUD operations for the **CopilotReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CopilotReports
    * const copilotReports = await prisma.copilotReport.findMany()
    * ```
    */
  get copilotReport(): Prisma.CopilotReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.communityStory`: Exposes CRUD operations for the **CommunityStory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityStories
    * const communityStories = await prisma.communityStory.findMany()
    * ```
    */
  get communityStory(): Prisma.CommunityStoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.socialProject`: Exposes CRUD operations for the **SocialProject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SocialProjects
    * const socialProjects = await prisma.socialProject.findMany()
    * ```
    */
  get socialProject(): Prisma.SocialProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectMap`: Exposes CRUD operations for the **ProjectMap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectMaps
    * const projectMaps = await prisma.projectMap.findMany()
    * ```
    */
  get projectMap(): Prisma.ProjectMapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProgress`: Exposes CRUD operations for the **UserProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProgresses
    * const userProgresses = await prisma.userProgress.findMany()
    * ```
    */
  get userProgress(): Prisma.UserProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleFactCheck`: Exposes CRUD operations for the **ArticleFactCheck** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleFactChecks
    * const articleFactChecks = await prisma.articleFactCheck.findMany()
    * ```
    */
  get articleFactCheck(): Prisma.ArticleFactCheckDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Article: 'Article',
    Citation: 'Citation',
    Resource: 'Resource',
    Cryptocurrency: 'Cryptocurrency',
    CopilotActivity: 'CopilotActivity',
    AutomationTask: 'AutomationTask',
    CopilotReport: 'CopilotReport',
    CommunityStory: 'CommunityStory',
    SocialProject: 'SocialProject',
    ProjectMap: 'ProjectMap',
    UserProgress: 'UserProgress',
    ArticleFactCheck: 'ArticleFactCheck'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "article" | "citation" | "resource" | "cryptocurrency" | "copilotActivity" | "automationTask" | "copilotReport" | "communityStory" | "socialProject" | "projectMap" | "userProgress" | "articleFactCheck"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      Citation: {
        payload: Prisma.$CitationPayload<ExtArgs>
        fields: Prisma.CitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          findFirst: {
            args: Prisma.CitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          findMany: {
            args: Prisma.CitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>[]
          }
          create: {
            args: Prisma.CitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          createMany: {
            args: Prisma.CitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CitationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>[]
          }
          delete: {
            args: Prisma.CitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          update: {
            args: Prisma.CitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          deleteMany: {
            args: Prisma.CitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CitationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>[]
          }
          upsert: {
            args: Prisma.CitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitationPayload>
          }
          aggregate: {
            args: Prisma.CitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCitation>
          }
          groupBy: {
            args: Prisma.CitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CitationCountArgs<ExtArgs>
            result: $Utils.Optional<CitationCountAggregateOutputType> | number
          }
        }
      }
      Resource: {
        payload: Prisma.$ResourcePayload<ExtArgs>
        fields: Prisma.ResourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          findFirst: {
            args: Prisma.ResourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          findMany: {
            args: Prisma.ResourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>[]
          }
          create: {
            args: Prisma.ResourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          createMany: {
            args: Prisma.ResourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>[]
          }
          delete: {
            args: Prisma.ResourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          update: {
            args: Prisma.ResourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          deleteMany: {
            args: Prisma.ResourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>[]
          }
          upsert: {
            args: Prisma.ResourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcePayload>
          }
          aggregate: {
            args: Prisma.ResourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResource>
          }
          groupBy: {
            args: Prisma.ResourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResourceCountArgs<ExtArgs>
            result: $Utils.Optional<ResourceCountAggregateOutputType> | number
          }
        }
      }
      Cryptocurrency: {
        payload: Prisma.$CryptocurrencyPayload<ExtArgs>
        fields: Prisma.CryptocurrencyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CryptocurrencyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CryptocurrencyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          findFirst: {
            args: Prisma.CryptocurrencyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CryptocurrencyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          findMany: {
            args: Prisma.CryptocurrencyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>[]
          }
          create: {
            args: Prisma.CryptocurrencyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          createMany: {
            args: Prisma.CryptocurrencyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CryptocurrencyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>[]
          }
          delete: {
            args: Prisma.CryptocurrencyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          update: {
            args: Prisma.CryptocurrencyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          deleteMany: {
            args: Prisma.CryptocurrencyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CryptocurrencyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CryptocurrencyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>[]
          }
          upsert: {
            args: Prisma.CryptocurrencyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CryptocurrencyPayload>
          }
          aggregate: {
            args: Prisma.CryptocurrencyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCryptocurrency>
          }
          groupBy: {
            args: Prisma.CryptocurrencyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CryptocurrencyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CryptocurrencyCountArgs<ExtArgs>
            result: $Utils.Optional<CryptocurrencyCountAggregateOutputType> | number
          }
        }
      }
      CopilotActivity: {
        payload: Prisma.$CopilotActivityPayload<ExtArgs>
        fields: Prisma.CopilotActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CopilotActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CopilotActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          findFirst: {
            args: Prisma.CopilotActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CopilotActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          findMany: {
            args: Prisma.CopilotActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>[]
          }
          create: {
            args: Prisma.CopilotActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          createMany: {
            args: Prisma.CopilotActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CopilotActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>[]
          }
          delete: {
            args: Prisma.CopilotActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          update: {
            args: Prisma.CopilotActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          deleteMany: {
            args: Prisma.CopilotActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CopilotActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CopilotActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>[]
          }
          upsert: {
            args: Prisma.CopilotActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotActivityPayload>
          }
          aggregate: {
            args: Prisma.CopilotActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCopilotActivity>
          }
          groupBy: {
            args: Prisma.CopilotActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CopilotActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CopilotActivityCountArgs<ExtArgs>
            result: $Utils.Optional<CopilotActivityCountAggregateOutputType> | number
          }
        }
      }
      AutomationTask: {
        payload: Prisma.$AutomationTaskPayload<ExtArgs>
        fields: Prisma.AutomationTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AutomationTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AutomationTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          findFirst: {
            args: Prisma.AutomationTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AutomationTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          findMany: {
            args: Prisma.AutomationTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>[]
          }
          create: {
            args: Prisma.AutomationTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          createMany: {
            args: Prisma.AutomationTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AutomationTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>[]
          }
          delete: {
            args: Prisma.AutomationTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          update: {
            args: Prisma.AutomationTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          deleteMany: {
            args: Prisma.AutomationTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AutomationTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AutomationTaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>[]
          }
          upsert: {
            args: Prisma.AutomationTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutomationTaskPayload>
          }
          aggregate: {
            args: Prisma.AutomationTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAutomationTask>
          }
          groupBy: {
            args: Prisma.AutomationTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<AutomationTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.AutomationTaskCountArgs<ExtArgs>
            result: $Utils.Optional<AutomationTaskCountAggregateOutputType> | number
          }
        }
      }
      CopilotReport: {
        payload: Prisma.$CopilotReportPayload<ExtArgs>
        fields: Prisma.CopilotReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CopilotReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CopilotReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          findFirst: {
            args: Prisma.CopilotReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CopilotReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          findMany: {
            args: Prisma.CopilotReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>[]
          }
          create: {
            args: Prisma.CopilotReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          createMany: {
            args: Prisma.CopilotReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CopilotReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>[]
          }
          delete: {
            args: Prisma.CopilotReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          update: {
            args: Prisma.CopilotReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          deleteMany: {
            args: Prisma.CopilotReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CopilotReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CopilotReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>[]
          }
          upsert: {
            args: Prisma.CopilotReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CopilotReportPayload>
          }
          aggregate: {
            args: Prisma.CopilotReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCopilotReport>
          }
          groupBy: {
            args: Prisma.CopilotReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<CopilotReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.CopilotReportCountArgs<ExtArgs>
            result: $Utils.Optional<CopilotReportCountAggregateOutputType> | number
          }
        }
      }
      CommunityStory: {
        payload: Prisma.$CommunityStoryPayload<ExtArgs>
        fields: Prisma.CommunityStoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityStoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityStoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          findFirst: {
            args: Prisma.CommunityStoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityStoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          findMany: {
            args: Prisma.CommunityStoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>[]
          }
          create: {
            args: Prisma.CommunityStoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          createMany: {
            args: Prisma.CommunityStoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityStoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>[]
          }
          delete: {
            args: Prisma.CommunityStoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          update: {
            args: Prisma.CommunityStoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          deleteMany: {
            args: Prisma.CommunityStoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityStoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommunityStoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>[]
          }
          upsert: {
            args: Prisma.CommunityStoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityStoryPayload>
          }
          aggregate: {
            args: Prisma.CommunityStoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityStory>
          }
          groupBy: {
            args: Prisma.CommunityStoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityStoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityStoryCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityStoryCountAggregateOutputType> | number
          }
        }
      }
      SocialProject: {
        payload: Prisma.$SocialProjectPayload<ExtArgs>
        fields: Prisma.SocialProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SocialProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SocialProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          findFirst: {
            args: Prisma.SocialProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SocialProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          findMany: {
            args: Prisma.SocialProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>[]
          }
          create: {
            args: Prisma.SocialProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          createMany: {
            args: Prisma.SocialProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SocialProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>[]
          }
          delete: {
            args: Prisma.SocialProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          update: {
            args: Prisma.SocialProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          deleteMany: {
            args: Prisma.SocialProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SocialProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SocialProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>[]
          }
          upsert: {
            args: Prisma.SocialProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialProjectPayload>
          }
          aggregate: {
            args: Prisma.SocialProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSocialProject>
          }
          groupBy: {
            args: Prisma.SocialProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<SocialProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.SocialProjectCountArgs<ExtArgs>
            result: $Utils.Optional<SocialProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectMap: {
        payload: Prisma.$ProjectMapPayload<ExtArgs>
        fields: Prisma.ProjectMapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectMapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectMapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          findFirst: {
            args: Prisma.ProjectMapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectMapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          findMany: {
            args: Prisma.ProjectMapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>[]
          }
          create: {
            args: Prisma.ProjectMapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          createMany: {
            args: Prisma.ProjectMapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectMapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>[]
          }
          delete: {
            args: Prisma.ProjectMapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          update: {
            args: Prisma.ProjectMapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          deleteMany: {
            args: Prisma.ProjectMapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectMapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectMapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>[]
          }
          upsert: {
            args: Prisma.ProjectMapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMapPayload>
          }
          aggregate: {
            args: Prisma.ProjectMapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectMap>
          }
          groupBy: {
            args: Prisma.ProjectMapGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectMapGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectMapCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectMapCountAggregateOutputType> | number
          }
        }
      }
      UserProgress: {
        payload: Prisma.$UserProgressPayload<ExtArgs>
        fields: Prisma.UserProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          findFirst: {
            args: Prisma.UserProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          findMany: {
            args: Prisma.UserProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          create: {
            args: Prisma.UserProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          createMany: {
            args: Prisma.UserProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          delete: {
            args: Prisma.UserProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          update: {
            args: Prisma.UserProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          aggregate: {
            args: Prisma.UserProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProgress>
          }
          groupBy: {
            args: Prisma.UserProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserProgressCountAggregateOutputType> | number
          }
        }
      }
      ArticleFactCheck: {
        payload: Prisma.$ArticleFactCheckPayload<ExtArgs>
        fields: Prisma.ArticleFactCheckFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFactCheckFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFactCheckFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          findFirst: {
            args: Prisma.ArticleFactCheckFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFactCheckFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          findMany: {
            args: Prisma.ArticleFactCheckFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>[]
          }
          create: {
            args: Prisma.ArticleFactCheckCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          createMany: {
            args: Prisma.ArticleFactCheckCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleFactCheckCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>[]
          }
          delete: {
            args: Prisma.ArticleFactCheckDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          update: {
            args: Prisma.ArticleFactCheckUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          deleteMany: {
            args: Prisma.ArticleFactCheckDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleFactCheckUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleFactCheckUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>[]
          }
          upsert: {
            args: Prisma.ArticleFactCheckUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleFactCheckPayload>
          }
          aggregate: {
            args: Prisma.ArticleFactCheckAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleFactCheck>
          }
          groupBy: {
            args: Prisma.ArticleFactCheckGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleFactCheckGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleFactCheckCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleFactCheckCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    article?: ArticleOmit
    citation?: CitationOmit
    resource?: ResourceOmit
    cryptocurrency?: CryptocurrencyOmit
    copilotActivity?: CopilotActivityOmit
    automationTask?: AutomationTaskOmit
    copilotReport?: CopilotReportOmit
    communityStory?: CommunityStoryOmit
    socialProject?: SocialProjectOmit
    projectMap?: ProjectMapOmit
    userProgress?: UserProgressOmit
    articleFactCheck?: ArticleFactCheckOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    articles: number
    copilotActivities: number
    communityStories: number
    userProgress: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | UserCountOutputTypeCountArticlesArgs
    copilotActivities?: boolean | UserCountOutputTypeCountCopilotActivitiesArgs
    communityStories?: boolean | UserCountOutputTypeCountCommunityStoriesArgs
    userProgress?: boolean | UserCountOutputTypeCountUserProgressArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCopilotActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CopilotActivityWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommunityStoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityStoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressWhereInput
  }


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    citations: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    citations?: boolean | ArticleCountOutputTypeCountCitationsArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountCitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CitationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    points: number | null
  }

  export type UserSumAggregateOutputType = {
    points: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    image: string | null
    clerkId: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    points: number | null
    badges: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    image: string | null
    clerkId: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    points: number | null
    badges: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    password: number
    image: number
    clerkId: number
    role: number
    createdAt: number
    updatedAt: number
    points: number
    badges: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    points?: true
  }

  export type UserSumAggregateInputType = {
    points?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    clerkId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    points?: true
    badges?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    clerkId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    points?: true
    badges?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    clerkId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    points?: true
    badges?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    password: string | null
    image: string | null
    clerkId: string | null
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    points: number
    badges: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    clerkId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    points?: boolean
    badges?: boolean
    articles?: boolean | User$articlesArgs<ExtArgs>
    copilotActivities?: boolean | User$copilotActivitiesArgs<ExtArgs>
    communityStories?: boolean | User$communityStoriesArgs<ExtArgs>
    userProgress?: boolean | User$userProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    clerkId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    points?: boolean
    badges?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    clerkId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    points?: boolean
    badges?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    clerkId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    points?: boolean
    badges?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "password" | "image" | "clerkId" | "role" | "createdAt" | "updatedAt" | "points" | "badges", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | User$articlesArgs<ExtArgs>
    copilotActivities?: boolean | User$copilotActivitiesArgs<ExtArgs>
    communityStories?: boolean | User$communityStoriesArgs<ExtArgs>
    userProgress?: boolean | User$userProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      articles: Prisma.$ArticlePayload<ExtArgs>[]
      copilotActivities: Prisma.$CopilotActivityPayload<ExtArgs>[]
      communityStories: Prisma.$CommunityStoryPayload<ExtArgs>[]
      userProgress: Prisma.$UserProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      emailVerified: Date | null
      password: string | null
      image: string | null
      clerkId: string | null
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      points: number
      badges: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends User$articlesArgs<ExtArgs> = {}>(args?: Subset<T, User$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    copilotActivities<T extends User$copilotActivitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$copilotActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    communityStories<T extends User$communityStoriesArgs<ExtArgs> = {}>(args?: Subset<T, User$communityStoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userProgress<T extends User$userProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly password: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly clerkId: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly points: FieldRef<"User", 'Int'>
    readonly badges: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.articles
   */
  export type User$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * User.copilotActivities
   */
  export type User$copilotActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    where?: CopilotActivityWhereInput
    orderBy?: CopilotActivityOrderByWithRelationInput | CopilotActivityOrderByWithRelationInput[]
    cursor?: CopilotActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CopilotActivityScalarFieldEnum | CopilotActivityScalarFieldEnum[]
  }

  /**
   * User.communityStories
   */
  export type User$communityStoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    where?: CommunityStoryWhereInput
    orderBy?: CommunityStoryOrderByWithRelationInput | CommunityStoryOrderByWithRelationInput[]
    cursor?: CommunityStoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommunityStoryScalarFieldEnum | CommunityStoryScalarFieldEnum[]
  }

  /**
   * User.userProgress
   */
  export type User$userProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    where?: UserProgressWhereInput
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    cursor?: UserProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleAvgAggregateOutputType = {
    factCheckScore: number | null
    factCheckClicks: number | null
    courseSequence: number | null
  }

  export type ArticleSumAggregateOutputType = {
    factCheckScore: number | null
    factCheckClicks: number | null
    courseSequence: number | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    content: string | null
    type: string | null
    excerpt: string | null
    published: boolean | null
    authorId: string | null
    category: string | null
    tags: string | null
    sentiment: $Enums.Sentiment | null
    factCheckScore: number | null
    factCheckSources: string | null
    factCheckDate: Date | null
    factCheckStatus: string | null
    factCheckClicks: number | null
    level: string | null
    contentType: string | null
    readTime: string | null
    warningLevel: $Enums.WarningLevel | null
    securityTips: string | null
    courseSequence: number | null
    relatedArticles: string | null
    projectHighlight: boolean | null
    coverImage: string | null
    coverImageAlt: string | null
    quizData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    content: string | null
    type: string | null
    excerpt: string | null
    published: boolean | null
    authorId: string | null
    category: string | null
    tags: string | null
    sentiment: $Enums.Sentiment | null
    factCheckScore: number | null
    factCheckSources: string | null
    factCheckDate: Date | null
    factCheckStatus: string | null
    factCheckClicks: number | null
    level: string | null
    contentType: string | null
    readTime: string | null
    warningLevel: $Enums.WarningLevel | null
    securityTips: string | null
    courseSequence: number | null
    relatedArticles: string | null
    projectHighlight: boolean | null
    coverImage: string | null
    coverImageAlt: string | null
    quizData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    content: number
    type: number
    excerpt: number
    published: number
    authorId: number
    category: number
    tags: number
    sentiment: number
    factCheckScore: number
    factCheckSources: number
    factCheckDate: number
    factCheckStatus: number
    factCheckClicks: number
    level: number
    contentType: number
    readTime: number
    warningLevel: number
    securityTips: number
    courseSequence: number
    relatedArticles: number
    projectHighlight: number
    coverImage: number
    coverImageAlt: number
    quizData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArticleAvgAggregateInputType = {
    factCheckScore?: true
    factCheckClicks?: true
    courseSequence?: true
  }

  export type ArticleSumAggregateInputType = {
    factCheckScore?: true
    factCheckClicks?: true
    courseSequence?: true
  }

  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    type?: true
    excerpt?: true
    published?: true
    authorId?: true
    category?: true
    tags?: true
    sentiment?: true
    factCheckScore?: true
    factCheckSources?: true
    factCheckDate?: true
    factCheckStatus?: true
    factCheckClicks?: true
    level?: true
    contentType?: true
    readTime?: true
    warningLevel?: true
    securityTips?: true
    courseSequence?: true
    relatedArticles?: true
    projectHighlight?: true
    coverImage?: true
    coverImageAlt?: true
    quizData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    type?: true
    excerpt?: true
    published?: true
    authorId?: true
    category?: true
    tags?: true
    sentiment?: true
    factCheckScore?: true
    factCheckSources?: true
    factCheckDate?: true
    factCheckStatus?: true
    factCheckClicks?: true
    level?: true
    contentType?: true
    readTime?: true
    warningLevel?: true
    securityTips?: true
    courseSequence?: true
    relatedArticles?: true
    projectHighlight?: true
    coverImage?: true
    coverImageAlt?: true
    quizData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    type?: true
    excerpt?: true
    published?: true
    authorId?: true
    category?: true
    tags?: true
    sentiment?: true
    factCheckScore?: true
    factCheckSources?: true
    factCheckDate?: true
    factCheckStatus?: true
    factCheckClicks?: true
    level?: true
    contentType?: true
    readTime?: true
    warningLevel?: true
    securityTips?: true
    courseSequence?: true
    relatedArticles?: true
    projectHighlight?: true
    coverImage?: true
    coverImageAlt?: true
    quizData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _avg?: ArticleAvgAggregateInputType
    _sum?: ArticleSumAggregateInputType
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    slug: string
    content: string
    type: string
    excerpt: string | null
    published: boolean
    authorId: string
    category: string
    tags: string
    sentiment: $Enums.Sentiment
    factCheckScore: number | null
    factCheckSources: string | null
    factCheckDate: Date | null
    factCheckStatus: string | null
    factCheckClicks: number
    level: string | null
    contentType: string | null
    readTime: string | null
    warningLevel: $Enums.WarningLevel | null
    securityTips: string | null
    courseSequence: number | null
    relatedArticles: string | null
    projectHighlight: boolean
    coverImage: string | null
    coverImageAlt: string | null
    quizData: string | null
    createdAt: Date
    updatedAt: Date
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    type?: boolean
    excerpt?: boolean
    published?: boolean
    authorId?: boolean
    category?: boolean
    tags?: boolean
    sentiment?: boolean
    factCheckScore?: boolean
    factCheckSources?: boolean
    factCheckDate?: boolean
    factCheckStatus?: boolean
    factCheckClicks?: boolean
    level?: boolean
    contentType?: boolean
    readTime?: boolean
    warningLevel?: boolean
    securityTips?: boolean
    courseSequence?: boolean
    relatedArticles?: boolean
    projectHighlight?: boolean
    coverImage?: boolean
    coverImageAlt?: boolean
    quizData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    citations?: boolean | Article$citationsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    type?: boolean
    excerpt?: boolean
    published?: boolean
    authorId?: boolean
    category?: boolean
    tags?: boolean
    sentiment?: boolean
    factCheckScore?: boolean
    factCheckSources?: boolean
    factCheckDate?: boolean
    factCheckStatus?: boolean
    factCheckClicks?: boolean
    level?: boolean
    contentType?: boolean
    readTime?: boolean
    warningLevel?: boolean
    securityTips?: boolean
    courseSequence?: boolean
    relatedArticles?: boolean
    projectHighlight?: boolean
    coverImage?: boolean
    coverImageAlt?: boolean
    quizData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    type?: boolean
    excerpt?: boolean
    published?: boolean
    authorId?: boolean
    category?: boolean
    tags?: boolean
    sentiment?: boolean
    factCheckScore?: boolean
    factCheckSources?: boolean
    factCheckDate?: boolean
    factCheckStatus?: boolean
    factCheckClicks?: boolean
    level?: boolean
    contentType?: boolean
    readTime?: boolean
    warningLevel?: boolean
    securityTips?: boolean
    courseSequence?: boolean
    relatedArticles?: boolean
    projectHighlight?: boolean
    coverImage?: boolean
    coverImageAlt?: boolean
    quizData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    type?: boolean
    excerpt?: boolean
    published?: boolean
    authorId?: boolean
    category?: boolean
    tags?: boolean
    sentiment?: boolean
    factCheckScore?: boolean
    factCheckSources?: boolean
    factCheckDate?: boolean
    factCheckStatus?: boolean
    factCheckClicks?: boolean
    level?: boolean
    contentType?: boolean
    readTime?: boolean
    warningLevel?: boolean
    securityTips?: boolean
    courseSequence?: boolean
    relatedArticles?: boolean
    projectHighlight?: boolean
    coverImage?: boolean
    coverImageAlt?: boolean
    quizData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "content" | "type" | "excerpt" | "published" | "authorId" | "category" | "tags" | "sentiment" | "factCheckScore" | "factCheckSources" | "factCheckDate" | "factCheckStatus" | "factCheckClicks" | "level" | "contentType" | "readTime" | "warningLevel" | "securityTips" | "courseSequence" | "relatedArticles" | "projectHighlight" | "coverImage" | "coverImageAlt" | "quizData" | "createdAt" | "updatedAt", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    citations?: boolean | Article$citationsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      citations: Prisma.$CitationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      content: string
      type: string
      excerpt: string | null
      published: boolean
      authorId: string
      category: string
      tags: string
      sentiment: $Enums.Sentiment
      factCheckScore: number | null
      factCheckSources: string | null
      factCheckDate: Date | null
      factCheckStatus: string | null
      factCheckClicks: number
      level: string | null
      contentType: string | null
      readTime: string | null
      warningLevel: $Enums.WarningLevel | null
      securityTips: string | null
      courseSequence: number | null
      relatedArticles: string | null
      projectHighlight: boolean
      coverImage: string | null
      coverImageAlt: string | null
      quizData: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    citations<T extends Article$citationsArgs<ExtArgs> = {}>(args?: Subset<T, Article$citationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly slug: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly type: FieldRef<"Article", 'String'>
    readonly excerpt: FieldRef<"Article", 'String'>
    readonly published: FieldRef<"Article", 'Boolean'>
    readonly authorId: FieldRef<"Article", 'String'>
    readonly category: FieldRef<"Article", 'String'>
    readonly tags: FieldRef<"Article", 'String'>
    readonly sentiment: FieldRef<"Article", 'Sentiment'>
    readonly factCheckScore: FieldRef<"Article", 'Float'>
    readonly factCheckSources: FieldRef<"Article", 'String'>
    readonly factCheckDate: FieldRef<"Article", 'DateTime'>
    readonly factCheckStatus: FieldRef<"Article", 'String'>
    readonly factCheckClicks: FieldRef<"Article", 'Int'>
    readonly level: FieldRef<"Article", 'String'>
    readonly contentType: FieldRef<"Article", 'String'>
    readonly readTime: FieldRef<"Article", 'String'>
    readonly warningLevel: FieldRef<"Article", 'WarningLevel'>
    readonly securityTips: FieldRef<"Article", 'String'>
    readonly courseSequence: FieldRef<"Article", 'Int'>
    readonly relatedArticles: FieldRef<"Article", 'String'>
    readonly projectHighlight: FieldRef<"Article", 'Boolean'>
    readonly coverImage: FieldRef<"Article", 'String'>
    readonly coverImageAlt: FieldRef<"Article", 'String'>
    readonly quizData: FieldRef<"Article", 'String'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article.citations
   */
  export type Article$citationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    where?: CitationWhereInput
    orderBy?: CitationOrderByWithRelationInput | CitationOrderByWithRelationInput[]
    cursor?: CitationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CitationScalarFieldEnum | CitationScalarFieldEnum[]
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model Citation
   */

  export type AggregateCitation = {
    _count: CitationCountAggregateOutputType | null
    _avg: CitationAvgAggregateOutputType | null
    _sum: CitationSumAggregateOutputType | null
    _min: CitationMinAggregateOutputType | null
    _max: CitationMaxAggregateOutputType | null
  }

  export type CitationAvgAggregateOutputType = {
    order: number | null
  }

  export type CitationSumAggregateOutputType = {
    order: number | null
  }

  export type CitationMinAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    domain: string | null
    articleId: string | null
    order: number | null
    verified: boolean | null
    createdAt: Date | null
  }

  export type CitationMaxAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    domain: string | null
    articleId: string | null
    order: number | null
    verified: boolean | null
    createdAt: Date | null
  }

  export type CitationCountAggregateOutputType = {
    id: number
    url: number
    title: number
    domain: number
    articleId: number
    order: number
    verified: number
    createdAt: number
    _all: number
  }


  export type CitationAvgAggregateInputType = {
    order?: true
  }

  export type CitationSumAggregateInputType = {
    order?: true
  }

  export type CitationMinAggregateInputType = {
    id?: true
    url?: true
    title?: true
    domain?: true
    articleId?: true
    order?: true
    verified?: true
    createdAt?: true
  }

  export type CitationMaxAggregateInputType = {
    id?: true
    url?: true
    title?: true
    domain?: true
    articleId?: true
    order?: true
    verified?: true
    createdAt?: true
  }

  export type CitationCountAggregateInputType = {
    id?: true
    url?: true
    title?: true
    domain?: true
    articleId?: true
    order?: true
    verified?: true
    createdAt?: true
    _all?: true
  }

  export type CitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Citation to aggregate.
     */
    where?: CitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citations to fetch.
     */
    orderBy?: CitationOrderByWithRelationInput | CitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Citations
    **/
    _count?: true | CitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CitationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CitationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CitationMaxAggregateInputType
  }

  export type GetCitationAggregateType<T extends CitationAggregateArgs> = {
        [P in keyof T & keyof AggregateCitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCitation[P]>
      : GetScalarType<T[P], AggregateCitation[P]>
  }




  export type CitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CitationWhereInput
    orderBy?: CitationOrderByWithAggregationInput | CitationOrderByWithAggregationInput[]
    by: CitationScalarFieldEnum[] | CitationScalarFieldEnum
    having?: CitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CitationCountAggregateInputType | true
    _avg?: CitationAvgAggregateInputType
    _sum?: CitationSumAggregateInputType
    _min?: CitationMinAggregateInputType
    _max?: CitationMaxAggregateInputType
  }

  export type CitationGroupByOutputType = {
    id: string
    url: string
    title: string | null
    domain: string | null
    articleId: string
    order: number
    verified: boolean
    createdAt: Date
    _count: CitationCountAggregateOutputType | null
    _avg: CitationAvgAggregateOutputType | null
    _sum: CitationSumAggregateOutputType | null
    _min: CitationMinAggregateOutputType | null
    _max: CitationMaxAggregateOutputType | null
  }

  type GetCitationGroupByPayload<T extends CitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CitationGroupByOutputType[P]>
            : GetScalarType<T[P], CitationGroupByOutputType[P]>
        }
      >
    >


  export type CitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    domain?: boolean
    articleId?: boolean
    order?: boolean
    verified?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["citation"]>

  export type CitationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    domain?: boolean
    articleId?: boolean
    order?: boolean
    verified?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["citation"]>

  export type CitationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    domain?: boolean
    articleId?: boolean
    order?: boolean
    verified?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["citation"]>

  export type CitationSelectScalar = {
    id?: boolean
    url?: boolean
    title?: boolean
    domain?: boolean
    articleId?: boolean
    order?: boolean
    verified?: boolean
    createdAt?: boolean
  }

  export type CitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "title" | "domain" | "articleId" | "order" | "verified" | "createdAt", ExtArgs["result"]["citation"]>
  export type CitationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type CitationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type CitationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $CitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Citation"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      title: string | null
      domain: string | null
      articleId: string
      order: number
      verified: boolean
      createdAt: Date
    }, ExtArgs["result"]["citation"]>
    composites: {}
  }

  type CitationGetPayload<S extends boolean | null | undefined | CitationDefaultArgs> = $Result.GetResult<Prisma.$CitationPayload, S>

  type CitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CitationCountAggregateInputType | true
    }

  export interface CitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Citation'], meta: { name: 'Citation' } }
    /**
     * Find zero or one Citation that matches the filter.
     * @param {CitationFindUniqueArgs} args - Arguments to find a Citation
     * @example
     * // Get one Citation
     * const citation = await prisma.citation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CitationFindUniqueArgs>(args: SelectSubset<T, CitationFindUniqueArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Citation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CitationFindUniqueOrThrowArgs} args - Arguments to find a Citation
     * @example
     * // Get one Citation
     * const citation = await prisma.citation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CitationFindUniqueOrThrowArgs>(args: SelectSubset<T, CitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Citation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationFindFirstArgs} args - Arguments to find a Citation
     * @example
     * // Get one Citation
     * const citation = await prisma.citation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CitationFindFirstArgs>(args?: SelectSubset<T, CitationFindFirstArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Citation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationFindFirstOrThrowArgs} args - Arguments to find a Citation
     * @example
     * // Get one Citation
     * const citation = await prisma.citation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CitationFindFirstOrThrowArgs>(args?: SelectSubset<T, CitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Citations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Citations
     * const citations = await prisma.citation.findMany()
     * 
     * // Get first 10 Citations
     * const citations = await prisma.citation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const citationWithIdOnly = await prisma.citation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CitationFindManyArgs>(args?: SelectSubset<T, CitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Citation.
     * @param {CitationCreateArgs} args - Arguments to create a Citation.
     * @example
     * // Create one Citation
     * const Citation = await prisma.citation.create({
     *   data: {
     *     // ... data to create a Citation
     *   }
     * })
     * 
     */
    create<T extends CitationCreateArgs>(args: SelectSubset<T, CitationCreateArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Citations.
     * @param {CitationCreateManyArgs} args - Arguments to create many Citations.
     * @example
     * // Create many Citations
     * const citation = await prisma.citation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CitationCreateManyArgs>(args?: SelectSubset<T, CitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Citations and returns the data saved in the database.
     * @param {CitationCreateManyAndReturnArgs} args - Arguments to create many Citations.
     * @example
     * // Create many Citations
     * const citation = await prisma.citation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Citations and only return the `id`
     * const citationWithIdOnly = await prisma.citation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CitationCreateManyAndReturnArgs>(args?: SelectSubset<T, CitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Citation.
     * @param {CitationDeleteArgs} args - Arguments to delete one Citation.
     * @example
     * // Delete one Citation
     * const Citation = await prisma.citation.delete({
     *   where: {
     *     // ... filter to delete one Citation
     *   }
     * })
     * 
     */
    delete<T extends CitationDeleteArgs>(args: SelectSubset<T, CitationDeleteArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Citation.
     * @param {CitationUpdateArgs} args - Arguments to update one Citation.
     * @example
     * // Update one Citation
     * const citation = await prisma.citation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CitationUpdateArgs>(args: SelectSubset<T, CitationUpdateArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Citations.
     * @param {CitationDeleteManyArgs} args - Arguments to filter Citations to delete.
     * @example
     * // Delete a few Citations
     * const { count } = await prisma.citation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CitationDeleteManyArgs>(args?: SelectSubset<T, CitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Citations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Citations
     * const citation = await prisma.citation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CitationUpdateManyArgs>(args: SelectSubset<T, CitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Citations and returns the data updated in the database.
     * @param {CitationUpdateManyAndReturnArgs} args - Arguments to update many Citations.
     * @example
     * // Update many Citations
     * const citation = await prisma.citation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Citations and only return the `id`
     * const citationWithIdOnly = await prisma.citation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CitationUpdateManyAndReturnArgs>(args: SelectSubset<T, CitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Citation.
     * @param {CitationUpsertArgs} args - Arguments to update or create a Citation.
     * @example
     * // Update or create a Citation
     * const citation = await prisma.citation.upsert({
     *   create: {
     *     // ... data to create a Citation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Citation we want to update
     *   }
     * })
     */
    upsert<T extends CitationUpsertArgs>(args: SelectSubset<T, CitationUpsertArgs<ExtArgs>>): Prisma__CitationClient<$Result.GetResult<Prisma.$CitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Citations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationCountArgs} args - Arguments to filter Citations to count.
     * @example
     * // Count the number of Citations
     * const count = await prisma.citation.count({
     *   where: {
     *     // ... the filter for the Citations we want to count
     *   }
     * })
    **/
    count<T extends CitationCountArgs>(
      args?: Subset<T, CitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Citation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CitationAggregateArgs>(args: Subset<T, CitationAggregateArgs>): Prisma.PrismaPromise<GetCitationAggregateType<T>>

    /**
     * Group by Citation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CitationGroupByArgs['orderBy'] }
        : { orderBy?: CitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Citation model
   */
  readonly fields: CitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Citation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Citation model
   */
  interface CitationFieldRefs {
    readonly id: FieldRef<"Citation", 'String'>
    readonly url: FieldRef<"Citation", 'String'>
    readonly title: FieldRef<"Citation", 'String'>
    readonly domain: FieldRef<"Citation", 'String'>
    readonly articleId: FieldRef<"Citation", 'String'>
    readonly order: FieldRef<"Citation", 'Int'>
    readonly verified: FieldRef<"Citation", 'Boolean'>
    readonly createdAt: FieldRef<"Citation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Citation findUnique
   */
  export type CitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter, which Citation to fetch.
     */
    where: CitationWhereUniqueInput
  }

  /**
   * Citation findUniqueOrThrow
   */
  export type CitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter, which Citation to fetch.
     */
    where: CitationWhereUniqueInput
  }

  /**
   * Citation findFirst
   */
  export type CitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter, which Citation to fetch.
     */
    where?: CitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citations to fetch.
     */
    orderBy?: CitationOrderByWithRelationInput | CitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Citations.
     */
    cursor?: CitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Citations.
     */
    distinct?: CitationScalarFieldEnum | CitationScalarFieldEnum[]
  }

  /**
   * Citation findFirstOrThrow
   */
  export type CitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter, which Citation to fetch.
     */
    where?: CitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citations to fetch.
     */
    orderBy?: CitationOrderByWithRelationInput | CitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Citations.
     */
    cursor?: CitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Citations.
     */
    distinct?: CitationScalarFieldEnum | CitationScalarFieldEnum[]
  }

  /**
   * Citation findMany
   */
  export type CitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter, which Citations to fetch.
     */
    where?: CitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citations to fetch.
     */
    orderBy?: CitationOrderByWithRelationInput | CitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Citations.
     */
    cursor?: CitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citations.
     */
    skip?: number
    distinct?: CitationScalarFieldEnum | CitationScalarFieldEnum[]
  }

  /**
   * Citation create
   */
  export type CitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * The data needed to create a Citation.
     */
    data: XOR<CitationCreateInput, CitationUncheckedCreateInput>
  }

  /**
   * Citation createMany
   */
  export type CitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Citations.
     */
    data: CitationCreateManyInput | CitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Citation createManyAndReturn
   */
  export type CitationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * The data used to create many Citations.
     */
    data: CitationCreateManyInput | CitationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Citation update
   */
  export type CitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * The data needed to update a Citation.
     */
    data: XOR<CitationUpdateInput, CitationUncheckedUpdateInput>
    /**
     * Choose, which Citation to update.
     */
    where: CitationWhereUniqueInput
  }

  /**
   * Citation updateMany
   */
  export type CitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Citations.
     */
    data: XOR<CitationUpdateManyMutationInput, CitationUncheckedUpdateManyInput>
    /**
     * Filter which Citations to update
     */
    where?: CitationWhereInput
    /**
     * Limit how many Citations to update.
     */
    limit?: number
  }

  /**
   * Citation updateManyAndReturn
   */
  export type CitationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * The data used to update Citations.
     */
    data: XOR<CitationUpdateManyMutationInput, CitationUncheckedUpdateManyInput>
    /**
     * Filter which Citations to update
     */
    where?: CitationWhereInput
    /**
     * Limit how many Citations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Citation upsert
   */
  export type CitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * The filter to search for the Citation to update in case it exists.
     */
    where: CitationWhereUniqueInput
    /**
     * In case the Citation found by the `where` argument doesn't exist, create a new Citation with this data.
     */
    create: XOR<CitationCreateInput, CitationUncheckedCreateInput>
    /**
     * In case the Citation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CitationUpdateInput, CitationUncheckedUpdateInput>
  }

  /**
   * Citation delete
   */
  export type CitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
    /**
     * Filter which Citation to delete.
     */
    where: CitationWhereUniqueInput
  }

  /**
   * Citation deleteMany
   */
  export type CitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Citations to delete
     */
    where?: CitationWhereInput
    /**
     * Limit how many Citations to delete.
     */
    limit?: number
  }

  /**
   * Citation without action
   */
  export type CitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Citation
     */
    select?: CitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Citation
     */
    omit?: CitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitationInclude<ExtArgs> | null
  }


  /**
   * Model Resource
   */

  export type AggregateResource = {
    _count: ResourceCountAggregateOutputType | null
    _avg: ResourceAvgAggregateOutputType | null
    _sum: ResourceSumAggregateOutputType | null
    _min: ResourceMinAggregateOutputType | null
    _max: ResourceMaxAggregateOutputType | null
  }

  export type ResourceAvgAggregateOutputType = {
    views: number | null
  }

  export type ResourceSumAggregateOutputType = {
    views: number | null
  }

  export type ResourceMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    verified: boolean | null
    shortDescription: string | null
    officialUrl: string | null
    platforms: string | null
    tags: string | null
    heroTitle: string | null
    heroDescription: string | null
    heroGradient: string | null
    whyGoodTitle: string | null
    whyGoodContent: string | null
    features: string | null
    howToStartTitle: string | null
    howToStartSteps: string | null
    pros: string | null
    cons: string | null
    faq: string | null
    securityTips: string | null
    securityAudit: string | null
    securityAuditDate: Date | null
    auditedByCommunity: boolean | null
    toolConfig: string | null
    interactiveType: string | null
    showCompatibleWallets: boolean | null
    relatedResources: string | null
    views: number | null
    createdAt: Date | null
    updatedAt: Date | null
    lastVerified: Date | null
  }

  export type ResourceMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    verified: boolean | null
    shortDescription: string | null
    officialUrl: string | null
    platforms: string | null
    tags: string | null
    heroTitle: string | null
    heroDescription: string | null
    heroGradient: string | null
    whyGoodTitle: string | null
    whyGoodContent: string | null
    features: string | null
    howToStartTitle: string | null
    howToStartSteps: string | null
    pros: string | null
    cons: string | null
    faq: string | null
    securityTips: string | null
    securityAudit: string | null
    securityAuditDate: Date | null
    auditedByCommunity: boolean | null
    toolConfig: string | null
    interactiveType: string | null
    showCompatibleWallets: boolean | null
    relatedResources: string | null
    views: number | null
    createdAt: Date | null
    updatedAt: Date | null
    lastVerified: Date | null
  }

  export type ResourceCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    category: number
    verified: number
    shortDescription: number
    officialUrl: number
    platforms: number
    tags: number
    heroTitle: number
    heroDescription: number
    heroGradient: number
    whyGoodTitle: number
    whyGoodContent: number
    features: number
    howToStartTitle: number
    howToStartSteps: number
    pros: number
    cons: number
    faq: number
    securityTips: number
    securityAudit: number
    securityAuditDate: number
    auditedByCommunity: number
    toolConfig: number
    interactiveType: number
    showCompatibleWallets: number
    relatedResources: number
    views: number
    createdAt: number
    updatedAt: number
    lastVerified: number
    _all: number
  }


  export type ResourceAvgAggregateInputType = {
    views?: true
  }

  export type ResourceSumAggregateInputType = {
    views?: true
  }

  export type ResourceMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    verified?: true
    shortDescription?: true
    officialUrl?: true
    platforms?: true
    tags?: true
    heroTitle?: true
    heroDescription?: true
    heroGradient?: true
    whyGoodTitle?: true
    whyGoodContent?: true
    features?: true
    howToStartTitle?: true
    howToStartSteps?: true
    pros?: true
    cons?: true
    faq?: true
    securityTips?: true
    securityAudit?: true
    securityAuditDate?: true
    auditedByCommunity?: true
    toolConfig?: true
    interactiveType?: true
    showCompatibleWallets?: true
    relatedResources?: true
    views?: true
    createdAt?: true
    updatedAt?: true
    lastVerified?: true
  }

  export type ResourceMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    verified?: true
    shortDescription?: true
    officialUrl?: true
    platforms?: true
    tags?: true
    heroTitle?: true
    heroDescription?: true
    heroGradient?: true
    whyGoodTitle?: true
    whyGoodContent?: true
    features?: true
    howToStartTitle?: true
    howToStartSteps?: true
    pros?: true
    cons?: true
    faq?: true
    securityTips?: true
    securityAudit?: true
    securityAuditDate?: true
    auditedByCommunity?: true
    toolConfig?: true
    interactiveType?: true
    showCompatibleWallets?: true
    relatedResources?: true
    views?: true
    createdAt?: true
    updatedAt?: true
    lastVerified?: true
  }

  export type ResourceCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    verified?: true
    shortDescription?: true
    officialUrl?: true
    platforms?: true
    tags?: true
    heroTitle?: true
    heroDescription?: true
    heroGradient?: true
    whyGoodTitle?: true
    whyGoodContent?: true
    features?: true
    howToStartTitle?: true
    howToStartSteps?: true
    pros?: true
    cons?: true
    faq?: true
    securityTips?: true
    securityAudit?: true
    securityAuditDate?: true
    auditedByCommunity?: true
    toolConfig?: true
    interactiveType?: true
    showCompatibleWallets?: true
    relatedResources?: true
    views?: true
    createdAt?: true
    updatedAt?: true
    lastVerified?: true
    _all?: true
  }

  export type ResourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resource to aggregate.
     */
    where?: ResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourceOrderByWithRelationInput | ResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resources
    **/
    _count?: true | ResourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResourceMaxAggregateInputType
  }

  export type GetResourceAggregateType<T extends ResourceAggregateArgs> = {
        [P in keyof T & keyof AggregateResource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResource[P]>
      : GetScalarType<T[P], AggregateResource[P]>
  }




  export type ResourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResourceWhereInput
    orderBy?: ResourceOrderByWithAggregationInput | ResourceOrderByWithAggregationInput[]
    by: ResourceScalarFieldEnum[] | ResourceScalarFieldEnum
    having?: ResourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResourceCountAggregateInputType | true
    _avg?: ResourceAvgAggregateInputType
    _sum?: ResourceSumAggregateInputType
    _min?: ResourceMinAggregateInputType
    _max?: ResourceMaxAggregateInputType
  }

  export type ResourceGroupByOutputType = {
    id: string
    slug: string
    name: string
    category: string
    verified: boolean
    shortDescription: string
    officialUrl: string
    platforms: string
    tags: string
    heroTitle: string
    heroDescription: string
    heroGradient: string
    whyGoodTitle: string
    whyGoodContent: string
    features: string
    howToStartTitle: string
    howToStartSteps: string
    pros: string
    cons: string
    faq: string
    securityTips: string
    securityAudit: string | null
    securityAuditDate: Date | null
    auditedByCommunity: boolean
    toolConfig: string | null
    interactiveType: string | null
    showCompatibleWallets: boolean
    relatedResources: string | null
    views: number
    createdAt: Date
    updatedAt: Date
    lastVerified: Date
    _count: ResourceCountAggregateOutputType | null
    _avg: ResourceAvgAggregateOutputType | null
    _sum: ResourceSumAggregateOutputType | null
    _min: ResourceMinAggregateOutputType | null
    _max: ResourceMaxAggregateOutputType | null
  }

  type GetResourceGroupByPayload<T extends ResourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResourceGroupByOutputType[P]>
            : GetScalarType<T[P], ResourceGroupByOutputType[P]>
        }
      >
    >


  export type ResourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    verified?: boolean
    shortDescription?: boolean
    officialUrl?: boolean
    platforms?: boolean
    tags?: boolean
    heroTitle?: boolean
    heroDescription?: boolean
    heroGradient?: boolean
    whyGoodTitle?: boolean
    whyGoodContent?: boolean
    features?: boolean
    howToStartTitle?: boolean
    howToStartSteps?: boolean
    pros?: boolean
    cons?: boolean
    faq?: boolean
    securityTips?: boolean
    securityAudit?: boolean
    securityAuditDate?: boolean
    auditedByCommunity?: boolean
    toolConfig?: boolean
    interactiveType?: boolean
    showCompatibleWallets?: boolean
    relatedResources?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVerified?: boolean
  }, ExtArgs["result"]["resource"]>

  export type ResourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    verified?: boolean
    shortDescription?: boolean
    officialUrl?: boolean
    platforms?: boolean
    tags?: boolean
    heroTitle?: boolean
    heroDescription?: boolean
    heroGradient?: boolean
    whyGoodTitle?: boolean
    whyGoodContent?: boolean
    features?: boolean
    howToStartTitle?: boolean
    howToStartSteps?: boolean
    pros?: boolean
    cons?: boolean
    faq?: boolean
    securityTips?: boolean
    securityAudit?: boolean
    securityAuditDate?: boolean
    auditedByCommunity?: boolean
    toolConfig?: boolean
    interactiveType?: boolean
    showCompatibleWallets?: boolean
    relatedResources?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVerified?: boolean
  }, ExtArgs["result"]["resource"]>

  export type ResourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    verified?: boolean
    shortDescription?: boolean
    officialUrl?: boolean
    platforms?: boolean
    tags?: boolean
    heroTitle?: boolean
    heroDescription?: boolean
    heroGradient?: boolean
    whyGoodTitle?: boolean
    whyGoodContent?: boolean
    features?: boolean
    howToStartTitle?: boolean
    howToStartSteps?: boolean
    pros?: boolean
    cons?: boolean
    faq?: boolean
    securityTips?: boolean
    securityAudit?: boolean
    securityAuditDate?: boolean
    auditedByCommunity?: boolean
    toolConfig?: boolean
    interactiveType?: boolean
    showCompatibleWallets?: boolean
    relatedResources?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVerified?: boolean
  }, ExtArgs["result"]["resource"]>

  export type ResourceSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    verified?: boolean
    shortDescription?: boolean
    officialUrl?: boolean
    platforms?: boolean
    tags?: boolean
    heroTitle?: boolean
    heroDescription?: boolean
    heroGradient?: boolean
    whyGoodTitle?: boolean
    whyGoodContent?: boolean
    features?: boolean
    howToStartTitle?: boolean
    howToStartSteps?: boolean
    pros?: boolean
    cons?: boolean
    faq?: boolean
    securityTips?: boolean
    securityAudit?: boolean
    securityAuditDate?: boolean
    auditedByCommunity?: boolean
    toolConfig?: boolean
    interactiveType?: boolean
    showCompatibleWallets?: boolean
    relatedResources?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVerified?: boolean
  }

  export type ResourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "category" | "verified" | "shortDescription" | "officialUrl" | "platforms" | "tags" | "heroTitle" | "heroDescription" | "heroGradient" | "whyGoodTitle" | "whyGoodContent" | "features" | "howToStartTitle" | "howToStartSteps" | "pros" | "cons" | "faq" | "securityTips" | "securityAudit" | "securityAuditDate" | "auditedByCommunity" | "toolConfig" | "interactiveType" | "showCompatibleWallets" | "relatedResources" | "views" | "createdAt" | "updatedAt" | "lastVerified", ExtArgs["result"]["resource"]>

  export type $ResourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resource"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      category: string
      verified: boolean
      shortDescription: string
      officialUrl: string
      platforms: string
      tags: string
      heroTitle: string
      heroDescription: string
      heroGradient: string
      whyGoodTitle: string
      whyGoodContent: string
      features: string
      howToStartTitle: string
      howToStartSteps: string
      pros: string
      cons: string
      faq: string
      securityTips: string
      securityAudit: string | null
      securityAuditDate: Date | null
      auditedByCommunity: boolean
      toolConfig: string | null
      interactiveType: string | null
      showCompatibleWallets: boolean
      relatedResources: string | null
      views: number
      createdAt: Date
      updatedAt: Date
      lastVerified: Date
    }, ExtArgs["result"]["resource"]>
    composites: {}
  }

  type ResourceGetPayload<S extends boolean | null | undefined | ResourceDefaultArgs> = $Result.GetResult<Prisma.$ResourcePayload, S>

  type ResourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResourceCountAggregateInputType | true
    }

  export interface ResourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resource'], meta: { name: 'Resource' } }
    /**
     * Find zero or one Resource that matches the filter.
     * @param {ResourceFindUniqueArgs} args - Arguments to find a Resource
     * @example
     * // Get one Resource
     * const resource = await prisma.resource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResourceFindUniqueArgs>(args: SelectSubset<T, ResourceFindUniqueArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResourceFindUniqueOrThrowArgs} args - Arguments to find a Resource
     * @example
     * // Get one Resource
     * const resource = await prisma.resource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResourceFindUniqueOrThrowArgs>(args: SelectSubset<T, ResourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceFindFirstArgs} args - Arguments to find a Resource
     * @example
     * // Get one Resource
     * const resource = await prisma.resource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResourceFindFirstArgs>(args?: SelectSubset<T, ResourceFindFirstArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceFindFirstOrThrowArgs} args - Arguments to find a Resource
     * @example
     * // Get one Resource
     * const resource = await prisma.resource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResourceFindFirstOrThrowArgs>(args?: SelectSubset<T, ResourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resources
     * const resources = await prisma.resource.findMany()
     * 
     * // Get first 10 Resources
     * const resources = await prisma.resource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resourceWithIdOnly = await prisma.resource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResourceFindManyArgs>(args?: SelectSubset<T, ResourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resource.
     * @param {ResourceCreateArgs} args - Arguments to create a Resource.
     * @example
     * // Create one Resource
     * const Resource = await prisma.resource.create({
     *   data: {
     *     // ... data to create a Resource
     *   }
     * })
     * 
     */
    create<T extends ResourceCreateArgs>(args: SelectSubset<T, ResourceCreateArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resources.
     * @param {ResourceCreateManyArgs} args - Arguments to create many Resources.
     * @example
     * // Create many Resources
     * const resource = await prisma.resource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResourceCreateManyArgs>(args?: SelectSubset<T, ResourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resources and returns the data saved in the database.
     * @param {ResourceCreateManyAndReturnArgs} args - Arguments to create many Resources.
     * @example
     * // Create many Resources
     * const resource = await prisma.resource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resources and only return the `id`
     * const resourceWithIdOnly = await prisma.resource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResourceCreateManyAndReturnArgs>(args?: SelectSubset<T, ResourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resource.
     * @param {ResourceDeleteArgs} args - Arguments to delete one Resource.
     * @example
     * // Delete one Resource
     * const Resource = await prisma.resource.delete({
     *   where: {
     *     // ... filter to delete one Resource
     *   }
     * })
     * 
     */
    delete<T extends ResourceDeleteArgs>(args: SelectSubset<T, ResourceDeleteArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resource.
     * @param {ResourceUpdateArgs} args - Arguments to update one Resource.
     * @example
     * // Update one Resource
     * const resource = await prisma.resource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResourceUpdateArgs>(args: SelectSubset<T, ResourceUpdateArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resources.
     * @param {ResourceDeleteManyArgs} args - Arguments to filter Resources to delete.
     * @example
     * // Delete a few Resources
     * const { count } = await prisma.resource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResourceDeleteManyArgs>(args?: SelectSubset<T, ResourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resources
     * const resource = await prisma.resource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResourceUpdateManyArgs>(args: SelectSubset<T, ResourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resources and returns the data updated in the database.
     * @param {ResourceUpdateManyAndReturnArgs} args - Arguments to update many Resources.
     * @example
     * // Update many Resources
     * const resource = await prisma.resource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resources and only return the `id`
     * const resourceWithIdOnly = await prisma.resource.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResourceUpdateManyAndReturnArgs>(args: SelectSubset<T, ResourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resource.
     * @param {ResourceUpsertArgs} args - Arguments to update or create a Resource.
     * @example
     * // Update or create a Resource
     * const resource = await prisma.resource.upsert({
     *   create: {
     *     // ... data to create a Resource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resource we want to update
     *   }
     * })
     */
    upsert<T extends ResourceUpsertArgs>(args: SelectSubset<T, ResourceUpsertArgs<ExtArgs>>): Prisma__ResourceClient<$Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceCountArgs} args - Arguments to filter Resources to count.
     * @example
     * // Count the number of Resources
     * const count = await prisma.resource.count({
     *   where: {
     *     // ... the filter for the Resources we want to count
     *   }
     * })
    **/
    count<T extends ResourceCountArgs>(
      args?: Subset<T, ResourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResourceAggregateArgs>(args: Subset<T, ResourceAggregateArgs>): Prisma.PrismaPromise<GetResourceAggregateType<T>>

    /**
     * Group by Resource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResourceGroupByArgs['orderBy'] }
        : { orderBy?: ResourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resource model
   */
  readonly fields: ResourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resource model
   */
  interface ResourceFieldRefs {
    readonly id: FieldRef<"Resource", 'String'>
    readonly slug: FieldRef<"Resource", 'String'>
    readonly name: FieldRef<"Resource", 'String'>
    readonly category: FieldRef<"Resource", 'String'>
    readonly verified: FieldRef<"Resource", 'Boolean'>
    readonly shortDescription: FieldRef<"Resource", 'String'>
    readonly officialUrl: FieldRef<"Resource", 'String'>
    readonly platforms: FieldRef<"Resource", 'String'>
    readonly tags: FieldRef<"Resource", 'String'>
    readonly heroTitle: FieldRef<"Resource", 'String'>
    readonly heroDescription: FieldRef<"Resource", 'String'>
    readonly heroGradient: FieldRef<"Resource", 'String'>
    readonly whyGoodTitle: FieldRef<"Resource", 'String'>
    readonly whyGoodContent: FieldRef<"Resource", 'String'>
    readonly features: FieldRef<"Resource", 'String'>
    readonly howToStartTitle: FieldRef<"Resource", 'String'>
    readonly howToStartSteps: FieldRef<"Resource", 'String'>
    readonly pros: FieldRef<"Resource", 'String'>
    readonly cons: FieldRef<"Resource", 'String'>
    readonly faq: FieldRef<"Resource", 'String'>
    readonly securityTips: FieldRef<"Resource", 'String'>
    readonly securityAudit: FieldRef<"Resource", 'String'>
    readonly securityAuditDate: FieldRef<"Resource", 'DateTime'>
    readonly auditedByCommunity: FieldRef<"Resource", 'Boolean'>
    readonly toolConfig: FieldRef<"Resource", 'String'>
    readonly interactiveType: FieldRef<"Resource", 'String'>
    readonly showCompatibleWallets: FieldRef<"Resource", 'Boolean'>
    readonly relatedResources: FieldRef<"Resource", 'String'>
    readonly views: FieldRef<"Resource", 'Int'>
    readonly createdAt: FieldRef<"Resource", 'DateTime'>
    readonly updatedAt: FieldRef<"Resource", 'DateTime'>
    readonly lastVerified: FieldRef<"Resource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resource findUnique
   */
  export type ResourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter, which Resource to fetch.
     */
    where: ResourceWhereUniqueInput
  }

  /**
   * Resource findUniqueOrThrow
   */
  export type ResourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter, which Resource to fetch.
     */
    where: ResourceWhereUniqueInput
  }

  /**
   * Resource findFirst
   */
  export type ResourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter, which Resource to fetch.
     */
    where?: ResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourceOrderByWithRelationInput | ResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resources.
     */
    cursor?: ResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resources.
     */
    distinct?: ResourceScalarFieldEnum | ResourceScalarFieldEnum[]
  }

  /**
   * Resource findFirstOrThrow
   */
  export type ResourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter, which Resource to fetch.
     */
    where?: ResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourceOrderByWithRelationInput | ResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resources.
     */
    cursor?: ResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resources.
     */
    distinct?: ResourceScalarFieldEnum | ResourceScalarFieldEnum[]
  }

  /**
   * Resource findMany
   */
  export type ResourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where?: ResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourceOrderByWithRelationInput | ResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resources.
     */
    cursor?: ResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    distinct?: ResourceScalarFieldEnum | ResourceScalarFieldEnum[]
  }

  /**
   * Resource create
   */
  export type ResourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * The data needed to create a Resource.
     */
    data: XOR<ResourceCreateInput, ResourceUncheckedCreateInput>
  }

  /**
   * Resource createMany
   */
  export type ResourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resources.
     */
    data: ResourceCreateManyInput | ResourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resource createManyAndReturn
   */
  export type ResourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * The data used to create many Resources.
     */
    data: ResourceCreateManyInput | ResourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resource update
   */
  export type ResourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * The data needed to update a Resource.
     */
    data: XOR<ResourceUpdateInput, ResourceUncheckedUpdateInput>
    /**
     * Choose, which Resource to update.
     */
    where: ResourceWhereUniqueInput
  }

  /**
   * Resource updateMany
   */
  export type ResourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resources.
     */
    data: XOR<ResourceUpdateManyMutationInput, ResourceUncheckedUpdateManyInput>
    /**
     * Filter which Resources to update
     */
    where?: ResourceWhereInput
    /**
     * Limit how many Resources to update.
     */
    limit?: number
  }

  /**
   * Resource updateManyAndReturn
   */
  export type ResourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * The data used to update Resources.
     */
    data: XOR<ResourceUpdateManyMutationInput, ResourceUncheckedUpdateManyInput>
    /**
     * Filter which Resources to update
     */
    where?: ResourceWhereInput
    /**
     * Limit how many Resources to update.
     */
    limit?: number
  }

  /**
   * Resource upsert
   */
  export type ResourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * The filter to search for the Resource to update in case it exists.
     */
    where: ResourceWhereUniqueInput
    /**
     * In case the Resource found by the `where` argument doesn't exist, create a new Resource with this data.
     */
    create: XOR<ResourceCreateInput, ResourceUncheckedCreateInput>
    /**
     * In case the Resource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResourceUpdateInput, ResourceUncheckedUpdateInput>
  }

  /**
   * Resource delete
   */
  export type ResourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
    /**
     * Filter which Resource to delete.
     */
    where: ResourceWhereUniqueInput
  }

  /**
   * Resource deleteMany
   */
  export type ResourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resources to delete
     */
    where?: ResourceWhereInput
    /**
     * Limit how many Resources to delete.
     */
    limit?: number
  }

  /**
   * Resource without action
   */
  export type ResourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: ResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resource
     */
    omit?: ResourceOmit<ExtArgs> | null
  }


  /**
   * Model Cryptocurrency
   */

  export type AggregateCryptocurrency = {
    _count: CryptocurrencyCountAggregateOutputType | null
    _avg: CryptocurrencyAvgAggregateOutputType | null
    _sum: CryptocurrencySumAggregateOutputType | null
    _min: CryptocurrencyMinAggregateOutputType | null
    _max: CryptocurrencyMaxAggregateOutputType | null
  }

  export type CryptocurrencyAvgAggregateOutputType = {
    currentPrice: number | null
    marketCap: number | null
    marketCapRank: number | null
    totalVolume: number | null
    high24h: number | null
    low24h: number | null
    priceChange24h: number | null
    priceChangePercentage24h: number | null
    circulatingSupply: number | null
    totalSupply: number | null
    maxSupply: number | null
    ath: number | null
    atl: number | null
  }

  export type CryptocurrencySumAggregateOutputType = {
    currentPrice: number | null
    marketCap: number | null
    marketCapRank: number | null
    totalVolume: number | null
    high24h: number | null
    low24h: number | null
    priceChange24h: number | null
    priceChangePercentage24h: number | null
    circulatingSupply: number | null
    totalSupply: number | null
    maxSupply: number | null
    ath: number | null
    atl: number | null
  }

  export type CryptocurrencyMinAggregateOutputType = {
    id: string | null
    coingeckoId: string | null
    symbol: string | null
    name: string | null
    currentPrice: number | null
    marketCap: number | null
    marketCapRank: number | null
    totalVolume: number | null
    high24h: number | null
    low24h: number | null
    priceChange24h: number | null
    priceChangePercentage24h: number | null
    circulatingSupply: number | null
    totalSupply: number | null
    maxSupply: number | null
    ath: number | null
    athDate: Date | null
    atl: number | null
    atlDate: Date | null
    description: string | null
    homepage: string | null
    whitepaper: string | null
    blockchain: string | null
    socialLinks: string | null
    imageSmall: string | null
    imageLarge: string | null
    slug: string | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type CryptocurrencyMaxAggregateOutputType = {
    id: string | null
    coingeckoId: string | null
    symbol: string | null
    name: string | null
    currentPrice: number | null
    marketCap: number | null
    marketCapRank: number | null
    totalVolume: number | null
    high24h: number | null
    low24h: number | null
    priceChange24h: number | null
    priceChangePercentage24h: number | null
    circulatingSupply: number | null
    totalSupply: number | null
    maxSupply: number | null
    ath: number | null
    athDate: Date | null
    atl: number | null
    atlDate: Date | null
    description: string | null
    homepage: string | null
    whitepaper: string | null
    blockchain: string | null
    socialLinks: string | null
    imageSmall: string | null
    imageLarge: string | null
    slug: string | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type CryptocurrencyCountAggregateOutputType = {
    id: number
    coingeckoId: number
    symbol: number
    name: number
    currentPrice: number
    marketCap: number
    marketCapRank: number
    totalVolume: number
    high24h: number
    low24h: number
    priceChange24h: number
    priceChangePercentage24h: number
    circulatingSupply: number
    totalSupply: number
    maxSupply: number
    ath: number
    athDate: number
    atl: number
    atlDate: number
    description: number
    homepage: number
    whitepaper: number
    blockchain: number
    socialLinks: number
    imageSmall: number
    imageLarge: number
    slug: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type CryptocurrencyAvgAggregateInputType = {
    currentPrice?: true
    marketCap?: true
    marketCapRank?: true
    totalVolume?: true
    high24h?: true
    low24h?: true
    priceChange24h?: true
    priceChangePercentage24h?: true
    circulatingSupply?: true
    totalSupply?: true
    maxSupply?: true
    ath?: true
    atl?: true
  }

  export type CryptocurrencySumAggregateInputType = {
    currentPrice?: true
    marketCap?: true
    marketCapRank?: true
    totalVolume?: true
    high24h?: true
    low24h?: true
    priceChange24h?: true
    priceChangePercentage24h?: true
    circulatingSupply?: true
    totalSupply?: true
    maxSupply?: true
    ath?: true
    atl?: true
  }

  export type CryptocurrencyMinAggregateInputType = {
    id?: true
    coingeckoId?: true
    symbol?: true
    name?: true
    currentPrice?: true
    marketCap?: true
    marketCapRank?: true
    totalVolume?: true
    high24h?: true
    low24h?: true
    priceChange24h?: true
    priceChangePercentage24h?: true
    circulatingSupply?: true
    totalSupply?: true
    maxSupply?: true
    ath?: true
    athDate?: true
    atl?: true
    atlDate?: true
    description?: true
    homepage?: true
    whitepaper?: true
    blockchain?: true
    socialLinks?: true
    imageSmall?: true
    imageLarge?: true
    slug?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type CryptocurrencyMaxAggregateInputType = {
    id?: true
    coingeckoId?: true
    symbol?: true
    name?: true
    currentPrice?: true
    marketCap?: true
    marketCapRank?: true
    totalVolume?: true
    high24h?: true
    low24h?: true
    priceChange24h?: true
    priceChangePercentage24h?: true
    circulatingSupply?: true
    totalSupply?: true
    maxSupply?: true
    ath?: true
    athDate?: true
    atl?: true
    atlDate?: true
    description?: true
    homepage?: true
    whitepaper?: true
    blockchain?: true
    socialLinks?: true
    imageSmall?: true
    imageLarge?: true
    slug?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type CryptocurrencyCountAggregateInputType = {
    id?: true
    coingeckoId?: true
    symbol?: true
    name?: true
    currentPrice?: true
    marketCap?: true
    marketCapRank?: true
    totalVolume?: true
    high24h?: true
    low24h?: true
    priceChange24h?: true
    priceChangePercentage24h?: true
    circulatingSupply?: true
    totalSupply?: true
    maxSupply?: true
    ath?: true
    athDate?: true
    atl?: true
    atlDate?: true
    description?: true
    homepage?: true
    whitepaper?: true
    blockchain?: true
    socialLinks?: true
    imageSmall?: true
    imageLarge?: true
    slug?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type CryptocurrencyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cryptocurrency to aggregate.
     */
    where?: CryptocurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cryptocurrencies to fetch.
     */
    orderBy?: CryptocurrencyOrderByWithRelationInput | CryptocurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CryptocurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cryptocurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cryptocurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cryptocurrencies
    **/
    _count?: true | CryptocurrencyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CryptocurrencyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CryptocurrencySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CryptocurrencyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CryptocurrencyMaxAggregateInputType
  }

  export type GetCryptocurrencyAggregateType<T extends CryptocurrencyAggregateArgs> = {
        [P in keyof T & keyof AggregateCryptocurrency]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCryptocurrency[P]>
      : GetScalarType<T[P], AggregateCryptocurrency[P]>
  }




  export type CryptocurrencyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CryptocurrencyWhereInput
    orderBy?: CryptocurrencyOrderByWithAggregationInput | CryptocurrencyOrderByWithAggregationInput[]
    by: CryptocurrencyScalarFieldEnum[] | CryptocurrencyScalarFieldEnum
    having?: CryptocurrencyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CryptocurrencyCountAggregateInputType | true
    _avg?: CryptocurrencyAvgAggregateInputType
    _sum?: CryptocurrencySumAggregateInputType
    _min?: CryptocurrencyMinAggregateInputType
    _max?: CryptocurrencyMaxAggregateInputType
  }

  export type CryptocurrencyGroupByOutputType = {
    id: string
    coingeckoId: string
    symbol: string
    name: string
    currentPrice: number | null
    marketCap: number | null
    marketCapRank: number | null
    totalVolume: number | null
    high24h: number | null
    low24h: number | null
    priceChange24h: number | null
    priceChangePercentage24h: number | null
    circulatingSupply: number | null
    totalSupply: number | null
    maxSupply: number | null
    ath: number | null
    athDate: Date | null
    atl: number | null
    atlDate: Date | null
    description: string | null
    homepage: string | null
    whitepaper: string | null
    blockchain: string | null
    socialLinks: string | null
    imageSmall: string | null
    imageLarge: string | null
    slug: string | null
    lastUpdated: Date
    createdAt: Date
    _count: CryptocurrencyCountAggregateOutputType | null
    _avg: CryptocurrencyAvgAggregateOutputType | null
    _sum: CryptocurrencySumAggregateOutputType | null
    _min: CryptocurrencyMinAggregateOutputType | null
    _max: CryptocurrencyMaxAggregateOutputType | null
  }

  type GetCryptocurrencyGroupByPayload<T extends CryptocurrencyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CryptocurrencyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CryptocurrencyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CryptocurrencyGroupByOutputType[P]>
            : GetScalarType<T[P], CryptocurrencyGroupByOutputType[P]>
        }
      >
    >


  export type CryptocurrencySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    coingeckoId?: boolean
    symbol?: boolean
    name?: boolean
    currentPrice?: boolean
    marketCap?: boolean
    marketCapRank?: boolean
    totalVolume?: boolean
    high24h?: boolean
    low24h?: boolean
    priceChange24h?: boolean
    priceChangePercentage24h?: boolean
    circulatingSupply?: boolean
    totalSupply?: boolean
    maxSupply?: boolean
    ath?: boolean
    athDate?: boolean
    atl?: boolean
    atlDate?: boolean
    description?: boolean
    homepage?: boolean
    whitepaper?: boolean
    blockchain?: boolean
    socialLinks?: boolean
    imageSmall?: boolean
    imageLarge?: boolean
    slug?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cryptocurrency"]>

  export type CryptocurrencySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    coingeckoId?: boolean
    symbol?: boolean
    name?: boolean
    currentPrice?: boolean
    marketCap?: boolean
    marketCapRank?: boolean
    totalVolume?: boolean
    high24h?: boolean
    low24h?: boolean
    priceChange24h?: boolean
    priceChangePercentage24h?: boolean
    circulatingSupply?: boolean
    totalSupply?: boolean
    maxSupply?: boolean
    ath?: boolean
    athDate?: boolean
    atl?: boolean
    atlDate?: boolean
    description?: boolean
    homepage?: boolean
    whitepaper?: boolean
    blockchain?: boolean
    socialLinks?: boolean
    imageSmall?: boolean
    imageLarge?: boolean
    slug?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cryptocurrency"]>

  export type CryptocurrencySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    coingeckoId?: boolean
    symbol?: boolean
    name?: boolean
    currentPrice?: boolean
    marketCap?: boolean
    marketCapRank?: boolean
    totalVolume?: boolean
    high24h?: boolean
    low24h?: boolean
    priceChange24h?: boolean
    priceChangePercentage24h?: boolean
    circulatingSupply?: boolean
    totalSupply?: boolean
    maxSupply?: boolean
    ath?: boolean
    athDate?: boolean
    atl?: boolean
    atlDate?: boolean
    description?: boolean
    homepage?: boolean
    whitepaper?: boolean
    blockchain?: boolean
    socialLinks?: boolean
    imageSmall?: boolean
    imageLarge?: boolean
    slug?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cryptocurrency"]>

  export type CryptocurrencySelectScalar = {
    id?: boolean
    coingeckoId?: boolean
    symbol?: boolean
    name?: boolean
    currentPrice?: boolean
    marketCap?: boolean
    marketCapRank?: boolean
    totalVolume?: boolean
    high24h?: boolean
    low24h?: boolean
    priceChange24h?: boolean
    priceChangePercentage24h?: boolean
    circulatingSupply?: boolean
    totalSupply?: boolean
    maxSupply?: boolean
    ath?: boolean
    athDate?: boolean
    atl?: boolean
    atlDate?: boolean
    description?: boolean
    homepage?: boolean
    whitepaper?: boolean
    blockchain?: boolean
    socialLinks?: boolean
    imageSmall?: boolean
    imageLarge?: boolean
    slug?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }

  export type CryptocurrencyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "coingeckoId" | "symbol" | "name" | "currentPrice" | "marketCap" | "marketCapRank" | "totalVolume" | "high24h" | "low24h" | "priceChange24h" | "priceChangePercentage24h" | "circulatingSupply" | "totalSupply" | "maxSupply" | "ath" | "athDate" | "atl" | "atlDate" | "description" | "homepage" | "whitepaper" | "blockchain" | "socialLinks" | "imageSmall" | "imageLarge" | "slug" | "lastUpdated" | "createdAt", ExtArgs["result"]["cryptocurrency"]>

  export type $CryptocurrencyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cryptocurrency"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      coingeckoId: string
      symbol: string
      name: string
      currentPrice: number | null
      marketCap: number | null
      marketCapRank: number | null
      totalVolume: number | null
      high24h: number | null
      low24h: number | null
      priceChange24h: number | null
      priceChangePercentage24h: number | null
      circulatingSupply: number | null
      totalSupply: number | null
      maxSupply: number | null
      ath: number | null
      athDate: Date | null
      atl: number | null
      atlDate: Date | null
      description: string | null
      homepage: string | null
      whitepaper: string | null
      blockchain: string | null
      socialLinks: string | null
      imageSmall: string | null
      imageLarge: string | null
      slug: string | null
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["cryptocurrency"]>
    composites: {}
  }

  type CryptocurrencyGetPayload<S extends boolean | null | undefined | CryptocurrencyDefaultArgs> = $Result.GetResult<Prisma.$CryptocurrencyPayload, S>

  type CryptocurrencyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CryptocurrencyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CryptocurrencyCountAggregateInputType | true
    }

  export interface CryptocurrencyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cryptocurrency'], meta: { name: 'Cryptocurrency' } }
    /**
     * Find zero or one Cryptocurrency that matches the filter.
     * @param {CryptocurrencyFindUniqueArgs} args - Arguments to find a Cryptocurrency
     * @example
     * // Get one Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CryptocurrencyFindUniqueArgs>(args: SelectSubset<T, CryptocurrencyFindUniqueArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cryptocurrency that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CryptocurrencyFindUniqueOrThrowArgs} args - Arguments to find a Cryptocurrency
     * @example
     * // Get one Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CryptocurrencyFindUniqueOrThrowArgs>(args: SelectSubset<T, CryptocurrencyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cryptocurrency that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyFindFirstArgs} args - Arguments to find a Cryptocurrency
     * @example
     * // Get one Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CryptocurrencyFindFirstArgs>(args?: SelectSubset<T, CryptocurrencyFindFirstArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cryptocurrency that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyFindFirstOrThrowArgs} args - Arguments to find a Cryptocurrency
     * @example
     * // Get one Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CryptocurrencyFindFirstOrThrowArgs>(args?: SelectSubset<T, CryptocurrencyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cryptocurrencies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cryptocurrencies
     * const cryptocurrencies = await prisma.cryptocurrency.findMany()
     * 
     * // Get first 10 Cryptocurrencies
     * const cryptocurrencies = await prisma.cryptocurrency.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cryptocurrencyWithIdOnly = await prisma.cryptocurrency.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CryptocurrencyFindManyArgs>(args?: SelectSubset<T, CryptocurrencyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cryptocurrency.
     * @param {CryptocurrencyCreateArgs} args - Arguments to create a Cryptocurrency.
     * @example
     * // Create one Cryptocurrency
     * const Cryptocurrency = await prisma.cryptocurrency.create({
     *   data: {
     *     // ... data to create a Cryptocurrency
     *   }
     * })
     * 
     */
    create<T extends CryptocurrencyCreateArgs>(args: SelectSubset<T, CryptocurrencyCreateArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cryptocurrencies.
     * @param {CryptocurrencyCreateManyArgs} args - Arguments to create many Cryptocurrencies.
     * @example
     * // Create many Cryptocurrencies
     * const cryptocurrency = await prisma.cryptocurrency.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CryptocurrencyCreateManyArgs>(args?: SelectSubset<T, CryptocurrencyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cryptocurrencies and returns the data saved in the database.
     * @param {CryptocurrencyCreateManyAndReturnArgs} args - Arguments to create many Cryptocurrencies.
     * @example
     * // Create many Cryptocurrencies
     * const cryptocurrency = await prisma.cryptocurrency.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cryptocurrencies and only return the `id`
     * const cryptocurrencyWithIdOnly = await prisma.cryptocurrency.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CryptocurrencyCreateManyAndReturnArgs>(args?: SelectSubset<T, CryptocurrencyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cryptocurrency.
     * @param {CryptocurrencyDeleteArgs} args - Arguments to delete one Cryptocurrency.
     * @example
     * // Delete one Cryptocurrency
     * const Cryptocurrency = await prisma.cryptocurrency.delete({
     *   where: {
     *     // ... filter to delete one Cryptocurrency
     *   }
     * })
     * 
     */
    delete<T extends CryptocurrencyDeleteArgs>(args: SelectSubset<T, CryptocurrencyDeleteArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cryptocurrency.
     * @param {CryptocurrencyUpdateArgs} args - Arguments to update one Cryptocurrency.
     * @example
     * // Update one Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CryptocurrencyUpdateArgs>(args: SelectSubset<T, CryptocurrencyUpdateArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cryptocurrencies.
     * @param {CryptocurrencyDeleteManyArgs} args - Arguments to filter Cryptocurrencies to delete.
     * @example
     * // Delete a few Cryptocurrencies
     * const { count } = await prisma.cryptocurrency.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CryptocurrencyDeleteManyArgs>(args?: SelectSubset<T, CryptocurrencyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cryptocurrencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cryptocurrencies
     * const cryptocurrency = await prisma.cryptocurrency.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CryptocurrencyUpdateManyArgs>(args: SelectSubset<T, CryptocurrencyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cryptocurrencies and returns the data updated in the database.
     * @param {CryptocurrencyUpdateManyAndReturnArgs} args - Arguments to update many Cryptocurrencies.
     * @example
     * // Update many Cryptocurrencies
     * const cryptocurrency = await prisma.cryptocurrency.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cryptocurrencies and only return the `id`
     * const cryptocurrencyWithIdOnly = await prisma.cryptocurrency.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CryptocurrencyUpdateManyAndReturnArgs>(args: SelectSubset<T, CryptocurrencyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cryptocurrency.
     * @param {CryptocurrencyUpsertArgs} args - Arguments to update or create a Cryptocurrency.
     * @example
     * // Update or create a Cryptocurrency
     * const cryptocurrency = await prisma.cryptocurrency.upsert({
     *   create: {
     *     // ... data to create a Cryptocurrency
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cryptocurrency we want to update
     *   }
     * })
     */
    upsert<T extends CryptocurrencyUpsertArgs>(args: SelectSubset<T, CryptocurrencyUpsertArgs<ExtArgs>>): Prisma__CryptocurrencyClient<$Result.GetResult<Prisma.$CryptocurrencyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cryptocurrencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyCountArgs} args - Arguments to filter Cryptocurrencies to count.
     * @example
     * // Count the number of Cryptocurrencies
     * const count = await prisma.cryptocurrency.count({
     *   where: {
     *     // ... the filter for the Cryptocurrencies we want to count
     *   }
     * })
    **/
    count<T extends CryptocurrencyCountArgs>(
      args?: Subset<T, CryptocurrencyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CryptocurrencyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cryptocurrency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CryptocurrencyAggregateArgs>(args: Subset<T, CryptocurrencyAggregateArgs>): Prisma.PrismaPromise<GetCryptocurrencyAggregateType<T>>

    /**
     * Group by Cryptocurrency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CryptocurrencyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CryptocurrencyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CryptocurrencyGroupByArgs['orderBy'] }
        : { orderBy?: CryptocurrencyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CryptocurrencyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCryptocurrencyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cryptocurrency model
   */
  readonly fields: CryptocurrencyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cryptocurrency.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CryptocurrencyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cryptocurrency model
   */
  interface CryptocurrencyFieldRefs {
    readonly id: FieldRef<"Cryptocurrency", 'String'>
    readonly coingeckoId: FieldRef<"Cryptocurrency", 'String'>
    readonly symbol: FieldRef<"Cryptocurrency", 'String'>
    readonly name: FieldRef<"Cryptocurrency", 'String'>
    readonly currentPrice: FieldRef<"Cryptocurrency", 'Float'>
    readonly marketCap: FieldRef<"Cryptocurrency", 'Float'>
    readonly marketCapRank: FieldRef<"Cryptocurrency", 'Int'>
    readonly totalVolume: FieldRef<"Cryptocurrency", 'Float'>
    readonly high24h: FieldRef<"Cryptocurrency", 'Float'>
    readonly low24h: FieldRef<"Cryptocurrency", 'Float'>
    readonly priceChange24h: FieldRef<"Cryptocurrency", 'Float'>
    readonly priceChangePercentage24h: FieldRef<"Cryptocurrency", 'Float'>
    readonly circulatingSupply: FieldRef<"Cryptocurrency", 'Float'>
    readonly totalSupply: FieldRef<"Cryptocurrency", 'Float'>
    readonly maxSupply: FieldRef<"Cryptocurrency", 'Float'>
    readonly ath: FieldRef<"Cryptocurrency", 'Float'>
    readonly athDate: FieldRef<"Cryptocurrency", 'DateTime'>
    readonly atl: FieldRef<"Cryptocurrency", 'Float'>
    readonly atlDate: FieldRef<"Cryptocurrency", 'DateTime'>
    readonly description: FieldRef<"Cryptocurrency", 'String'>
    readonly homepage: FieldRef<"Cryptocurrency", 'String'>
    readonly whitepaper: FieldRef<"Cryptocurrency", 'String'>
    readonly blockchain: FieldRef<"Cryptocurrency", 'String'>
    readonly socialLinks: FieldRef<"Cryptocurrency", 'String'>
    readonly imageSmall: FieldRef<"Cryptocurrency", 'String'>
    readonly imageLarge: FieldRef<"Cryptocurrency", 'String'>
    readonly slug: FieldRef<"Cryptocurrency", 'String'>
    readonly lastUpdated: FieldRef<"Cryptocurrency", 'DateTime'>
    readonly createdAt: FieldRef<"Cryptocurrency", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cryptocurrency findUnique
   */
  export type CryptocurrencyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter, which Cryptocurrency to fetch.
     */
    where: CryptocurrencyWhereUniqueInput
  }

  /**
   * Cryptocurrency findUniqueOrThrow
   */
  export type CryptocurrencyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter, which Cryptocurrency to fetch.
     */
    where: CryptocurrencyWhereUniqueInput
  }

  /**
   * Cryptocurrency findFirst
   */
  export type CryptocurrencyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter, which Cryptocurrency to fetch.
     */
    where?: CryptocurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cryptocurrencies to fetch.
     */
    orderBy?: CryptocurrencyOrderByWithRelationInput | CryptocurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cryptocurrencies.
     */
    cursor?: CryptocurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cryptocurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cryptocurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cryptocurrencies.
     */
    distinct?: CryptocurrencyScalarFieldEnum | CryptocurrencyScalarFieldEnum[]
  }

  /**
   * Cryptocurrency findFirstOrThrow
   */
  export type CryptocurrencyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter, which Cryptocurrency to fetch.
     */
    where?: CryptocurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cryptocurrencies to fetch.
     */
    orderBy?: CryptocurrencyOrderByWithRelationInput | CryptocurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cryptocurrencies.
     */
    cursor?: CryptocurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cryptocurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cryptocurrencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cryptocurrencies.
     */
    distinct?: CryptocurrencyScalarFieldEnum | CryptocurrencyScalarFieldEnum[]
  }

  /**
   * Cryptocurrency findMany
   */
  export type CryptocurrencyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter, which Cryptocurrencies to fetch.
     */
    where?: CryptocurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cryptocurrencies to fetch.
     */
    orderBy?: CryptocurrencyOrderByWithRelationInput | CryptocurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cryptocurrencies.
     */
    cursor?: CryptocurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cryptocurrencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cryptocurrencies.
     */
    skip?: number
    distinct?: CryptocurrencyScalarFieldEnum | CryptocurrencyScalarFieldEnum[]
  }

  /**
   * Cryptocurrency create
   */
  export type CryptocurrencyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * The data needed to create a Cryptocurrency.
     */
    data: XOR<CryptocurrencyCreateInput, CryptocurrencyUncheckedCreateInput>
  }

  /**
   * Cryptocurrency createMany
   */
  export type CryptocurrencyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cryptocurrencies.
     */
    data: CryptocurrencyCreateManyInput | CryptocurrencyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cryptocurrency createManyAndReturn
   */
  export type CryptocurrencyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * The data used to create many Cryptocurrencies.
     */
    data: CryptocurrencyCreateManyInput | CryptocurrencyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cryptocurrency update
   */
  export type CryptocurrencyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * The data needed to update a Cryptocurrency.
     */
    data: XOR<CryptocurrencyUpdateInput, CryptocurrencyUncheckedUpdateInput>
    /**
     * Choose, which Cryptocurrency to update.
     */
    where: CryptocurrencyWhereUniqueInput
  }

  /**
   * Cryptocurrency updateMany
   */
  export type CryptocurrencyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cryptocurrencies.
     */
    data: XOR<CryptocurrencyUpdateManyMutationInput, CryptocurrencyUncheckedUpdateManyInput>
    /**
     * Filter which Cryptocurrencies to update
     */
    where?: CryptocurrencyWhereInput
    /**
     * Limit how many Cryptocurrencies to update.
     */
    limit?: number
  }

  /**
   * Cryptocurrency updateManyAndReturn
   */
  export type CryptocurrencyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * The data used to update Cryptocurrencies.
     */
    data: XOR<CryptocurrencyUpdateManyMutationInput, CryptocurrencyUncheckedUpdateManyInput>
    /**
     * Filter which Cryptocurrencies to update
     */
    where?: CryptocurrencyWhereInput
    /**
     * Limit how many Cryptocurrencies to update.
     */
    limit?: number
  }

  /**
   * Cryptocurrency upsert
   */
  export type CryptocurrencyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * The filter to search for the Cryptocurrency to update in case it exists.
     */
    where: CryptocurrencyWhereUniqueInput
    /**
     * In case the Cryptocurrency found by the `where` argument doesn't exist, create a new Cryptocurrency with this data.
     */
    create: XOR<CryptocurrencyCreateInput, CryptocurrencyUncheckedCreateInput>
    /**
     * In case the Cryptocurrency was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CryptocurrencyUpdateInput, CryptocurrencyUncheckedUpdateInput>
  }

  /**
   * Cryptocurrency delete
   */
  export type CryptocurrencyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
    /**
     * Filter which Cryptocurrency to delete.
     */
    where: CryptocurrencyWhereUniqueInput
  }

  /**
   * Cryptocurrency deleteMany
   */
  export type CryptocurrencyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cryptocurrencies to delete
     */
    where?: CryptocurrencyWhereInput
    /**
     * Limit how many Cryptocurrencies to delete.
     */
    limit?: number
  }

  /**
   * Cryptocurrency without action
   */
  export type CryptocurrencyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cryptocurrency
     */
    select?: CryptocurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cryptocurrency
     */
    omit?: CryptocurrencyOmit<ExtArgs> | null
  }


  /**
   * Model CopilotActivity
   */

  export type AggregateCopilotActivity = {
    _count: CopilotActivityCountAggregateOutputType | null
    _min: CopilotActivityMinAggregateOutputType | null
    _max: CopilotActivityMaxAggregateOutputType | null
  }

  export type CopilotActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    parameters: string | null
    result: string | null
    status: string | null
    requiresConfirmation: boolean | null
    confirmed: boolean | null
    confirmedAt: Date | null
    createdAt: Date | null
  }

  export type CopilotActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    parameters: string | null
    result: string | null
    status: string | null
    requiresConfirmation: boolean | null
    confirmed: boolean | null
    confirmedAt: Date | null
    createdAt: Date | null
  }

  export type CopilotActivityCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    parameters: number
    result: number
    status: number
    requiresConfirmation: number
    confirmed: number
    confirmedAt: number
    createdAt: number
    _all: number
  }


  export type CopilotActivityMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    parameters?: true
    result?: true
    status?: true
    requiresConfirmation?: true
    confirmed?: true
    confirmedAt?: true
    createdAt?: true
  }

  export type CopilotActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    parameters?: true
    result?: true
    status?: true
    requiresConfirmation?: true
    confirmed?: true
    confirmedAt?: true
    createdAt?: true
  }

  export type CopilotActivityCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    parameters?: true
    result?: true
    status?: true
    requiresConfirmation?: true
    confirmed?: true
    confirmedAt?: true
    createdAt?: true
    _all?: true
  }

  export type CopilotActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CopilotActivity to aggregate.
     */
    where?: CopilotActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotActivities to fetch.
     */
    orderBy?: CopilotActivityOrderByWithRelationInput | CopilotActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CopilotActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CopilotActivities
    **/
    _count?: true | CopilotActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CopilotActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CopilotActivityMaxAggregateInputType
  }

  export type GetCopilotActivityAggregateType<T extends CopilotActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateCopilotActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCopilotActivity[P]>
      : GetScalarType<T[P], AggregateCopilotActivity[P]>
  }




  export type CopilotActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CopilotActivityWhereInput
    orderBy?: CopilotActivityOrderByWithAggregationInput | CopilotActivityOrderByWithAggregationInput[]
    by: CopilotActivityScalarFieldEnum[] | CopilotActivityScalarFieldEnum
    having?: CopilotActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CopilotActivityCountAggregateInputType | true
    _min?: CopilotActivityMinAggregateInputType
    _max?: CopilotActivityMaxAggregateInputType
  }

  export type CopilotActivityGroupByOutputType = {
    id: string
    userId: string
    action: string
    parameters: string
    result: string | null
    status: string
    requiresConfirmation: boolean
    confirmed: boolean
    confirmedAt: Date | null
    createdAt: Date
    _count: CopilotActivityCountAggregateOutputType | null
    _min: CopilotActivityMinAggregateOutputType | null
    _max: CopilotActivityMaxAggregateOutputType | null
  }

  type GetCopilotActivityGroupByPayload<T extends CopilotActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CopilotActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CopilotActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CopilotActivityGroupByOutputType[P]>
            : GetScalarType<T[P], CopilotActivityGroupByOutputType[P]>
        }
      >
    >


  export type CopilotActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    parameters?: boolean
    result?: boolean
    status?: boolean
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["copilotActivity"]>

  export type CopilotActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    parameters?: boolean
    result?: boolean
    status?: boolean
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["copilotActivity"]>

  export type CopilotActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    parameters?: boolean
    result?: boolean
    status?: boolean
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["copilotActivity"]>

  export type CopilotActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    parameters?: boolean
    result?: boolean
    status?: boolean
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: boolean
    createdAt?: boolean
  }

  export type CopilotActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "parameters" | "result" | "status" | "requiresConfirmation" | "confirmed" | "confirmedAt" | "createdAt", ExtArgs["result"]["copilotActivity"]>
  export type CopilotActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CopilotActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CopilotActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CopilotActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CopilotActivity"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      action: string
      parameters: string
      result: string | null
      status: string
      requiresConfirmation: boolean
      confirmed: boolean
      confirmedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["copilotActivity"]>
    composites: {}
  }

  type CopilotActivityGetPayload<S extends boolean | null | undefined | CopilotActivityDefaultArgs> = $Result.GetResult<Prisma.$CopilotActivityPayload, S>

  type CopilotActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CopilotActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CopilotActivityCountAggregateInputType | true
    }

  export interface CopilotActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CopilotActivity'], meta: { name: 'CopilotActivity' } }
    /**
     * Find zero or one CopilotActivity that matches the filter.
     * @param {CopilotActivityFindUniqueArgs} args - Arguments to find a CopilotActivity
     * @example
     * // Get one CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CopilotActivityFindUniqueArgs>(args: SelectSubset<T, CopilotActivityFindUniqueArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CopilotActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CopilotActivityFindUniqueOrThrowArgs} args - Arguments to find a CopilotActivity
     * @example
     * // Get one CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CopilotActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, CopilotActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CopilotActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityFindFirstArgs} args - Arguments to find a CopilotActivity
     * @example
     * // Get one CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CopilotActivityFindFirstArgs>(args?: SelectSubset<T, CopilotActivityFindFirstArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CopilotActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityFindFirstOrThrowArgs} args - Arguments to find a CopilotActivity
     * @example
     * // Get one CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CopilotActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, CopilotActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CopilotActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CopilotActivities
     * const copilotActivities = await prisma.copilotActivity.findMany()
     * 
     * // Get first 10 CopilotActivities
     * const copilotActivities = await prisma.copilotActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const copilotActivityWithIdOnly = await prisma.copilotActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CopilotActivityFindManyArgs>(args?: SelectSubset<T, CopilotActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CopilotActivity.
     * @param {CopilotActivityCreateArgs} args - Arguments to create a CopilotActivity.
     * @example
     * // Create one CopilotActivity
     * const CopilotActivity = await prisma.copilotActivity.create({
     *   data: {
     *     // ... data to create a CopilotActivity
     *   }
     * })
     * 
     */
    create<T extends CopilotActivityCreateArgs>(args: SelectSubset<T, CopilotActivityCreateArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CopilotActivities.
     * @param {CopilotActivityCreateManyArgs} args - Arguments to create many CopilotActivities.
     * @example
     * // Create many CopilotActivities
     * const copilotActivity = await prisma.copilotActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CopilotActivityCreateManyArgs>(args?: SelectSubset<T, CopilotActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CopilotActivities and returns the data saved in the database.
     * @param {CopilotActivityCreateManyAndReturnArgs} args - Arguments to create many CopilotActivities.
     * @example
     * // Create many CopilotActivities
     * const copilotActivity = await prisma.copilotActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CopilotActivities and only return the `id`
     * const copilotActivityWithIdOnly = await prisma.copilotActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CopilotActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, CopilotActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CopilotActivity.
     * @param {CopilotActivityDeleteArgs} args - Arguments to delete one CopilotActivity.
     * @example
     * // Delete one CopilotActivity
     * const CopilotActivity = await prisma.copilotActivity.delete({
     *   where: {
     *     // ... filter to delete one CopilotActivity
     *   }
     * })
     * 
     */
    delete<T extends CopilotActivityDeleteArgs>(args: SelectSubset<T, CopilotActivityDeleteArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CopilotActivity.
     * @param {CopilotActivityUpdateArgs} args - Arguments to update one CopilotActivity.
     * @example
     * // Update one CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CopilotActivityUpdateArgs>(args: SelectSubset<T, CopilotActivityUpdateArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CopilotActivities.
     * @param {CopilotActivityDeleteManyArgs} args - Arguments to filter CopilotActivities to delete.
     * @example
     * // Delete a few CopilotActivities
     * const { count } = await prisma.copilotActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CopilotActivityDeleteManyArgs>(args?: SelectSubset<T, CopilotActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CopilotActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CopilotActivities
     * const copilotActivity = await prisma.copilotActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CopilotActivityUpdateManyArgs>(args: SelectSubset<T, CopilotActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CopilotActivities and returns the data updated in the database.
     * @param {CopilotActivityUpdateManyAndReturnArgs} args - Arguments to update many CopilotActivities.
     * @example
     * // Update many CopilotActivities
     * const copilotActivity = await prisma.copilotActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CopilotActivities and only return the `id`
     * const copilotActivityWithIdOnly = await prisma.copilotActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CopilotActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, CopilotActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CopilotActivity.
     * @param {CopilotActivityUpsertArgs} args - Arguments to update or create a CopilotActivity.
     * @example
     * // Update or create a CopilotActivity
     * const copilotActivity = await prisma.copilotActivity.upsert({
     *   create: {
     *     // ... data to create a CopilotActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CopilotActivity we want to update
     *   }
     * })
     */
    upsert<T extends CopilotActivityUpsertArgs>(args: SelectSubset<T, CopilotActivityUpsertArgs<ExtArgs>>): Prisma__CopilotActivityClient<$Result.GetResult<Prisma.$CopilotActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CopilotActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityCountArgs} args - Arguments to filter CopilotActivities to count.
     * @example
     * // Count the number of CopilotActivities
     * const count = await prisma.copilotActivity.count({
     *   where: {
     *     // ... the filter for the CopilotActivities we want to count
     *   }
     * })
    **/
    count<T extends CopilotActivityCountArgs>(
      args?: Subset<T, CopilotActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CopilotActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CopilotActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CopilotActivityAggregateArgs>(args: Subset<T, CopilotActivityAggregateArgs>): Prisma.PrismaPromise<GetCopilotActivityAggregateType<T>>

    /**
     * Group by CopilotActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CopilotActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CopilotActivityGroupByArgs['orderBy'] }
        : { orderBy?: CopilotActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CopilotActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCopilotActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CopilotActivity model
   */
  readonly fields: CopilotActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CopilotActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CopilotActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CopilotActivity model
   */
  interface CopilotActivityFieldRefs {
    readonly id: FieldRef<"CopilotActivity", 'String'>
    readonly userId: FieldRef<"CopilotActivity", 'String'>
    readonly action: FieldRef<"CopilotActivity", 'String'>
    readonly parameters: FieldRef<"CopilotActivity", 'String'>
    readonly result: FieldRef<"CopilotActivity", 'String'>
    readonly status: FieldRef<"CopilotActivity", 'String'>
    readonly requiresConfirmation: FieldRef<"CopilotActivity", 'Boolean'>
    readonly confirmed: FieldRef<"CopilotActivity", 'Boolean'>
    readonly confirmedAt: FieldRef<"CopilotActivity", 'DateTime'>
    readonly createdAt: FieldRef<"CopilotActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CopilotActivity findUnique
   */
  export type CopilotActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter, which CopilotActivity to fetch.
     */
    where: CopilotActivityWhereUniqueInput
  }

  /**
   * CopilotActivity findUniqueOrThrow
   */
  export type CopilotActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter, which CopilotActivity to fetch.
     */
    where: CopilotActivityWhereUniqueInput
  }

  /**
   * CopilotActivity findFirst
   */
  export type CopilotActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter, which CopilotActivity to fetch.
     */
    where?: CopilotActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotActivities to fetch.
     */
    orderBy?: CopilotActivityOrderByWithRelationInput | CopilotActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CopilotActivities.
     */
    cursor?: CopilotActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CopilotActivities.
     */
    distinct?: CopilotActivityScalarFieldEnum | CopilotActivityScalarFieldEnum[]
  }

  /**
   * CopilotActivity findFirstOrThrow
   */
  export type CopilotActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter, which CopilotActivity to fetch.
     */
    where?: CopilotActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotActivities to fetch.
     */
    orderBy?: CopilotActivityOrderByWithRelationInput | CopilotActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CopilotActivities.
     */
    cursor?: CopilotActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CopilotActivities.
     */
    distinct?: CopilotActivityScalarFieldEnum | CopilotActivityScalarFieldEnum[]
  }

  /**
   * CopilotActivity findMany
   */
  export type CopilotActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter, which CopilotActivities to fetch.
     */
    where?: CopilotActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotActivities to fetch.
     */
    orderBy?: CopilotActivityOrderByWithRelationInput | CopilotActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CopilotActivities.
     */
    cursor?: CopilotActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotActivities.
     */
    skip?: number
    distinct?: CopilotActivityScalarFieldEnum | CopilotActivityScalarFieldEnum[]
  }

  /**
   * CopilotActivity create
   */
  export type CopilotActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a CopilotActivity.
     */
    data: XOR<CopilotActivityCreateInput, CopilotActivityUncheckedCreateInput>
  }

  /**
   * CopilotActivity createMany
   */
  export type CopilotActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CopilotActivities.
     */
    data: CopilotActivityCreateManyInput | CopilotActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CopilotActivity createManyAndReturn
   */
  export type CopilotActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * The data used to create many CopilotActivities.
     */
    data: CopilotActivityCreateManyInput | CopilotActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CopilotActivity update
   */
  export type CopilotActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a CopilotActivity.
     */
    data: XOR<CopilotActivityUpdateInput, CopilotActivityUncheckedUpdateInput>
    /**
     * Choose, which CopilotActivity to update.
     */
    where: CopilotActivityWhereUniqueInput
  }

  /**
   * CopilotActivity updateMany
   */
  export type CopilotActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CopilotActivities.
     */
    data: XOR<CopilotActivityUpdateManyMutationInput, CopilotActivityUncheckedUpdateManyInput>
    /**
     * Filter which CopilotActivities to update
     */
    where?: CopilotActivityWhereInput
    /**
     * Limit how many CopilotActivities to update.
     */
    limit?: number
  }

  /**
   * CopilotActivity updateManyAndReturn
   */
  export type CopilotActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * The data used to update CopilotActivities.
     */
    data: XOR<CopilotActivityUpdateManyMutationInput, CopilotActivityUncheckedUpdateManyInput>
    /**
     * Filter which CopilotActivities to update
     */
    where?: CopilotActivityWhereInput
    /**
     * Limit how many CopilotActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CopilotActivity upsert
   */
  export type CopilotActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the CopilotActivity to update in case it exists.
     */
    where: CopilotActivityWhereUniqueInput
    /**
     * In case the CopilotActivity found by the `where` argument doesn't exist, create a new CopilotActivity with this data.
     */
    create: XOR<CopilotActivityCreateInput, CopilotActivityUncheckedCreateInput>
    /**
     * In case the CopilotActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CopilotActivityUpdateInput, CopilotActivityUncheckedUpdateInput>
  }

  /**
   * CopilotActivity delete
   */
  export type CopilotActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
    /**
     * Filter which CopilotActivity to delete.
     */
    where: CopilotActivityWhereUniqueInput
  }

  /**
   * CopilotActivity deleteMany
   */
  export type CopilotActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CopilotActivities to delete
     */
    where?: CopilotActivityWhereInput
    /**
     * Limit how many CopilotActivities to delete.
     */
    limit?: number
  }

  /**
   * CopilotActivity without action
   */
  export type CopilotActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotActivity
     */
    select?: CopilotActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotActivity
     */
    omit?: CopilotActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CopilotActivityInclude<ExtArgs> | null
  }


  /**
   * Model AutomationTask
   */

  export type AggregateAutomationTask = {
    _count: AutomationTaskCountAggregateOutputType | null
    _avg: AutomationTaskAvgAggregateOutputType | null
    _sum: AutomationTaskSumAggregateOutputType | null
    _min: AutomationTaskMinAggregateOutputType | null
    _max: AutomationTaskMaxAggregateOutputType | null
  }

  export type AutomationTaskAvgAggregateOutputType = {
    runCount: number | null
  }

  export type AutomationTaskSumAggregateOutputType = {
    runCount: number | null
  }

  export type AutomationTaskMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    schedule: string | null
    enabled: boolean | null
    lastRun: Date | null
    nextRun: Date | null
    runCount: number | null
    config: string | null
    lastResult: string | null
    lastStatus: string | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AutomationTaskMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    schedule: string | null
    enabled: boolean | null
    lastRun: Date | null
    nextRun: Date | null
    runCount: number | null
    config: string | null
    lastResult: string | null
    lastStatus: string | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AutomationTaskCountAggregateOutputType = {
    id: number
    name: number
    description: number
    type: number
    schedule: number
    enabled: number
    lastRun: number
    nextRun: number
    runCount: number
    config: number
    lastResult: number
    lastStatus: number
    lastError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AutomationTaskAvgAggregateInputType = {
    runCount?: true
  }

  export type AutomationTaskSumAggregateInputType = {
    runCount?: true
  }

  export type AutomationTaskMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    schedule?: true
    enabled?: true
    lastRun?: true
    nextRun?: true
    runCount?: true
    config?: true
    lastResult?: true
    lastStatus?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AutomationTaskMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    schedule?: true
    enabled?: true
    lastRun?: true
    nextRun?: true
    runCount?: true
    config?: true
    lastResult?: true
    lastStatus?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AutomationTaskCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    schedule?: true
    enabled?: true
    lastRun?: true
    nextRun?: true
    runCount?: true
    config?: true
    lastResult?: true
    lastStatus?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AutomationTaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutomationTask to aggregate.
     */
    where?: AutomationTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutomationTasks to fetch.
     */
    orderBy?: AutomationTaskOrderByWithRelationInput | AutomationTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AutomationTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutomationTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutomationTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AutomationTasks
    **/
    _count?: true | AutomationTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AutomationTaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AutomationTaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AutomationTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AutomationTaskMaxAggregateInputType
  }

  export type GetAutomationTaskAggregateType<T extends AutomationTaskAggregateArgs> = {
        [P in keyof T & keyof AggregateAutomationTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAutomationTask[P]>
      : GetScalarType<T[P], AggregateAutomationTask[P]>
  }




  export type AutomationTaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutomationTaskWhereInput
    orderBy?: AutomationTaskOrderByWithAggregationInput | AutomationTaskOrderByWithAggregationInput[]
    by: AutomationTaskScalarFieldEnum[] | AutomationTaskScalarFieldEnum
    having?: AutomationTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AutomationTaskCountAggregateInputType | true
    _avg?: AutomationTaskAvgAggregateInputType
    _sum?: AutomationTaskSumAggregateInputType
    _min?: AutomationTaskMinAggregateInputType
    _max?: AutomationTaskMaxAggregateInputType
  }

  export type AutomationTaskGroupByOutputType = {
    id: string
    name: string
    description: string | null
    type: string
    schedule: string | null
    enabled: boolean
    lastRun: Date | null
    nextRun: Date | null
    runCount: number
    config: string | null
    lastResult: string | null
    lastStatus: string | null
    lastError: string | null
    createdAt: Date
    updatedAt: Date
    _count: AutomationTaskCountAggregateOutputType | null
    _avg: AutomationTaskAvgAggregateOutputType | null
    _sum: AutomationTaskSumAggregateOutputType | null
    _min: AutomationTaskMinAggregateOutputType | null
    _max: AutomationTaskMaxAggregateOutputType | null
  }

  type GetAutomationTaskGroupByPayload<T extends AutomationTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AutomationTaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AutomationTaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AutomationTaskGroupByOutputType[P]>
            : GetScalarType<T[P], AutomationTaskGroupByOutputType[P]>
        }
      >
    >


  export type AutomationTaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    schedule?: boolean
    enabled?: boolean
    lastRun?: boolean
    nextRun?: boolean
    runCount?: boolean
    config?: boolean
    lastResult?: boolean
    lastStatus?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["automationTask"]>

  export type AutomationTaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    schedule?: boolean
    enabled?: boolean
    lastRun?: boolean
    nextRun?: boolean
    runCount?: boolean
    config?: boolean
    lastResult?: boolean
    lastStatus?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["automationTask"]>

  export type AutomationTaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    schedule?: boolean
    enabled?: boolean
    lastRun?: boolean
    nextRun?: boolean
    runCount?: boolean
    config?: boolean
    lastResult?: boolean
    lastStatus?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["automationTask"]>

  export type AutomationTaskSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    schedule?: boolean
    enabled?: boolean
    lastRun?: boolean
    nextRun?: boolean
    runCount?: boolean
    config?: boolean
    lastResult?: boolean
    lastStatus?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AutomationTaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "type" | "schedule" | "enabled" | "lastRun" | "nextRun" | "runCount" | "config" | "lastResult" | "lastStatus" | "lastError" | "createdAt" | "updatedAt", ExtArgs["result"]["automationTask"]>

  export type $AutomationTaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AutomationTask"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      type: string
      schedule: string | null
      enabled: boolean
      lastRun: Date | null
      nextRun: Date | null
      runCount: number
      config: string | null
      lastResult: string | null
      lastStatus: string | null
      lastError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["automationTask"]>
    composites: {}
  }

  type AutomationTaskGetPayload<S extends boolean | null | undefined | AutomationTaskDefaultArgs> = $Result.GetResult<Prisma.$AutomationTaskPayload, S>

  type AutomationTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AutomationTaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AutomationTaskCountAggregateInputType | true
    }

  export interface AutomationTaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AutomationTask'], meta: { name: 'AutomationTask' } }
    /**
     * Find zero or one AutomationTask that matches the filter.
     * @param {AutomationTaskFindUniqueArgs} args - Arguments to find a AutomationTask
     * @example
     * // Get one AutomationTask
     * const automationTask = await prisma.automationTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AutomationTaskFindUniqueArgs>(args: SelectSubset<T, AutomationTaskFindUniqueArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AutomationTask that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AutomationTaskFindUniqueOrThrowArgs} args - Arguments to find a AutomationTask
     * @example
     * // Get one AutomationTask
     * const automationTask = await prisma.automationTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AutomationTaskFindUniqueOrThrowArgs>(args: SelectSubset<T, AutomationTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutomationTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskFindFirstArgs} args - Arguments to find a AutomationTask
     * @example
     * // Get one AutomationTask
     * const automationTask = await prisma.automationTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AutomationTaskFindFirstArgs>(args?: SelectSubset<T, AutomationTaskFindFirstArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutomationTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskFindFirstOrThrowArgs} args - Arguments to find a AutomationTask
     * @example
     * // Get one AutomationTask
     * const automationTask = await prisma.automationTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AutomationTaskFindFirstOrThrowArgs>(args?: SelectSubset<T, AutomationTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AutomationTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AutomationTasks
     * const automationTasks = await prisma.automationTask.findMany()
     * 
     * // Get first 10 AutomationTasks
     * const automationTasks = await prisma.automationTask.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const automationTaskWithIdOnly = await prisma.automationTask.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AutomationTaskFindManyArgs>(args?: SelectSubset<T, AutomationTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AutomationTask.
     * @param {AutomationTaskCreateArgs} args - Arguments to create a AutomationTask.
     * @example
     * // Create one AutomationTask
     * const AutomationTask = await prisma.automationTask.create({
     *   data: {
     *     // ... data to create a AutomationTask
     *   }
     * })
     * 
     */
    create<T extends AutomationTaskCreateArgs>(args: SelectSubset<T, AutomationTaskCreateArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AutomationTasks.
     * @param {AutomationTaskCreateManyArgs} args - Arguments to create many AutomationTasks.
     * @example
     * // Create many AutomationTasks
     * const automationTask = await prisma.automationTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AutomationTaskCreateManyArgs>(args?: SelectSubset<T, AutomationTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AutomationTasks and returns the data saved in the database.
     * @param {AutomationTaskCreateManyAndReturnArgs} args - Arguments to create many AutomationTasks.
     * @example
     * // Create many AutomationTasks
     * const automationTask = await prisma.automationTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AutomationTasks and only return the `id`
     * const automationTaskWithIdOnly = await prisma.automationTask.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AutomationTaskCreateManyAndReturnArgs>(args?: SelectSubset<T, AutomationTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AutomationTask.
     * @param {AutomationTaskDeleteArgs} args - Arguments to delete one AutomationTask.
     * @example
     * // Delete one AutomationTask
     * const AutomationTask = await prisma.automationTask.delete({
     *   where: {
     *     // ... filter to delete one AutomationTask
     *   }
     * })
     * 
     */
    delete<T extends AutomationTaskDeleteArgs>(args: SelectSubset<T, AutomationTaskDeleteArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AutomationTask.
     * @param {AutomationTaskUpdateArgs} args - Arguments to update one AutomationTask.
     * @example
     * // Update one AutomationTask
     * const automationTask = await prisma.automationTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AutomationTaskUpdateArgs>(args: SelectSubset<T, AutomationTaskUpdateArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AutomationTasks.
     * @param {AutomationTaskDeleteManyArgs} args - Arguments to filter AutomationTasks to delete.
     * @example
     * // Delete a few AutomationTasks
     * const { count } = await prisma.automationTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AutomationTaskDeleteManyArgs>(args?: SelectSubset<T, AutomationTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutomationTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AutomationTasks
     * const automationTask = await prisma.automationTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AutomationTaskUpdateManyArgs>(args: SelectSubset<T, AutomationTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutomationTasks and returns the data updated in the database.
     * @param {AutomationTaskUpdateManyAndReturnArgs} args - Arguments to update many AutomationTasks.
     * @example
     * // Update many AutomationTasks
     * const automationTask = await prisma.automationTask.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AutomationTasks and only return the `id`
     * const automationTaskWithIdOnly = await prisma.automationTask.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AutomationTaskUpdateManyAndReturnArgs>(args: SelectSubset<T, AutomationTaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AutomationTask.
     * @param {AutomationTaskUpsertArgs} args - Arguments to update or create a AutomationTask.
     * @example
     * // Update or create a AutomationTask
     * const automationTask = await prisma.automationTask.upsert({
     *   create: {
     *     // ... data to create a AutomationTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AutomationTask we want to update
     *   }
     * })
     */
    upsert<T extends AutomationTaskUpsertArgs>(args: SelectSubset<T, AutomationTaskUpsertArgs<ExtArgs>>): Prisma__AutomationTaskClient<$Result.GetResult<Prisma.$AutomationTaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AutomationTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskCountArgs} args - Arguments to filter AutomationTasks to count.
     * @example
     * // Count the number of AutomationTasks
     * const count = await prisma.automationTask.count({
     *   where: {
     *     // ... the filter for the AutomationTasks we want to count
     *   }
     * })
    **/
    count<T extends AutomationTaskCountArgs>(
      args?: Subset<T, AutomationTaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AutomationTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AutomationTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AutomationTaskAggregateArgs>(args: Subset<T, AutomationTaskAggregateArgs>): Prisma.PrismaPromise<GetAutomationTaskAggregateType<T>>

    /**
     * Group by AutomationTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutomationTaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AutomationTaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AutomationTaskGroupByArgs['orderBy'] }
        : { orderBy?: AutomationTaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AutomationTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAutomationTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AutomationTask model
   */
  readonly fields: AutomationTaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AutomationTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AutomationTaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AutomationTask model
   */
  interface AutomationTaskFieldRefs {
    readonly id: FieldRef<"AutomationTask", 'String'>
    readonly name: FieldRef<"AutomationTask", 'String'>
    readonly description: FieldRef<"AutomationTask", 'String'>
    readonly type: FieldRef<"AutomationTask", 'String'>
    readonly schedule: FieldRef<"AutomationTask", 'String'>
    readonly enabled: FieldRef<"AutomationTask", 'Boolean'>
    readonly lastRun: FieldRef<"AutomationTask", 'DateTime'>
    readonly nextRun: FieldRef<"AutomationTask", 'DateTime'>
    readonly runCount: FieldRef<"AutomationTask", 'Int'>
    readonly config: FieldRef<"AutomationTask", 'String'>
    readonly lastResult: FieldRef<"AutomationTask", 'String'>
    readonly lastStatus: FieldRef<"AutomationTask", 'String'>
    readonly lastError: FieldRef<"AutomationTask", 'String'>
    readonly createdAt: FieldRef<"AutomationTask", 'DateTime'>
    readonly updatedAt: FieldRef<"AutomationTask", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AutomationTask findUnique
   */
  export type AutomationTaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter, which AutomationTask to fetch.
     */
    where: AutomationTaskWhereUniqueInput
  }

  /**
   * AutomationTask findUniqueOrThrow
   */
  export type AutomationTaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter, which AutomationTask to fetch.
     */
    where: AutomationTaskWhereUniqueInput
  }

  /**
   * AutomationTask findFirst
   */
  export type AutomationTaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter, which AutomationTask to fetch.
     */
    where?: AutomationTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutomationTasks to fetch.
     */
    orderBy?: AutomationTaskOrderByWithRelationInput | AutomationTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutomationTasks.
     */
    cursor?: AutomationTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutomationTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutomationTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutomationTasks.
     */
    distinct?: AutomationTaskScalarFieldEnum | AutomationTaskScalarFieldEnum[]
  }

  /**
   * AutomationTask findFirstOrThrow
   */
  export type AutomationTaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter, which AutomationTask to fetch.
     */
    where?: AutomationTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutomationTasks to fetch.
     */
    orderBy?: AutomationTaskOrderByWithRelationInput | AutomationTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutomationTasks.
     */
    cursor?: AutomationTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutomationTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutomationTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutomationTasks.
     */
    distinct?: AutomationTaskScalarFieldEnum | AutomationTaskScalarFieldEnum[]
  }

  /**
   * AutomationTask findMany
   */
  export type AutomationTaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter, which AutomationTasks to fetch.
     */
    where?: AutomationTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutomationTasks to fetch.
     */
    orderBy?: AutomationTaskOrderByWithRelationInput | AutomationTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AutomationTasks.
     */
    cursor?: AutomationTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutomationTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutomationTasks.
     */
    skip?: number
    distinct?: AutomationTaskScalarFieldEnum | AutomationTaskScalarFieldEnum[]
  }

  /**
   * AutomationTask create
   */
  export type AutomationTaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * The data needed to create a AutomationTask.
     */
    data: XOR<AutomationTaskCreateInput, AutomationTaskUncheckedCreateInput>
  }

  /**
   * AutomationTask createMany
   */
  export type AutomationTaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AutomationTasks.
     */
    data: AutomationTaskCreateManyInput | AutomationTaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AutomationTask createManyAndReturn
   */
  export type AutomationTaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * The data used to create many AutomationTasks.
     */
    data: AutomationTaskCreateManyInput | AutomationTaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AutomationTask update
   */
  export type AutomationTaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * The data needed to update a AutomationTask.
     */
    data: XOR<AutomationTaskUpdateInput, AutomationTaskUncheckedUpdateInput>
    /**
     * Choose, which AutomationTask to update.
     */
    where: AutomationTaskWhereUniqueInput
  }

  /**
   * AutomationTask updateMany
   */
  export type AutomationTaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AutomationTasks.
     */
    data: XOR<AutomationTaskUpdateManyMutationInput, AutomationTaskUncheckedUpdateManyInput>
    /**
     * Filter which AutomationTasks to update
     */
    where?: AutomationTaskWhereInput
    /**
     * Limit how many AutomationTasks to update.
     */
    limit?: number
  }

  /**
   * AutomationTask updateManyAndReturn
   */
  export type AutomationTaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * The data used to update AutomationTasks.
     */
    data: XOR<AutomationTaskUpdateManyMutationInput, AutomationTaskUncheckedUpdateManyInput>
    /**
     * Filter which AutomationTasks to update
     */
    where?: AutomationTaskWhereInput
    /**
     * Limit how many AutomationTasks to update.
     */
    limit?: number
  }

  /**
   * AutomationTask upsert
   */
  export type AutomationTaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * The filter to search for the AutomationTask to update in case it exists.
     */
    where: AutomationTaskWhereUniqueInput
    /**
     * In case the AutomationTask found by the `where` argument doesn't exist, create a new AutomationTask with this data.
     */
    create: XOR<AutomationTaskCreateInput, AutomationTaskUncheckedCreateInput>
    /**
     * In case the AutomationTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AutomationTaskUpdateInput, AutomationTaskUncheckedUpdateInput>
  }

  /**
   * AutomationTask delete
   */
  export type AutomationTaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
    /**
     * Filter which AutomationTask to delete.
     */
    where: AutomationTaskWhereUniqueInput
  }

  /**
   * AutomationTask deleteMany
   */
  export type AutomationTaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutomationTasks to delete
     */
    where?: AutomationTaskWhereInput
    /**
     * Limit how many AutomationTasks to delete.
     */
    limit?: number
  }

  /**
   * AutomationTask without action
   */
  export type AutomationTaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutomationTask
     */
    select?: AutomationTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutomationTask
     */
    omit?: AutomationTaskOmit<ExtArgs> | null
  }


  /**
   * Model CopilotReport
   */

  export type AggregateCopilotReport = {
    _count: CopilotReportCountAggregateOutputType | null
    _avg: CopilotReportAvgAggregateOutputType | null
    _sum: CopilotReportSumAggregateOutputType | null
    _min: CopilotReportMinAggregateOutputType | null
    _max: CopilotReportMaxAggregateOutputType | null
  }

  export type CopilotReportAvgAggregateOutputType = {
    articlesAnalyzed: number | null
    alertsFound: number | null
  }

  export type CopilotReportSumAggregateOutputType = {
    articlesAnalyzed: number | null
    alertsFound: number | null
  }

  export type CopilotReportMinAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    startDate: Date | null
    endDate: Date | null
    summary: string | null
    data: string | null
    sections: string | null
    generatedBy: string | null
    taskId: string | null
    articlesAnalyzed: number | null
    alertsFound: number | null
    createdAt: Date | null
  }

  export type CopilotReportMaxAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    startDate: Date | null
    endDate: Date | null
    summary: string | null
    data: string | null
    sections: string | null
    generatedBy: string | null
    taskId: string | null
    articlesAnalyzed: number | null
    alertsFound: number | null
    createdAt: Date | null
  }

  export type CopilotReportCountAggregateOutputType = {
    id: number
    type: number
    title: number
    startDate: number
    endDate: number
    summary: number
    data: number
    sections: number
    generatedBy: number
    taskId: number
    articlesAnalyzed: number
    alertsFound: number
    createdAt: number
    _all: number
  }


  export type CopilotReportAvgAggregateInputType = {
    articlesAnalyzed?: true
    alertsFound?: true
  }

  export type CopilotReportSumAggregateInputType = {
    articlesAnalyzed?: true
    alertsFound?: true
  }

  export type CopilotReportMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    startDate?: true
    endDate?: true
    summary?: true
    data?: true
    sections?: true
    generatedBy?: true
    taskId?: true
    articlesAnalyzed?: true
    alertsFound?: true
    createdAt?: true
  }

  export type CopilotReportMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    startDate?: true
    endDate?: true
    summary?: true
    data?: true
    sections?: true
    generatedBy?: true
    taskId?: true
    articlesAnalyzed?: true
    alertsFound?: true
    createdAt?: true
  }

  export type CopilotReportCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    startDate?: true
    endDate?: true
    summary?: true
    data?: true
    sections?: true
    generatedBy?: true
    taskId?: true
    articlesAnalyzed?: true
    alertsFound?: true
    createdAt?: true
    _all?: true
  }

  export type CopilotReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CopilotReport to aggregate.
     */
    where?: CopilotReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotReports to fetch.
     */
    orderBy?: CopilotReportOrderByWithRelationInput | CopilotReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CopilotReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CopilotReports
    **/
    _count?: true | CopilotReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CopilotReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CopilotReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CopilotReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CopilotReportMaxAggregateInputType
  }

  export type GetCopilotReportAggregateType<T extends CopilotReportAggregateArgs> = {
        [P in keyof T & keyof AggregateCopilotReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCopilotReport[P]>
      : GetScalarType<T[P], AggregateCopilotReport[P]>
  }




  export type CopilotReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CopilotReportWhereInput
    orderBy?: CopilotReportOrderByWithAggregationInput | CopilotReportOrderByWithAggregationInput[]
    by: CopilotReportScalarFieldEnum[] | CopilotReportScalarFieldEnum
    having?: CopilotReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CopilotReportCountAggregateInputType | true
    _avg?: CopilotReportAvgAggregateInputType
    _sum?: CopilotReportSumAggregateInputType
    _min?: CopilotReportMinAggregateInputType
    _max?: CopilotReportMaxAggregateInputType
  }

  export type CopilotReportGroupByOutputType = {
    id: string
    type: string
    title: string
    startDate: Date
    endDate: Date
    summary: string
    data: string
    sections: string
    generatedBy: string
    taskId: string | null
    articlesAnalyzed: number
    alertsFound: number
    createdAt: Date
    _count: CopilotReportCountAggregateOutputType | null
    _avg: CopilotReportAvgAggregateOutputType | null
    _sum: CopilotReportSumAggregateOutputType | null
    _min: CopilotReportMinAggregateOutputType | null
    _max: CopilotReportMaxAggregateOutputType | null
  }

  type GetCopilotReportGroupByPayload<T extends CopilotReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CopilotReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CopilotReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CopilotReportGroupByOutputType[P]>
            : GetScalarType<T[P], CopilotReportGroupByOutputType[P]>
        }
      >
    >


  export type CopilotReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    startDate?: boolean
    endDate?: boolean
    summary?: boolean
    data?: boolean
    sections?: boolean
    generatedBy?: boolean
    taskId?: boolean
    articlesAnalyzed?: boolean
    alertsFound?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["copilotReport"]>

  export type CopilotReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    startDate?: boolean
    endDate?: boolean
    summary?: boolean
    data?: boolean
    sections?: boolean
    generatedBy?: boolean
    taskId?: boolean
    articlesAnalyzed?: boolean
    alertsFound?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["copilotReport"]>

  export type CopilotReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    startDate?: boolean
    endDate?: boolean
    summary?: boolean
    data?: boolean
    sections?: boolean
    generatedBy?: boolean
    taskId?: boolean
    articlesAnalyzed?: boolean
    alertsFound?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["copilotReport"]>

  export type CopilotReportSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    startDate?: boolean
    endDate?: boolean
    summary?: boolean
    data?: boolean
    sections?: boolean
    generatedBy?: boolean
    taskId?: boolean
    articlesAnalyzed?: boolean
    alertsFound?: boolean
    createdAt?: boolean
  }

  export type CopilotReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "title" | "startDate" | "endDate" | "summary" | "data" | "sections" | "generatedBy" | "taskId" | "articlesAnalyzed" | "alertsFound" | "createdAt", ExtArgs["result"]["copilotReport"]>

  export type $CopilotReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CopilotReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      title: string
      startDate: Date
      endDate: Date
      summary: string
      data: string
      sections: string
      generatedBy: string
      taskId: string | null
      articlesAnalyzed: number
      alertsFound: number
      createdAt: Date
    }, ExtArgs["result"]["copilotReport"]>
    composites: {}
  }

  type CopilotReportGetPayload<S extends boolean | null | undefined | CopilotReportDefaultArgs> = $Result.GetResult<Prisma.$CopilotReportPayload, S>

  type CopilotReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CopilotReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CopilotReportCountAggregateInputType | true
    }

  export interface CopilotReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CopilotReport'], meta: { name: 'CopilotReport' } }
    /**
     * Find zero or one CopilotReport that matches the filter.
     * @param {CopilotReportFindUniqueArgs} args - Arguments to find a CopilotReport
     * @example
     * // Get one CopilotReport
     * const copilotReport = await prisma.copilotReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CopilotReportFindUniqueArgs>(args: SelectSubset<T, CopilotReportFindUniqueArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CopilotReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CopilotReportFindUniqueOrThrowArgs} args - Arguments to find a CopilotReport
     * @example
     * // Get one CopilotReport
     * const copilotReport = await prisma.copilotReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CopilotReportFindUniqueOrThrowArgs>(args: SelectSubset<T, CopilotReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CopilotReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportFindFirstArgs} args - Arguments to find a CopilotReport
     * @example
     * // Get one CopilotReport
     * const copilotReport = await prisma.copilotReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CopilotReportFindFirstArgs>(args?: SelectSubset<T, CopilotReportFindFirstArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CopilotReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportFindFirstOrThrowArgs} args - Arguments to find a CopilotReport
     * @example
     * // Get one CopilotReport
     * const copilotReport = await prisma.copilotReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CopilotReportFindFirstOrThrowArgs>(args?: SelectSubset<T, CopilotReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CopilotReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CopilotReports
     * const copilotReports = await prisma.copilotReport.findMany()
     * 
     * // Get first 10 CopilotReports
     * const copilotReports = await prisma.copilotReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const copilotReportWithIdOnly = await prisma.copilotReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CopilotReportFindManyArgs>(args?: SelectSubset<T, CopilotReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CopilotReport.
     * @param {CopilotReportCreateArgs} args - Arguments to create a CopilotReport.
     * @example
     * // Create one CopilotReport
     * const CopilotReport = await prisma.copilotReport.create({
     *   data: {
     *     // ... data to create a CopilotReport
     *   }
     * })
     * 
     */
    create<T extends CopilotReportCreateArgs>(args: SelectSubset<T, CopilotReportCreateArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CopilotReports.
     * @param {CopilotReportCreateManyArgs} args - Arguments to create many CopilotReports.
     * @example
     * // Create many CopilotReports
     * const copilotReport = await prisma.copilotReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CopilotReportCreateManyArgs>(args?: SelectSubset<T, CopilotReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CopilotReports and returns the data saved in the database.
     * @param {CopilotReportCreateManyAndReturnArgs} args - Arguments to create many CopilotReports.
     * @example
     * // Create many CopilotReports
     * const copilotReport = await prisma.copilotReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CopilotReports and only return the `id`
     * const copilotReportWithIdOnly = await prisma.copilotReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CopilotReportCreateManyAndReturnArgs>(args?: SelectSubset<T, CopilotReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CopilotReport.
     * @param {CopilotReportDeleteArgs} args - Arguments to delete one CopilotReport.
     * @example
     * // Delete one CopilotReport
     * const CopilotReport = await prisma.copilotReport.delete({
     *   where: {
     *     // ... filter to delete one CopilotReport
     *   }
     * })
     * 
     */
    delete<T extends CopilotReportDeleteArgs>(args: SelectSubset<T, CopilotReportDeleteArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CopilotReport.
     * @param {CopilotReportUpdateArgs} args - Arguments to update one CopilotReport.
     * @example
     * // Update one CopilotReport
     * const copilotReport = await prisma.copilotReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CopilotReportUpdateArgs>(args: SelectSubset<T, CopilotReportUpdateArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CopilotReports.
     * @param {CopilotReportDeleteManyArgs} args - Arguments to filter CopilotReports to delete.
     * @example
     * // Delete a few CopilotReports
     * const { count } = await prisma.copilotReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CopilotReportDeleteManyArgs>(args?: SelectSubset<T, CopilotReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CopilotReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CopilotReports
     * const copilotReport = await prisma.copilotReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CopilotReportUpdateManyArgs>(args: SelectSubset<T, CopilotReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CopilotReports and returns the data updated in the database.
     * @param {CopilotReportUpdateManyAndReturnArgs} args - Arguments to update many CopilotReports.
     * @example
     * // Update many CopilotReports
     * const copilotReport = await prisma.copilotReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CopilotReports and only return the `id`
     * const copilotReportWithIdOnly = await prisma.copilotReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CopilotReportUpdateManyAndReturnArgs>(args: SelectSubset<T, CopilotReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CopilotReport.
     * @param {CopilotReportUpsertArgs} args - Arguments to update or create a CopilotReport.
     * @example
     * // Update or create a CopilotReport
     * const copilotReport = await prisma.copilotReport.upsert({
     *   create: {
     *     // ... data to create a CopilotReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CopilotReport we want to update
     *   }
     * })
     */
    upsert<T extends CopilotReportUpsertArgs>(args: SelectSubset<T, CopilotReportUpsertArgs<ExtArgs>>): Prisma__CopilotReportClient<$Result.GetResult<Prisma.$CopilotReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CopilotReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportCountArgs} args - Arguments to filter CopilotReports to count.
     * @example
     * // Count the number of CopilotReports
     * const count = await prisma.copilotReport.count({
     *   where: {
     *     // ... the filter for the CopilotReports we want to count
     *   }
     * })
    **/
    count<T extends CopilotReportCountArgs>(
      args?: Subset<T, CopilotReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CopilotReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CopilotReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CopilotReportAggregateArgs>(args: Subset<T, CopilotReportAggregateArgs>): Prisma.PrismaPromise<GetCopilotReportAggregateType<T>>

    /**
     * Group by CopilotReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CopilotReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CopilotReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CopilotReportGroupByArgs['orderBy'] }
        : { orderBy?: CopilotReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CopilotReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCopilotReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CopilotReport model
   */
  readonly fields: CopilotReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CopilotReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CopilotReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CopilotReport model
   */
  interface CopilotReportFieldRefs {
    readonly id: FieldRef<"CopilotReport", 'String'>
    readonly type: FieldRef<"CopilotReport", 'String'>
    readonly title: FieldRef<"CopilotReport", 'String'>
    readonly startDate: FieldRef<"CopilotReport", 'DateTime'>
    readonly endDate: FieldRef<"CopilotReport", 'DateTime'>
    readonly summary: FieldRef<"CopilotReport", 'String'>
    readonly data: FieldRef<"CopilotReport", 'String'>
    readonly sections: FieldRef<"CopilotReport", 'String'>
    readonly generatedBy: FieldRef<"CopilotReport", 'String'>
    readonly taskId: FieldRef<"CopilotReport", 'String'>
    readonly articlesAnalyzed: FieldRef<"CopilotReport", 'Int'>
    readonly alertsFound: FieldRef<"CopilotReport", 'Int'>
    readonly createdAt: FieldRef<"CopilotReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CopilotReport findUnique
   */
  export type CopilotReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter, which CopilotReport to fetch.
     */
    where: CopilotReportWhereUniqueInput
  }

  /**
   * CopilotReport findUniqueOrThrow
   */
  export type CopilotReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter, which CopilotReport to fetch.
     */
    where: CopilotReportWhereUniqueInput
  }

  /**
   * CopilotReport findFirst
   */
  export type CopilotReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter, which CopilotReport to fetch.
     */
    where?: CopilotReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotReports to fetch.
     */
    orderBy?: CopilotReportOrderByWithRelationInput | CopilotReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CopilotReports.
     */
    cursor?: CopilotReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CopilotReports.
     */
    distinct?: CopilotReportScalarFieldEnum | CopilotReportScalarFieldEnum[]
  }

  /**
   * CopilotReport findFirstOrThrow
   */
  export type CopilotReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter, which CopilotReport to fetch.
     */
    where?: CopilotReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotReports to fetch.
     */
    orderBy?: CopilotReportOrderByWithRelationInput | CopilotReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CopilotReports.
     */
    cursor?: CopilotReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CopilotReports.
     */
    distinct?: CopilotReportScalarFieldEnum | CopilotReportScalarFieldEnum[]
  }

  /**
   * CopilotReport findMany
   */
  export type CopilotReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter, which CopilotReports to fetch.
     */
    where?: CopilotReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CopilotReports to fetch.
     */
    orderBy?: CopilotReportOrderByWithRelationInput | CopilotReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CopilotReports.
     */
    cursor?: CopilotReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CopilotReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CopilotReports.
     */
    skip?: number
    distinct?: CopilotReportScalarFieldEnum | CopilotReportScalarFieldEnum[]
  }

  /**
   * CopilotReport create
   */
  export type CopilotReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * The data needed to create a CopilotReport.
     */
    data: XOR<CopilotReportCreateInput, CopilotReportUncheckedCreateInput>
  }

  /**
   * CopilotReport createMany
   */
  export type CopilotReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CopilotReports.
     */
    data: CopilotReportCreateManyInput | CopilotReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CopilotReport createManyAndReturn
   */
  export type CopilotReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * The data used to create many CopilotReports.
     */
    data: CopilotReportCreateManyInput | CopilotReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CopilotReport update
   */
  export type CopilotReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * The data needed to update a CopilotReport.
     */
    data: XOR<CopilotReportUpdateInput, CopilotReportUncheckedUpdateInput>
    /**
     * Choose, which CopilotReport to update.
     */
    where: CopilotReportWhereUniqueInput
  }

  /**
   * CopilotReport updateMany
   */
  export type CopilotReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CopilotReports.
     */
    data: XOR<CopilotReportUpdateManyMutationInput, CopilotReportUncheckedUpdateManyInput>
    /**
     * Filter which CopilotReports to update
     */
    where?: CopilotReportWhereInput
    /**
     * Limit how many CopilotReports to update.
     */
    limit?: number
  }

  /**
   * CopilotReport updateManyAndReturn
   */
  export type CopilotReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * The data used to update CopilotReports.
     */
    data: XOR<CopilotReportUpdateManyMutationInput, CopilotReportUncheckedUpdateManyInput>
    /**
     * Filter which CopilotReports to update
     */
    where?: CopilotReportWhereInput
    /**
     * Limit how many CopilotReports to update.
     */
    limit?: number
  }

  /**
   * CopilotReport upsert
   */
  export type CopilotReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * The filter to search for the CopilotReport to update in case it exists.
     */
    where: CopilotReportWhereUniqueInput
    /**
     * In case the CopilotReport found by the `where` argument doesn't exist, create a new CopilotReport with this data.
     */
    create: XOR<CopilotReportCreateInput, CopilotReportUncheckedCreateInput>
    /**
     * In case the CopilotReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CopilotReportUpdateInput, CopilotReportUncheckedUpdateInput>
  }

  /**
   * CopilotReport delete
   */
  export type CopilotReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
    /**
     * Filter which CopilotReport to delete.
     */
    where: CopilotReportWhereUniqueInput
  }

  /**
   * CopilotReport deleteMany
   */
  export type CopilotReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CopilotReports to delete
     */
    where?: CopilotReportWhereInput
    /**
     * Limit how many CopilotReports to delete.
     */
    limit?: number
  }

  /**
   * CopilotReport without action
   */
  export type CopilotReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CopilotReport
     */
    select?: CopilotReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CopilotReport
     */
    omit?: CopilotReportOmit<ExtArgs> | null
  }


  /**
   * Model CommunityStory
   */

  export type AggregateCommunityStory = {
    _count: CommunityStoryCountAggregateOutputType | null
    _avg: CommunityStoryAvgAggregateOutputType | null
    _sum: CommunityStorySumAggregateOutputType | null
    _min: CommunityStoryMinAggregateOutputType | null
    _max: CommunityStoryMaxAggregateOutputType | null
  }

  export type CommunityStoryAvgAggregateOutputType = {
    likes: number | null
  }

  export type CommunityStorySumAggregateOutputType = {
    likes: number | null
  }

  export type CommunityStoryMinAggregateOutputType = {
    id: string | null
    slug: string | null
    authorName: string | null
    authorAvatar: string | null
    userId: string | null
    title: string | null
    content: string | null
    category: $Enums.StoryCategory | null
    likes: number | null
    verified: boolean | null
    featured: boolean | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommunityStoryMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    authorName: string | null
    authorAvatar: string | null
    userId: string | null
    title: string | null
    content: string | null
    category: $Enums.StoryCategory | null
    likes: number | null
    verified: boolean | null
    featured: boolean | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommunityStoryCountAggregateOutputType = {
    id: number
    slug: number
    authorName: number
    authorAvatar: number
    userId: number
    title: number
    content: number
    category: number
    likes: number
    verified: number
    featured: number
    published: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommunityStoryAvgAggregateInputType = {
    likes?: true
  }

  export type CommunityStorySumAggregateInputType = {
    likes?: true
  }

  export type CommunityStoryMinAggregateInputType = {
    id?: true
    slug?: true
    authorName?: true
    authorAvatar?: true
    userId?: true
    title?: true
    content?: true
    category?: true
    likes?: true
    verified?: true
    featured?: true
    published?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommunityStoryMaxAggregateInputType = {
    id?: true
    slug?: true
    authorName?: true
    authorAvatar?: true
    userId?: true
    title?: true
    content?: true
    category?: true
    likes?: true
    verified?: true
    featured?: true
    published?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommunityStoryCountAggregateInputType = {
    id?: true
    slug?: true
    authorName?: true
    authorAvatar?: true
    userId?: true
    title?: true
    content?: true
    category?: true
    likes?: true
    verified?: true
    featured?: true
    published?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommunityStoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityStory to aggregate.
     */
    where?: CommunityStoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityStories to fetch.
     */
    orderBy?: CommunityStoryOrderByWithRelationInput | CommunityStoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityStoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityStories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityStories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityStories
    **/
    _count?: true | CommunityStoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommunityStoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommunityStorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityStoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityStoryMaxAggregateInputType
  }

  export type GetCommunityStoryAggregateType<T extends CommunityStoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityStory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityStory[P]>
      : GetScalarType<T[P], AggregateCommunityStory[P]>
  }




  export type CommunityStoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityStoryWhereInput
    orderBy?: CommunityStoryOrderByWithAggregationInput | CommunityStoryOrderByWithAggregationInput[]
    by: CommunityStoryScalarFieldEnum[] | CommunityStoryScalarFieldEnum
    having?: CommunityStoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityStoryCountAggregateInputType | true
    _avg?: CommunityStoryAvgAggregateInputType
    _sum?: CommunityStorySumAggregateInputType
    _min?: CommunityStoryMinAggregateInputType
    _max?: CommunityStoryMaxAggregateInputType
  }

  export type CommunityStoryGroupByOutputType = {
    id: string
    slug: string
    authorName: string
    authorAvatar: string | null
    userId: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes: number
    verified: boolean
    featured: boolean
    published: boolean
    createdAt: Date
    updatedAt: Date
    _count: CommunityStoryCountAggregateOutputType | null
    _avg: CommunityStoryAvgAggregateOutputType | null
    _sum: CommunityStorySumAggregateOutputType | null
    _min: CommunityStoryMinAggregateOutputType | null
    _max: CommunityStoryMaxAggregateOutputType | null
  }

  type GetCommunityStoryGroupByPayload<T extends CommunityStoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityStoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityStoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityStoryGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityStoryGroupByOutputType[P]>
        }
      >
    >


  export type CommunityStorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    authorName?: boolean
    authorAvatar?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    likes?: boolean
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }, ExtArgs["result"]["communityStory"]>

  export type CommunityStorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    authorName?: boolean
    authorAvatar?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    likes?: boolean
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }, ExtArgs["result"]["communityStory"]>

  export type CommunityStorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    authorName?: boolean
    authorAvatar?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    likes?: boolean
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }, ExtArgs["result"]["communityStory"]>

  export type CommunityStorySelectScalar = {
    id?: boolean
    slug?: boolean
    authorName?: boolean
    authorAvatar?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    likes?: boolean
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CommunityStoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "authorName" | "authorAvatar" | "userId" | "title" | "content" | "category" | "likes" | "verified" | "featured" | "published" | "createdAt" | "updatedAt", ExtArgs["result"]["communityStory"]>
  export type CommunityStoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }
  export type CommunityStoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }
  export type CommunityStoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | CommunityStory$userArgs<ExtArgs>
  }

  export type $CommunityStoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityStory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      authorName: string
      authorAvatar: string | null
      userId: string | null
      title: string
      content: string
      category: $Enums.StoryCategory
      likes: number
      verified: boolean
      featured: boolean
      published: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["communityStory"]>
    composites: {}
  }

  type CommunityStoryGetPayload<S extends boolean | null | undefined | CommunityStoryDefaultArgs> = $Result.GetResult<Prisma.$CommunityStoryPayload, S>

  type CommunityStoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommunityStoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommunityStoryCountAggregateInputType | true
    }

  export interface CommunityStoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityStory'], meta: { name: 'CommunityStory' } }
    /**
     * Find zero or one CommunityStory that matches the filter.
     * @param {CommunityStoryFindUniqueArgs} args - Arguments to find a CommunityStory
     * @example
     * // Get one CommunityStory
     * const communityStory = await prisma.communityStory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityStoryFindUniqueArgs>(args: SelectSubset<T, CommunityStoryFindUniqueArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CommunityStory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommunityStoryFindUniqueOrThrowArgs} args - Arguments to find a CommunityStory
     * @example
     * // Get one CommunityStory
     * const communityStory = await prisma.communityStory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityStoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityStoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CommunityStory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryFindFirstArgs} args - Arguments to find a CommunityStory
     * @example
     * // Get one CommunityStory
     * const communityStory = await prisma.communityStory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityStoryFindFirstArgs>(args?: SelectSubset<T, CommunityStoryFindFirstArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CommunityStory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryFindFirstOrThrowArgs} args - Arguments to find a CommunityStory
     * @example
     * // Get one CommunityStory
     * const communityStory = await prisma.communityStory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityStoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityStoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CommunityStories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityStories
     * const communityStories = await prisma.communityStory.findMany()
     * 
     * // Get first 10 CommunityStories
     * const communityStories = await prisma.communityStory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityStoryWithIdOnly = await prisma.communityStory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityStoryFindManyArgs>(args?: SelectSubset<T, CommunityStoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CommunityStory.
     * @param {CommunityStoryCreateArgs} args - Arguments to create a CommunityStory.
     * @example
     * // Create one CommunityStory
     * const CommunityStory = await prisma.communityStory.create({
     *   data: {
     *     // ... data to create a CommunityStory
     *   }
     * })
     * 
     */
    create<T extends CommunityStoryCreateArgs>(args: SelectSubset<T, CommunityStoryCreateArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CommunityStories.
     * @param {CommunityStoryCreateManyArgs} args - Arguments to create many CommunityStories.
     * @example
     * // Create many CommunityStories
     * const communityStory = await prisma.communityStory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityStoryCreateManyArgs>(args?: SelectSubset<T, CommunityStoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityStories and returns the data saved in the database.
     * @param {CommunityStoryCreateManyAndReturnArgs} args - Arguments to create many CommunityStories.
     * @example
     * // Create many CommunityStories
     * const communityStory = await prisma.communityStory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityStories and only return the `id`
     * const communityStoryWithIdOnly = await prisma.communityStory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityStoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityStoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CommunityStory.
     * @param {CommunityStoryDeleteArgs} args - Arguments to delete one CommunityStory.
     * @example
     * // Delete one CommunityStory
     * const CommunityStory = await prisma.communityStory.delete({
     *   where: {
     *     // ... filter to delete one CommunityStory
     *   }
     * })
     * 
     */
    delete<T extends CommunityStoryDeleteArgs>(args: SelectSubset<T, CommunityStoryDeleteArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CommunityStory.
     * @param {CommunityStoryUpdateArgs} args - Arguments to update one CommunityStory.
     * @example
     * // Update one CommunityStory
     * const communityStory = await prisma.communityStory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityStoryUpdateArgs>(args: SelectSubset<T, CommunityStoryUpdateArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CommunityStories.
     * @param {CommunityStoryDeleteManyArgs} args - Arguments to filter CommunityStories to delete.
     * @example
     * // Delete a few CommunityStories
     * const { count } = await prisma.communityStory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityStoryDeleteManyArgs>(args?: SelectSubset<T, CommunityStoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityStories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityStories
     * const communityStory = await prisma.communityStory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityStoryUpdateManyArgs>(args: SelectSubset<T, CommunityStoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityStories and returns the data updated in the database.
     * @param {CommunityStoryUpdateManyAndReturnArgs} args - Arguments to update many CommunityStories.
     * @example
     * // Update many CommunityStories
     * const communityStory = await prisma.communityStory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CommunityStories and only return the `id`
     * const communityStoryWithIdOnly = await prisma.communityStory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommunityStoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CommunityStoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CommunityStory.
     * @param {CommunityStoryUpsertArgs} args - Arguments to update or create a CommunityStory.
     * @example
     * // Update or create a CommunityStory
     * const communityStory = await prisma.communityStory.upsert({
     *   create: {
     *     // ... data to create a CommunityStory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityStory we want to update
     *   }
     * })
     */
    upsert<T extends CommunityStoryUpsertArgs>(args: SelectSubset<T, CommunityStoryUpsertArgs<ExtArgs>>): Prisma__CommunityStoryClient<$Result.GetResult<Prisma.$CommunityStoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CommunityStories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryCountArgs} args - Arguments to filter CommunityStories to count.
     * @example
     * // Count the number of CommunityStories
     * const count = await prisma.communityStory.count({
     *   where: {
     *     // ... the filter for the CommunityStories we want to count
     *   }
     * })
    **/
    count<T extends CommunityStoryCountArgs>(
      args?: Subset<T, CommunityStoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityStoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityStory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommunityStoryAggregateArgs>(args: Subset<T, CommunityStoryAggregateArgs>): Prisma.PrismaPromise<GetCommunityStoryAggregateType<T>>

    /**
     * Group by CommunityStory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityStoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommunityStoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityStoryGroupByArgs['orderBy'] }
        : { orderBy?: CommunityStoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommunityStoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityStoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityStory model
   */
  readonly fields: CommunityStoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityStory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityStoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends CommunityStory$userArgs<ExtArgs> = {}>(args?: Subset<T, CommunityStory$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CommunityStory model
   */
  interface CommunityStoryFieldRefs {
    readonly id: FieldRef<"CommunityStory", 'String'>
    readonly slug: FieldRef<"CommunityStory", 'String'>
    readonly authorName: FieldRef<"CommunityStory", 'String'>
    readonly authorAvatar: FieldRef<"CommunityStory", 'String'>
    readonly userId: FieldRef<"CommunityStory", 'String'>
    readonly title: FieldRef<"CommunityStory", 'String'>
    readonly content: FieldRef<"CommunityStory", 'String'>
    readonly category: FieldRef<"CommunityStory", 'StoryCategory'>
    readonly likes: FieldRef<"CommunityStory", 'Int'>
    readonly verified: FieldRef<"CommunityStory", 'Boolean'>
    readonly featured: FieldRef<"CommunityStory", 'Boolean'>
    readonly published: FieldRef<"CommunityStory", 'Boolean'>
    readonly createdAt: FieldRef<"CommunityStory", 'DateTime'>
    readonly updatedAt: FieldRef<"CommunityStory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityStory findUnique
   */
  export type CommunityStoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter, which CommunityStory to fetch.
     */
    where: CommunityStoryWhereUniqueInput
  }

  /**
   * CommunityStory findUniqueOrThrow
   */
  export type CommunityStoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter, which CommunityStory to fetch.
     */
    where: CommunityStoryWhereUniqueInput
  }

  /**
   * CommunityStory findFirst
   */
  export type CommunityStoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter, which CommunityStory to fetch.
     */
    where?: CommunityStoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityStories to fetch.
     */
    orderBy?: CommunityStoryOrderByWithRelationInput | CommunityStoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityStories.
     */
    cursor?: CommunityStoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityStories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityStories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityStories.
     */
    distinct?: CommunityStoryScalarFieldEnum | CommunityStoryScalarFieldEnum[]
  }

  /**
   * CommunityStory findFirstOrThrow
   */
  export type CommunityStoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter, which CommunityStory to fetch.
     */
    where?: CommunityStoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityStories to fetch.
     */
    orderBy?: CommunityStoryOrderByWithRelationInput | CommunityStoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityStories.
     */
    cursor?: CommunityStoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityStories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityStories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityStories.
     */
    distinct?: CommunityStoryScalarFieldEnum | CommunityStoryScalarFieldEnum[]
  }

  /**
   * CommunityStory findMany
   */
  export type CommunityStoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter, which CommunityStories to fetch.
     */
    where?: CommunityStoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityStories to fetch.
     */
    orderBy?: CommunityStoryOrderByWithRelationInput | CommunityStoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityStories.
     */
    cursor?: CommunityStoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityStories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityStories.
     */
    skip?: number
    distinct?: CommunityStoryScalarFieldEnum | CommunityStoryScalarFieldEnum[]
  }

  /**
   * CommunityStory create
   */
  export type CommunityStoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunityStory.
     */
    data: XOR<CommunityStoryCreateInput, CommunityStoryUncheckedCreateInput>
  }

  /**
   * CommunityStory createMany
   */
  export type CommunityStoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityStories.
     */
    data: CommunityStoryCreateManyInput | CommunityStoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityStory createManyAndReturn
   */
  export type CommunityStoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * The data used to create many CommunityStories.
     */
    data: CommunityStoryCreateManyInput | CommunityStoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CommunityStory update
   */
  export type CommunityStoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunityStory.
     */
    data: XOR<CommunityStoryUpdateInput, CommunityStoryUncheckedUpdateInput>
    /**
     * Choose, which CommunityStory to update.
     */
    where: CommunityStoryWhereUniqueInput
  }

  /**
   * CommunityStory updateMany
   */
  export type CommunityStoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityStories.
     */
    data: XOR<CommunityStoryUpdateManyMutationInput, CommunityStoryUncheckedUpdateManyInput>
    /**
     * Filter which CommunityStories to update
     */
    where?: CommunityStoryWhereInput
    /**
     * Limit how many CommunityStories to update.
     */
    limit?: number
  }

  /**
   * CommunityStory updateManyAndReturn
   */
  export type CommunityStoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * The data used to update CommunityStories.
     */
    data: XOR<CommunityStoryUpdateManyMutationInput, CommunityStoryUncheckedUpdateManyInput>
    /**
     * Filter which CommunityStories to update
     */
    where?: CommunityStoryWhereInput
    /**
     * Limit how many CommunityStories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CommunityStory upsert
   */
  export type CommunityStoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunityStory to update in case it exists.
     */
    where: CommunityStoryWhereUniqueInput
    /**
     * In case the CommunityStory found by the `where` argument doesn't exist, create a new CommunityStory with this data.
     */
    create: XOR<CommunityStoryCreateInput, CommunityStoryUncheckedCreateInput>
    /**
     * In case the CommunityStory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityStoryUpdateInput, CommunityStoryUncheckedUpdateInput>
  }

  /**
   * CommunityStory delete
   */
  export type CommunityStoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
    /**
     * Filter which CommunityStory to delete.
     */
    where: CommunityStoryWhereUniqueInput
  }

  /**
   * CommunityStory deleteMany
   */
  export type CommunityStoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityStories to delete
     */
    where?: CommunityStoryWhereInput
    /**
     * Limit how many CommunityStories to delete.
     */
    limit?: number
  }

  /**
   * CommunityStory.user
   */
  export type CommunityStory$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * CommunityStory without action
   */
  export type CommunityStoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityStory
     */
    select?: CommunityStorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityStory
     */
    omit?: CommunityStoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityStoryInclude<ExtArgs> | null
  }


  /**
   * Model SocialProject
   */

  export type AggregateSocialProject = {
    _count: SocialProjectCountAggregateOutputType | null
    _avg: SocialProjectAvgAggregateOutputType | null
    _sum: SocialProjectSumAggregateOutputType | null
    _min: SocialProjectMinAggregateOutputType | null
    _max: SocialProjectMaxAggregateOutputType | null
  }

  export type SocialProjectAvgAggregateOutputType = {
    fundingGoal: number | null
    currentFunding: number | null
    supporters: number | null
    views: number | null
  }

  export type SocialProjectSumAggregateOutputType = {
    fundingGoal: number | null
    currentFunding: number | null
    supporters: number | null
    views: number | null
  }

  export type SocialProjectMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    longDescription: string | null
    fundingGoal: number | null
    currentFunding: number | null
    currency: string | null
    walletAddress: string | null
    category: $Enums.ProjectCategory | null
    location: string | null
    tags: string | null
    verified: boolean | null
    active: boolean | null
    featured: boolean | null
    startDate: Date | null
    endDate: Date | null
    supporters: number | null
    views: number | null
    coverImage: string | null
    gallery: string | null
    organizer: string | null
    organizerEmail: string | null
    organizerPhone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialProjectMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    longDescription: string | null
    fundingGoal: number | null
    currentFunding: number | null
    currency: string | null
    walletAddress: string | null
    category: $Enums.ProjectCategory | null
    location: string | null
    tags: string | null
    verified: boolean | null
    active: boolean | null
    featured: boolean | null
    startDate: Date | null
    endDate: Date | null
    supporters: number | null
    views: number | null
    coverImage: string | null
    gallery: string | null
    organizer: string | null
    organizerEmail: string | null
    organizerPhone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialProjectCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    description: number
    longDescription: number
    fundingGoal: number
    currentFunding: number
    currency: number
    walletAddress: number
    category: number
    location: number
    tags: number
    verified: number
    active: number
    featured: number
    startDate: number
    endDate: number
    supporters: number
    views: number
    coverImage: number
    gallery: number
    organizer: number
    organizerEmail: number
    organizerPhone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SocialProjectAvgAggregateInputType = {
    fundingGoal?: true
    currentFunding?: true
    supporters?: true
    views?: true
  }

  export type SocialProjectSumAggregateInputType = {
    fundingGoal?: true
    currentFunding?: true
    supporters?: true
    views?: true
  }

  export type SocialProjectMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    longDescription?: true
    fundingGoal?: true
    currentFunding?: true
    currency?: true
    walletAddress?: true
    category?: true
    location?: true
    tags?: true
    verified?: true
    active?: true
    featured?: true
    startDate?: true
    endDate?: true
    supporters?: true
    views?: true
    coverImage?: true
    gallery?: true
    organizer?: true
    organizerEmail?: true
    organizerPhone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialProjectMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    longDescription?: true
    fundingGoal?: true
    currentFunding?: true
    currency?: true
    walletAddress?: true
    category?: true
    location?: true
    tags?: true
    verified?: true
    active?: true
    featured?: true
    startDate?: true
    endDate?: true
    supporters?: true
    views?: true
    coverImage?: true
    gallery?: true
    organizer?: true
    organizerEmail?: true
    organizerPhone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialProjectCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    longDescription?: true
    fundingGoal?: true
    currentFunding?: true
    currency?: true
    walletAddress?: true
    category?: true
    location?: true
    tags?: true
    verified?: true
    active?: true
    featured?: true
    startDate?: true
    endDate?: true
    supporters?: true
    views?: true
    coverImage?: true
    gallery?: true
    organizer?: true
    organizerEmail?: true
    organizerPhone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SocialProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialProject to aggregate.
     */
    where?: SocialProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialProjects to fetch.
     */
    orderBy?: SocialProjectOrderByWithRelationInput | SocialProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SocialProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SocialProjects
    **/
    _count?: true | SocialProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SocialProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SocialProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SocialProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SocialProjectMaxAggregateInputType
  }

  export type GetSocialProjectAggregateType<T extends SocialProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateSocialProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSocialProject[P]>
      : GetScalarType<T[P], AggregateSocialProject[P]>
  }




  export type SocialProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SocialProjectWhereInput
    orderBy?: SocialProjectOrderByWithAggregationInput | SocialProjectOrderByWithAggregationInput[]
    by: SocialProjectScalarFieldEnum[] | SocialProjectScalarFieldEnum
    having?: SocialProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SocialProjectCountAggregateInputType | true
    _avg?: SocialProjectAvgAggregateInputType
    _sum?: SocialProjectSumAggregateInputType
    _min?: SocialProjectMinAggregateInputType
    _max?: SocialProjectMaxAggregateInputType
  }

  export type SocialProjectGroupByOutputType = {
    id: string
    slug: string
    name: string
    description: string
    longDescription: string | null
    fundingGoal: number
    currentFunding: number
    currency: string
    walletAddress: string | null
    category: $Enums.ProjectCategory
    location: string | null
    tags: string | null
    verified: boolean
    active: boolean
    featured: boolean
    startDate: Date
    endDate: Date | null
    supporters: number
    views: number
    coverImage: string | null
    gallery: string | null
    organizer: string
    organizerEmail: string | null
    organizerPhone: string | null
    createdAt: Date
    updatedAt: Date
    _count: SocialProjectCountAggregateOutputType | null
    _avg: SocialProjectAvgAggregateOutputType | null
    _sum: SocialProjectSumAggregateOutputType | null
    _min: SocialProjectMinAggregateOutputType | null
    _max: SocialProjectMaxAggregateOutputType | null
  }

  type GetSocialProjectGroupByPayload<T extends SocialProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SocialProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SocialProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SocialProjectGroupByOutputType[P]>
            : GetScalarType<T[P], SocialProjectGroupByOutputType[P]>
        }
      >
    >


  export type SocialProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    longDescription?: boolean
    fundingGoal?: boolean
    currentFunding?: boolean
    currency?: boolean
    walletAddress?: boolean
    category?: boolean
    location?: boolean
    tags?: boolean
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate?: boolean
    endDate?: boolean
    supporters?: boolean
    views?: boolean
    coverImage?: boolean
    gallery?: boolean
    organizer?: boolean
    organizerEmail?: boolean
    organizerPhone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    map?: boolean | SocialProject$mapArgs<ExtArgs>
  }, ExtArgs["result"]["socialProject"]>

  export type SocialProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    longDescription?: boolean
    fundingGoal?: boolean
    currentFunding?: boolean
    currency?: boolean
    walletAddress?: boolean
    category?: boolean
    location?: boolean
    tags?: boolean
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate?: boolean
    endDate?: boolean
    supporters?: boolean
    views?: boolean
    coverImage?: boolean
    gallery?: boolean
    organizer?: boolean
    organizerEmail?: boolean
    organizerPhone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["socialProject"]>

  export type SocialProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    longDescription?: boolean
    fundingGoal?: boolean
    currentFunding?: boolean
    currency?: boolean
    walletAddress?: boolean
    category?: boolean
    location?: boolean
    tags?: boolean
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate?: boolean
    endDate?: boolean
    supporters?: boolean
    views?: boolean
    coverImage?: boolean
    gallery?: boolean
    organizer?: boolean
    organizerEmail?: boolean
    organizerPhone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["socialProject"]>

  export type SocialProjectSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    longDescription?: boolean
    fundingGoal?: boolean
    currentFunding?: boolean
    currency?: boolean
    walletAddress?: boolean
    category?: boolean
    location?: boolean
    tags?: boolean
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate?: boolean
    endDate?: boolean
    supporters?: boolean
    views?: boolean
    coverImage?: boolean
    gallery?: boolean
    organizer?: boolean
    organizerEmail?: boolean
    organizerPhone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SocialProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "description" | "longDescription" | "fundingGoal" | "currentFunding" | "currency" | "walletAddress" | "category" | "location" | "tags" | "verified" | "active" | "featured" | "startDate" | "endDate" | "supporters" | "views" | "coverImage" | "gallery" | "organizer" | "organizerEmail" | "organizerPhone" | "createdAt" | "updatedAt", ExtArgs["result"]["socialProject"]>
  export type SocialProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    map?: boolean | SocialProject$mapArgs<ExtArgs>
  }
  export type SocialProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SocialProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SocialProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SocialProject"
    objects: {
      map: Prisma.$ProjectMapPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      description: string
      longDescription: string | null
      fundingGoal: number
      currentFunding: number
      currency: string
      walletAddress: string | null
      category: $Enums.ProjectCategory
      location: string | null
      tags: string | null
      verified: boolean
      active: boolean
      featured: boolean
      startDate: Date
      endDate: Date | null
      supporters: number
      views: number
      coverImage: string | null
      gallery: string | null
      organizer: string
      organizerEmail: string | null
      organizerPhone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["socialProject"]>
    composites: {}
  }

  type SocialProjectGetPayload<S extends boolean | null | undefined | SocialProjectDefaultArgs> = $Result.GetResult<Prisma.$SocialProjectPayload, S>

  type SocialProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SocialProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SocialProjectCountAggregateInputType | true
    }

  export interface SocialProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SocialProject'], meta: { name: 'SocialProject' } }
    /**
     * Find zero or one SocialProject that matches the filter.
     * @param {SocialProjectFindUniqueArgs} args - Arguments to find a SocialProject
     * @example
     * // Get one SocialProject
     * const socialProject = await prisma.socialProject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SocialProjectFindUniqueArgs>(args: SelectSubset<T, SocialProjectFindUniqueArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SocialProject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SocialProjectFindUniqueOrThrowArgs} args - Arguments to find a SocialProject
     * @example
     * // Get one SocialProject
     * const socialProject = await prisma.socialProject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SocialProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, SocialProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialProject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectFindFirstArgs} args - Arguments to find a SocialProject
     * @example
     * // Get one SocialProject
     * const socialProject = await prisma.socialProject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SocialProjectFindFirstArgs>(args?: SelectSubset<T, SocialProjectFindFirstArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialProject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectFindFirstOrThrowArgs} args - Arguments to find a SocialProject
     * @example
     * // Get one SocialProject
     * const socialProject = await prisma.socialProject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SocialProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, SocialProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SocialProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SocialProjects
     * const socialProjects = await prisma.socialProject.findMany()
     * 
     * // Get first 10 SocialProjects
     * const socialProjects = await prisma.socialProject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const socialProjectWithIdOnly = await prisma.socialProject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SocialProjectFindManyArgs>(args?: SelectSubset<T, SocialProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SocialProject.
     * @param {SocialProjectCreateArgs} args - Arguments to create a SocialProject.
     * @example
     * // Create one SocialProject
     * const SocialProject = await prisma.socialProject.create({
     *   data: {
     *     // ... data to create a SocialProject
     *   }
     * })
     * 
     */
    create<T extends SocialProjectCreateArgs>(args: SelectSubset<T, SocialProjectCreateArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SocialProjects.
     * @param {SocialProjectCreateManyArgs} args - Arguments to create many SocialProjects.
     * @example
     * // Create many SocialProjects
     * const socialProject = await prisma.socialProject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SocialProjectCreateManyArgs>(args?: SelectSubset<T, SocialProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SocialProjects and returns the data saved in the database.
     * @param {SocialProjectCreateManyAndReturnArgs} args - Arguments to create many SocialProjects.
     * @example
     * // Create many SocialProjects
     * const socialProject = await prisma.socialProject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SocialProjects and only return the `id`
     * const socialProjectWithIdOnly = await prisma.socialProject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SocialProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, SocialProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SocialProject.
     * @param {SocialProjectDeleteArgs} args - Arguments to delete one SocialProject.
     * @example
     * // Delete one SocialProject
     * const SocialProject = await prisma.socialProject.delete({
     *   where: {
     *     // ... filter to delete one SocialProject
     *   }
     * })
     * 
     */
    delete<T extends SocialProjectDeleteArgs>(args: SelectSubset<T, SocialProjectDeleteArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SocialProject.
     * @param {SocialProjectUpdateArgs} args - Arguments to update one SocialProject.
     * @example
     * // Update one SocialProject
     * const socialProject = await prisma.socialProject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SocialProjectUpdateArgs>(args: SelectSubset<T, SocialProjectUpdateArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SocialProjects.
     * @param {SocialProjectDeleteManyArgs} args - Arguments to filter SocialProjects to delete.
     * @example
     * // Delete a few SocialProjects
     * const { count } = await prisma.socialProject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SocialProjectDeleteManyArgs>(args?: SelectSubset<T, SocialProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SocialProjects
     * const socialProject = await prisma.socialProject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SocialProjectUpdateManyArgs>(args: SelectSubset<T, SocialProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialProjects and returns the data updated in the database.
     * @param {SocialProjectUpdateManyAndReturnArgs} args - Arguments to update many SocialProjects.
     * @example
     * // Update many SocialProjects
     * const socialProject = await prisma.socialProject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SocialProjects and only return the `id`
     * const socialProjectWithIdOnly = await prisma.socialProject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SocialProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, SocialProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SocialProject.
     * @param {SocialProjectUpsertArgs} args - Arguments to update or create a SocialProject.
     * @example
     * // Update or create a SocialProject
     * const socialProject = await prisma.socialProject.upsert({
     *   create: {
     *     // ... data to create a SocialProject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SocialProject we want to update
     *   }
     * })
     */
    upsert<T extends SocialProjectUpsertArgs>(args: SelectSubset<T, SocialProjectUpsertArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SocialProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectCountArgs} args - Arguments to filter SocialProjects to count.
     * @example
     * // Count the number of SocialProjects
     * const count = await prisma.socialProject.count({
     *   where: {
     *     // ... the filter for the SocialProjects we want to count
     *   }
     * })
    **/
    count<T extends SocialProjectCountArgs>(
      args?: Subset<T, SocialProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SocialProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SocialProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SocialProjectAggregateArgs>(args: Subset<T, SocialProjectAggregateArgs>): Prisma.PrismaPromise<GetSocialProjectAggregateType<T>>

    /**
     * Group by SocialProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SocialProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SocialProjectGroupByArgs['orderBy'] }
        : { orderBy?: SocialProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SocialProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSocialProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SocialProject model
   */
  readonly fields: SocialProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SocialProject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SocialProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    map<T extends SocialProject$mapArgs<ExtArgs> = {}>(args?: Subset<T, SocialProject$mapArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SocialProject model
   */
  interface SocialProjectFieldRefs {
    readonly id: FieldRef<"SocialProject", 'String'>
    readonly slug: FieldRef<"SocialProject", 'String'>
    readonly name: FieldRef<"SocialProject", 'String'>
    readonly description: FieldRef<"SocialProject", 'String'>
    readonly longDescription: FieldRef<"SocialProject", 'String'>
    readonly fundingGoal: FieldRef<"SocialProject", 'Float'>
    readonly currentFunding: FieldRef<"SocialProject", 'Float'>
    readonly currency: FieldRef<"SocialProject", 'String'>
    readonly walletAddress: FieldRef<"SocialProject", 'String'>
    readonly category: FieldRef<"SocialProject", 'ProjectCategory'>
    readonly location: FieldRef<"SocialProject", 'String'>
    readonly tags: FieldRef<"SocialProject", 'String'>
    readonly verified: FieldRef<"SocialProject", 'Boolean'>
    readonly active: FieldRef<"SocialProject", 'Boolean'>
    readonly featured: FieldRef<"SocialProject", 'Boolean'>
    readonly startDate: FieldRef<"SocialProject", 'DateTime'>
    readonly endDate: FieldRef<"SocialProject", 'DateTime'>
    readonly supporters: FieldRef<"SocialProject", 'Int'>
    readonly views: FieldRef<"SocialProject", 'Int'>
    readonly coverImage: FieldRef<"SocialProject", 'String'>
    readonly gallery: FieldRef<"SocialProject", 'String'>
    readonly organizer: FieldRef<"SocialProject", 'String'>
    readonly organizerEmail: FieldRef<"SocialProject", 'String'>
    readonly organizerPhone: FieldRef<"SocialProject", 'String'>
    readonly createdAt: FieldRef<"SocialProject", 'DateTime'>
    readonly updatedAt: FieldRef<"SocialProject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SocialProject findUnique
   */
  export type SocialProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter, which SocialProject to fetch.
     */
    where: SocialProjectWhereUniqueInput
  }

  /**
   * SocialProject findUniqueOrThrow
   */
  export type SocialProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter, which SocialProject to fetch.
     */
    where: SocialProjectWhereUniqueInput
  }

  /**
   * SocialProject findFirst
   */
  export type SocialProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter, which SocialProject to fetch.
     */
    where?: SocialProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialProjects to fetch.
     */
    orderBy?: SocialProjectOrderByWithRelationInput | SocialProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialProjects.
     */
    cursor?: SocialProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialProjects.
     */
    distinct?: SocialProjectScalarFieldEnum | SocialProjectScalarFieldEnum[]
  }

  /**
   * SocialProject findFirstOrThrow
   */
  export type SocialProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter, which SocialProject to fetch.
     */
    where?: SocialProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialProjects to fetch.
     */
    orderBy?: SocialProjectOrderByWithRelationInput | SocialProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialProjects.
     */
    cursor?: SocialProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialProjects.
     */
    distinct?: SocialProjectScalarFieldEnum | SocialProjectScalarFieldEnum[]
  }

  /**
   * SocialProject findMany
   */
  export type SocialProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter, which SocialProjects to fetch.
     */
    where?: SocialProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialProjects to fetch.
     */
    orderBy?: SocialProjectOrderByWithRelationInput | SocialProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SocialProjects.
     */
    cursor?: SocialProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialProjects.
     */
    skip?: number
    distinct?: SocialProjectScalarFieldEnum | SocialProjectScalarFieldEnum[]
  }

  /**
   * SocialProject create
   */
  export type SocialProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a SocialProject.
     */
    data: XOR<SocialProjectCreateInput, SocialProjectUncheckedCreateInput>
  }

  /**
   * SocialProject createMany
   */
  export type SocialProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SocialProjects.
     */
    data: SocialProjectCreateManyInput | SocialProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialProject createManyAndReturn
   */
  export type SocialProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * The data used to create many SocialProjects.
     */
    data: SocialProjectCreateManyInput | SocialProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialProject update
   */
  export type SocialProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a SocialProject.
     */
    data: XOR<SocialProjectUpdateInput, SocialProjectUncheckedUpdateInput>
    /**
     * Choose, which SocialProject to update.
     */
    where: SocialProjectWhereUniqueInput
  }

  /**
   * SocialProject updateMany
   */
  export type SocialProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SocialProjects.
     */
    data: XOR<SocialProjectUpdateManyMutationInput, SocialProjectUncheckedUpdateManyInput>
    /**
     * Filter which SocialProjects to update
     */
    where?: SocialProjectWhereInput
    /**
     * Limit how many SocialProjects to update.
     */
    limit?: number
  }

  /**
   * SocialProject updateManyAndReturn
   */
  export type SocialProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * The data used to update SocialProjects.
     */
    data: XOR<SocialProjectUpdateManyMutationInput, SocialProjectUncheckedUpdateManyInput>
    /**
     * Filter which SocialProjects to update
     */
    where?: SocialProjectWhereInput
    /**
     * Limit how many SocialProjects to update.
     */
    limit?: number
  }

  /**
   * SocialProject upsert
   */
  export type SocialProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the SocialProject to update in case it exists.
     */
    where: SocialProjectWhereUniqueInput
    /**
     * In case the SocialProject found by the `where` argument doesn't exist, create a new SocialProject with this data.
     */
    create: XOR<SocialProjectCreateInput, SocialProjectUncheckedCreateInput>
    /**
     * In case the SocialProject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SocialProjectUpdateInput, SocialProjectUncheckedUpdateInput>
  }

  /**
   * SocialProject delete
   */
  export type SocialProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
    /**
     * Filter which SocialProject to delete.
     */
    where: SocialProjectWhereUniqueInput
  }

  /**
   * SocialProject deleteMany
   */
  export type SocialProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialProjects to delete
     */
    where?: SocialProjectWhereInput
    /**
     * Limit how many SocialProjects to delete.
     */
    limit?: number
  }

  /**
   * SocialProject.map
   */
  export type SocialProject$mapArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    where?: ProjectMapWhereInput
  }

  /**
   * SocialProject without action
   */
  export type SocialProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialProject
     */
    select?: SocialProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialProject
     */
    omit?: SocialProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectMap
   */

  export type AggregateProjectMap = {
    _count: ProjectMapCountAggregateOutputType | null
    _avg: ProjectMapAvgAggregateOutputType | null
    _sum: ProjectMapSumAggregateOutputType | null
    _min: ProjectMapMinAggregateOutputType | null
    _max: ProjectMapMaxAggregateOutputType | null
  }

  export type ProjectMapAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type ProjectMapSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type ProjectMapMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    latitude: number | null
    longitude: number | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    markerColor: string | null
    markerIcon: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMapMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    latitude: number | null
    longitude: number | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    markerColor: string | null
    markerIcon: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMapCountAggregateOutputType = {
    id: number
    projectId: number
    latitude: number
    longitude: number
    address: number
    city: number
    state: number
    country: number
    markerColor: number
    markerIcon: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMapAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type ProjectMapSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type ProjectMapMinAggregateInputType = {
    id?: true
    projectId?: true
    latitude?: true
    longitude?: true
    address?: true
    city?: true
    state?: true
    country?: true
    markerColor?: true
    markerIcon?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMapMaxAggregateInputType = {
    id?: true
    projectId?: true
    latitude?: true
    longitude?: true
    address?: true
    city?: true
    state?: true
    country?: true
    markerColor?: true
    markerIcon?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMapCountAggregateInputType = {
    id?: true
    projectId?: true
    latitude?: true
    longitude?: true
    address?: true
    city?: true
    state?: true
    country?: true
    markerColor?: true
    markerIcon?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectMapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMap to aggregate.
     */
    where?: ProjectMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMaps to fetch.
     */
    orderBy?: ProjectMapOrderByWithRelationInput | ProjectMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectMaps
    **/
    _count?: true | ProjectMapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectMapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectMapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMapMaxAggregateInputType
  }

  export type GetProjectMapAggregateType<T extends ProjectMapAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectMap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectMap[P]>
      : GetScalarType<T[P], AggregateProjectMap[P]>
  }




  export type ProjectMapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMapWhereInput
    orderBy?: ProjectMapOrderByWithAggregationInput | ProjectMapOrderByWithAggregationInput[]
    by: ProjectMapScalarFieldEnum[] | ProjectMapScalarFieldEnum
    having?: ProjectMapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectMapCountAggregateInputType | true
    _avg?: ProjectMapAvgAggregateInputType
    _sum?: ProjectMapSumAggregateInputType
    _min?: ProjectMapMinAggregateInputType
    _max?: ProjectMapMaxAggregateInputType
  }

  export type ProjectMapGroupByOutputType = {
    id: string
    projectId: string
    latitude: number
    longitude: number
    address: string | null
    city: string
    state: string
    country: string
    markerColor: string
    markerIcon: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectMapCountAggregateOutputType | null
    _avg: ProjectMapAvgAggregateOutputType | null
    _sum: ProjectMapSumAggregateOutputType | null
    _min: ProjectMapMinAggregateOutputType | null
    _max: ProjectMapMaxAggregateOutputType | null
  }

  type GetProjectMapGroupByPayload<T extends ProjectMapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectMapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectMapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectMapGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectMapGroupByOutputType[P]>
        }
      >
    >


  export type ProjectMapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    markerColor?: boolean
    markerIcon?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMap"]>

  export type ProjectMapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    markerColor?: boolean
    markerIcon?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMap"]>

  export type ProjectMapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    markerColor?: boolean
    markerIcon?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMap"]>

  export type ProjectMapSelectScalar = {
    id?: boolean
    projectId?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    markerColor?: boolean
    markerIcon?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectMapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "latitude" | "longitude" | "address" | "city" | "state" | "country" | "markerColor" | "markerIcon" | "createdAt" | "updatedAt", ExtArgs["result"]["projectMap"]>
  export type ProjectMapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | SocialProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectMapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectMap"
    objects: {
      project: Prisma.$SocialProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      latitude: number
      longitude: number
      address: string | null
      city: string
      state: string
      country: string
      markerColor: string
      markerIcon: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["projectMap"]>
    composites: {}
  }

  type ProjectMapGetPayload<S extends boolean | null | undefined | ProjectMapDefaultArgs> = $Result.GetResult<Prisma.$ProjectMapPayload, S>

  type ProjectMapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectMapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectMapCountAggregateInputType | true
    }

  export interface ProjectMapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectMap'], meta: { name: 'ProjectMap' } }
    /**
     * Find zero or one ProjectMap that matches the filter.
     * @param {ProjectMapFindUniqueArgs} args - Arguments to find a ProjectMap
     * @example
     * // Get one ProjectMap
     * const projectMap = await prisma.projectMap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectMapFindUniqueArgs>(args: SelectSubset<T, ProjectMapFindUniqueArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectMap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectMapFindUniqueOrThrowArgs} args - Arguments to find a ProjectMap
     * @example
     * // Get one ProjectMap
     * const projectMap = await prisma.projectMap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectMapFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectMapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectMap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapFindFirstArgs} args - Arguments to find a ProjectMap
     * @example
     * // Get one ProjectMap
     * const projectMap = await prisma.projectMap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectMapFindFirstArgs>(args?: SelectSubset<T, ProjectMapFindFirstArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectMap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapFindFirstOrThrowArgs} args - Arguments to find a ProjectMap
     * @example
     * // Get one ProjectMap
     * const projectMap = await prisma.projectMap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectMapFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectMapFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectMaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectMaps
     * const projectMaps = await prisma.projectMap.findMany()
     * 
     * // Get first 10 ProjectMaps
     * const projectMaps = await prisma.projectMap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectMapWithIdOnly = await prisma.projectMap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectMapFindManyArgs>(args?: SelectSubset<T, ProjectMapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectMap.
     * @param {ProjectMapCreateArgs} args - Arguments to create a ProjectMap.
     * @example
     * // Create one ProjectMap
     * const ProjectMap = await prisma.projectMap.create({
     *   data: {
     *     // ... data to create a ProjectMap
     *   }
     * })
     * 
     */
    create<T extends ProjectMapCreateArgs>(args: SelectSubset<T, ProjectMapCreateArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectMaps.
     * @param {ProjectMapCreateManyArgs} args - Arguments to create many ProjectMaps.
     * @example
     * // Create many ProjectMaps
     * const projectMap = await prisma.projectMap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectMapCreateManyArgs>(args?: SelectSubset<T, ProjectMapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectMaps and returns the data saved in the database.
     * @param {ProjectMapCreateManyAndReturnArgs} args - Arguments to create many ProjectMaps.
     * @example
     * // Create many ProjectMaps
     * const projectMap = await prisma.projectMap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectMaps and only return the `id`
     * const projectMapWithIdOnly = await prisma.projectMap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectMapCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectMapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectMap.
     * @param {ProjectMapDeleteArgs} args - Arguments to delete one ProjectMap.
     * @example
     * // Delete one ProjectMap
     * const ProjectMap = await prisma.projectMap.delete({
     *   where: {
     *     // ... filter to delete one ProjectMap
     *   }
     * })
     * 
     */
    delete<T extends ProjectMapDeleteArgs>(args: SelectSubset<T, ProjectMapDeleteArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectMap.
     * @param {ProjectMapUpdateArgs} args - Arguments to update one ProjectMap.
     * @example
     * // Update one ProjectMap
     * const projectMap = await prisma.projectMap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectMapUpdateArgs>(args: SelectSubset<T, ProjectMapUpdateArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectMaps.
     * @param {ProjectMapDeleteManyArgs} args - Arguments to filter ProjectMaps to delete.
     * @example
     * // Delete a few ProjectMaps
     * const { count } = await prisma.projectMap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectMapDeleteManyArgs>(args?: SelectSubset<T, ProjectMapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectMaps
     * const projectMap = await prisma.projectMap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectMapUpdateManyArgs>(args: SelectSubset<T, ProjectMapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMaps and returns the data updated in the database.
     * @param {ProjectMapUpdateManyAndReturnArgs} args - Arguments to update many ProjectMaps.
     * @example
     * // Update many ProjectMaps
     * const projectMap = await prisma.projectMap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectMaps and only return the `id`
     * const projectMapWithIdOnly = await prisma.projectMap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectMapUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectMapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectMap.
     * @param {ProjectMapUpsertArgs} args - Arguments to update or create a ProjectMap.
     * @example
     * // Update or create a ProjectMap
     * const projectMap = await prisma.projectMap.upsert({
     *   create: {
     *     // ... data to create a ProjectMap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectMap we want to update
     *   }
     * })
     */
    upsert<T extends ProjectMapUpsertArgs>(args: SelectSubset<T, ProjectMapUpsertArgs<ExtArgs>>): Prisma__ProjectMapClient<$Result.GetResult<Prisma.$ProjectMapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectMaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapCountArgs} args - Arguments to filter ProjectMaps to count.
     * @example
     * // Count the number of ProjectMaps
     * const count = await prisma.projectMap.count({
     *   where: {
     *     // ... the filter for the ProjectMaps we want to count
     *   }
     * })
    **/
    count<T extends ProjectMapCountArgs>(
      args?: Subset<T, ProjectMapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectMapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectMap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectMapAggregateArgs>(args: Subset<T, ProjectMapAggregateArgs>): Prisma.PrismaPromise<GetProjectMapAggregateType<T>>

    /**
     * Group by ProjectMap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectMapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectMapGroupByArgs['orderBy'] }
        : { orderBy?: ProjectMapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectMapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectMapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectMap model
   */
  readonly fields: ProjectMapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectMap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectMapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends SocialProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SocialProjectDefaultArgs<ExtArgs>>): Prisma__SocialProjectClient<$Result.GetResult<Prisma.$SocialProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectMap model
   */
  interface ProjectMapFieldRefs {
    readonly id: FieldRef<"ProjectMap", 'String'>
    readonly projectId: FieldRef<"ProjectMap", 'String'>
    readonly latitude: FieldRef<"ProjectMap", 'Float'>
    readonly longitude: FieldRef<"ProjectMap", 'Float'>
    readonly address: FieldRef<"ProjectMap", 'String'>
    readonly city: FieldRef<"ProjectMap", 'String'>
    readonly state: FieldRef<"ProjectMap", 'String'>
    readonly country: FieldRef<"ProjectMap", 'String'>
    readonly markerColor: FieldRef<"ProjectMap", 'String'>
    readonly markerIcon: FieldRef<"ProjectMap", 'String'>
    readonly createdAt: FieldRef<"ProjectMap", 'DateTime'>
    readonly updatedAt: FieldRef<"ProjectMap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectMap findUnique
   */
  export type ProjectMapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMap to fetch.
     */
    where: ProjectMapWhereUniqueInput
  }

  /**
   * ProjectMap findUniqueOrThrow
   */
  export type ProjectMapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMap to fetch.
     */
    where: ProjectMapWhereUniqueInput
  }

  /**
   * ProjectMap findFirst
   */
  export type ProjectMapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMap to fetch.
     */
    where?: ProjectMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMaps to fetch.
     */
    orderBy?: ProjectMapOrderByWithRelationInput | ProjectMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMaps.
     */
    cursor?: ProjectMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMaps.
     */
    distinct?: ProjectMapScalarFieldEnum | ProjectMapScalarFieldEnum[]
  }

  /**
   * ProjectMap findFirstOrThrow
   */
  export type ProjectMapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMap to fetch.
     */
    where?: ProjectMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMaps to fetch.
     */
    orderBy?: ProjectMapOrderByWithRelationInput | ProjectMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMaps.
     */
    cursor?: ProjectMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMaps.
     */
    distinct?: ProjectMapScalarFieldEnum | ProjectMapScalarFieldEnum[]
  }

  /**
   * ProjectMap findMany
   */
  export type ProjectMapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMaps to fetch.
     */
    where?: ProjectMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMaps to fetch.
     */
    orderBy?: ProjectMapOrderByWithRelationInput | ProjectMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectMaps.
     */
    cursor?: ProjectMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMaps.
     */
    skip?: number
    distinct?: ProjectMapScalarFieldEnum | ProjectMapScalarFieldEnum[]
  }

  /**
   * ProjectMap create
   */
  export type ProjectMapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectMap.
     */
    data: XOR<ProjectMapCreateInput, ProjectMapUncheckedCreateInput>
  }

  /**
   * ProjectMap createMany
   */
  export type ProjectMapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectMaps.
     */
    data: ProjectMapCreateManyInput | ProjectMapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectMap createManyAndReturn
   */
  export type ProjectMapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectMaps.
     */
    data: ProjectMapCreateManyInput | ProjectMapCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMap update
   */
  export type ProjectMapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectMap.
     */
    data: XOR<ProjectMapUpdateInput, ProjectMapUncheckedUpdateInput>
    /**
     * Choose, which ProjectMap to update.
     */
    where: ProjectMapWhereUniqueInput
  }

  /**
   * ProjectMap updateMany
   */
  export type ProjectMapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectMaps.
     */
    data: XOR<ProjectMapUpdateManyMutationInput, ProjectMapUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMaps to update
     */
    where?: ProjectMapWhereInput
    /**
     * Limit how many ProjectMaps to update.
     */
    limit?: number
  }

  /**
   * ProjectMap updateManyAndReturn
   */
  export type ProjectMapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * The data used to update ProjectMaps.
     */
    data: XOR<ProjectMapUpdateManyMutationInput, ProjectMapUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMaps to update
     */
    where?: ProjectMapWhereInput
    /**
     * Limit how many ProjectMaps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMap upsert
   */
  export type ProjectMapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectMap to update in case it exists.
     */
    where: ProjectMapWhereUniqueInput
    /**
     * In case the ProjectMap found by the `where` argument doesn't exist, create a new ProjectMap with this data.
     */
    create: XOR<ProjectMapCreateInput, ProjectMapUncheckedCreateInput>
    /**
     * In case the ProjectMap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectMapUpdateInput, ProjectMapUncheckedUpdateInput>
  }

  /**
   * ProjectMap delete
   */
  export type ProjectMapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
    /**
     * Filter which ProjectMap to delete.
     */
    where: ProjectMapWhereUniqueInput
  }

  /**
   * ProjectMap deleteMany
   */
  export type ProjectMapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMaps to delete
     */
    where?: ProjectMapWhereInput
    /**
     * Limit how many ProjectMaps to delete.
     */
    limit?: number
  }

  /**
   * ProjectMap without action
   */
  export type ProjectMapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMap
     */
    select?: ProjectMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMap
     */
    omit?: ProjectMapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMapInclude<ExtArgs> | null
  }


  /**
   * Model UserProgress
   */

  export type AggregateUserProgress = {
    _count: UserProgressCountAggregateOutputType | null
    _avg: UserProgressAvgAggregateOutputType | null
    _sum: UserProgressSumAggregateOutputType | null
    _min: UserProgressMinAggregateOutputType | null
    _max: UserProgressMaxAggregateOutputType | null
  }

  export type UserProgressAvgAggregateOutputType = {
    progress: number | null
    quizScore: number | null
    quizAttempts: number | null
  }

  export type UserProgressSumAggregateOutputType = {
    progress: number | null
    quizScore: number | null
    quizAttempts: number | null
  }

  export type UserProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    articleSlug: string | null
    completed: boolean | null
    progress: number | null
    quizScore: number | null
    quizAttempts: number | null
    certificateIssued: boolean | null
    certificateUrl: string | null
    startedAt: Date | null
    completedAt: Date | null
    lastAccessed: Date | null
  }

  export type UserProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    articleSlug: string | null
    completed: boolean | null
    progress: number | null
    quizScore: number | null
    quizAttempts: number | null
    certificateIssued: boolean | null
    certificateUrl: string | null
    startedAt: Date | null
    completedAt: Date | null
    lastAccessed: Date | null
  }

  export type UserProgressCountAggregateOutputType = {
    id: number
    userId: number
    articleSlug: number
    completed: number
    progress: number
    quizScore: number
    quizAttempts: number
    certificateIssued: number
    certificateUrl: number
    startedAt: number
    completedAt: number
    lastAccessed: number
    _all: number
  }


  export type UserProgressAvgAggregateInputType = {
    progress?: true
    quizScore?: true
    quizAttempts?: true
  }

  export type UserProgressSumAggregateInputType = {
    progress?: true
    quizScore?: true
    quizAttempts?: true
  }

  export type UserProgressMinAggregateInputType = {
    id?: true
    userId?: true
    articleSlug?: true
    completed?: true
    progress?: true
    quizScore?: true
    quizAttempts?: true
    certificateIssued?: true
    certificateUrl?: true
    startedAt?: true
    completedAt?: true
    lastAccessed?: true
  }

  export type UserProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    articleSlug?: true
    completed?: true
    progress?: true
    quizScore?: true
    quizAttempts?: true
    certificateIssued?: true
    certificateUrl?: true
    startedAt?: true
    completedAt?: true
    lastAccessed?: true
  }

  export type UserProgressCountAggregateInputType = {
    id?: true
    userId?: true
    articleSlug?: true
    completed?: true
    progress?: true
    quizScore?: true
    quizAttempts?: true
    certificateIssued?: true
    certificateUrl?: true
    startedAt?: true
    completedAt?: true
    lastAccessed?: true
    _all?: true
  }

  export type UserProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgress to aggregate.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProgresses
    **/
    _count?: true | UserProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProgressMaxAggregateInputType
  }

  export type GetUserProgressAggregateType<T extends UserProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProgress[P]>
      : GetScalarType<T[P], AggregateUserProgress[P]>
  }




  export type UserProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressWhereInput
    orderBy?: UserProgressOrderByWithAggregationInput | UserProgressOrderByWithAggregationInput[]
    by: UserProgressScalarFieldEnum[] | UserProgressScalarFieldEnum
    having?: UserProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProgressCountAggregateInputType | true
    _avg?: UserProgressAvgAggregateInputType
    _sum?: UserProgressSumAggregateInputType
    _min?: UserProgressMinAggregateInputType
    _max?: UserProgressMaxAggregateInputType
  }

  export type UserProgressGroupByOutputType = {
    id: string
    userId: string
    articleSlug: string
    completed: boolean
    progress: number
    quizScore: number | null
    quizAttempts: number
    certificateIssued: boolean
    certificateUrl: string | null
    startedAt: Date
    completedAt: Date | null
    lastAccessed: Date
    _count: UserProgressCountAggregateOutputType | null
    _avg: UserProgressAvgAggregateOutputType | null
    _sum: UserProgressSumAggregateOutputType | null
    _min: UserProgressMinAggregateOutputType | null
    _max: UserProgressMaxAggregateOutputType | null
  }

  type GetUserProgressGroupByPayload<T extends UserProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleSlug?: boolean
    completed?: boolean
    progress?: boolean
    quizScore?: boolean
    quizAttempts?: boolean
    certificateIssued?: boolean
    certificateUrl?: boolean
    startedAt?: boolean
    completedAt?: boolean
    lastAccessed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleSlug?: boolean
    completed?: boolean
    progress?: boolean
    quizScore?: boolean
    quizAttempts?: boolean
    certificateIssued?: boolean
    certificateUrl?: boolean
    startedAt?: boolean
    completedAt?: boolean
    lastAccessed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleSlug?: boolean
    completed?: boolean
    progress?: boolean
    quizScore?: boolean
    quizAttempts?: boolean
    certificateIssued?: boolean
    certificateUrl?: boolean
    startedAt?: boolean
    completedAt?: boolean
    lastAccessed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    articleSlug?: boolean
    completed?: boolean
    progress?: boolean
    quizScore?: boolean
    quizAttempts?: boolean
    certificateIssued?: boolean
    certificateUrl?: boolean
    startedAt?: boolean
    completedAt?: boolean
    lastAccessed?: boolean
  }

  export type UserProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "articleSlug" | "completed" | "progress" | "quizScore" | "quizAttempts" | "certificateIssued" | "certificateUrl" | "startedAt" | "completedAt" | "lastAccessed", ExtArgs["result"]["userProgress"]>
  export type UserProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      articleSlug: string
      completed: boolean
      progress: number
      quizScore: number | null
      quizAttempts: number
      certificateIssued: boolean
      certificateUrl: string | null
      startedAt: Date
      completedAt: Date | null
      lastAccessed: Date
    }, ExtArgs["result"]["userProgress"]>
    composites: {}
  }

  type UserProgressGetPayload<S extends boolean | null | undefined | UserProgressDefaultArgs> = $Result.GetResult<Prisma.$UserProgressPayload, S>

  type UserProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProgressCountAggregateInputType | true
    }

  export interface UserProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProgress'], meta: { name: 'UserProgress' } }
    /**
     * Find zero or one UserProgress that matches the filter.
     * @param {UserProgressFindUniqueArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProgressFindUniqueArgs>(args: SelectSubset<T, UserProgressFindUniqueArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProgressFindUniqueOrThrowArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindFirstArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProgressFindFirstArgs>(args?: SelectSubset<T, UserProgressFindFirstArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindFirstOrThrowArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProgresses
     * const userProgresses = await prisma.userProgress.findMany()
     * 
     * // Get first 10 UserProgresses
     * const userProgresses = await prisma.userProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProgressFindManyArgs>(args?: SelectSubset<T, UserProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProgress.
     * @param {UserProgressCreateArgs} args - Arguments to create a UserProgress.
     * @example
     * // Create one UserProgress
     * const UserProgress = await prisma.userProgress.create({
     *   data: {
     *     // ... data to create a UserProgress
     *   }
     * })
     * 
     */
    create<T extends UserProgressCreateArgs>(args: SelectSubset<T, UserProgressCreateArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProgresses.
     * @param {UserProgressCreateManyArgs} args - Arguments to create many UserProgresses.
     * @example
     * // Create many UserProgresses
     * const userProgress = await prisma.userProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProgressCreateManyArgs>(args?: SelectSubset<T, UserProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProgresses and returns the data saved in the database.
     * @param {UserProgressCreateManyAndReturnArgs} args - Arguments to create many UserProgresses.
     * @example
     * // Create many UserProgresses
     * const userProgress = await prisma.userProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProgresses and only return the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProgress.
     * @param {UserProgressDeleteArgs} args - Arguments to delete one UserProgress.
     * @example
     * // Delete one UserProgress
     * const UserProgress = await prisma.userProgress.delete({
     *   where: {
     *     // ... filter to delete one UserProgress
     *   }
     * })
     * 
     */
    delete<T extends UserProgressDeleteArgs>(args: SelectSubset<T, UserProgressDeleteArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProgress.
     * @param {UserProgressUpdateArgs} args - Arguments to update one UserProgress.
     * @example
     * // Update one UserProgress
     * const userProgress = await prisma.userProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProgressUpdateArgs>(args: SelectSubset<T, UserProgressUpdateArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProgresses.
     * @param {UserProgressDeleteManyArgs} args - Arguments to filter UserProgresses to delete.
     * @example
     * // Delete a few UserProgresses
     * const { count } = await prisma.userProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProgressDeleteManyArgs>(args?: SelectSubset<T, UserProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProgresses
     * const userProgress = await prisma.userProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProgressUpdateManyArgs>(args: SelectSubset<T, UserProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProgresses and returns the data updated in the database.
     * @param {UserProgressUpdateManyAndReturnArgs} args - Arguments to update many UserProgresses.
     * @example
     * // Update many UserProgresses
     * const userProgress = await prisma.userProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProgresses and only return the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProgress.
     * @param {UserProgressUpsertArgs} args - Arguments to update or create a UserProgress.
     * @example
     * // Update or create a UserProgress
     * const userProgress = await prisma.userProgress.upsert({
     *   create: {
     *     // ... data to create a UserProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserProgressUpsertArgs>(args: SelectSubset<T, UserProgressUpsertArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressCountArgs} args - Arguments to filter UserProgresses to count.
     * @example
     * // Count the number of UserProgresses
     * const count = await prisma.userProgress.count({
     *   where: {
     *     // ... the filter for the UserProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserProgressCountArgs>(
      args?: Subset<T, UserProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProgressAggregateArgs>(args: Subset<T, UserProgressAggregateArgs>): Prisma.PrismaPromise<GetUserProgressAggregateType<T>>

    /**
     * Group by UserProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProgress model
   */
  readonly fields: UserProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProgress model
   */
  interface UserProgressFieldRefs {
    readonly id: FieldRef<"UserProgress", 'String'>
    readonly userId: FieldRef<"UserProgress", 'String'>
    readonly articleSlug: FieldRef<"UserProgress", 'String'>
    readonly completed: FieldRef<"UserProgress", 'Boolean'>
    readonly progress: FieldRef<"UserProgress", 'Int'>
    readonly quizScore: FieldRef<"UserProgress", 'Float'>
    readonly quizAttempts: FieldRef<"UserProgress", 'Int'>
    readonly certificateIssued: FieldRef<"UserProgress", 'Boolean'>
    readonly certificateUrl: FieldRef<"UserProgress", 'String'>
    readonly startedAt: FieldRef<"UserProgress", 'DateTime'>
    readonly completedAt: FieldRef<"UserProgress", 'DateTime'>
    readonly lastAccessed: FieldRef<"UserProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProgress findUnique
   */
  export type UserProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress findUniqueOrThrow
   */
  export type UserProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress findFirst
   */
  export type UserProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgresses.
     */
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress findFirstOrThrow
   */
  export type UserProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgresses.
     */
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress findMany
   */
  export type UserProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgresses to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress create
   */
  export type UserProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProgress.
     */
    data: XOR<UserProgressCreateInput, UserProgressUncheckedCreateInput>
  }

  /**
   * UserProgress createMany
   */
  export type UserProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProgresses.
     */
    data: UserProgressCreateManyInput | UserProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProgress createManyAndReturn
   */
  export type UserProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserProgresses.
     */
    data: UserProgressCreateManyInput | UserProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgress update
   */
  export type UserProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProgress.
     */
    data: XOR<UserProgressUpdateInput, UserProgressUncheckedUpdateInput>
    /**
     * Choose, which UserProgress to update.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress updateMany
   */
  export type UserProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProgresses.
     */
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserProgresses to update
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to update.
     */
    limit?: number
  }

  /**
   * UserProgress updateManyAndReturn
   */
  export type UserProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserProgresses.
     */
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserProgresses to update
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgress upsert
   */
  export type UserProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProgress to update in case it exists.
     */
    where: UserProgressWhereUniqueInput
    /**
     * In case the UserProgress found by the `where` argument doesn't exist, create a new UserProgress with this data.
     */
    create: XOR<UserProgressCreateInput, UserProgressUncheckedCreateInput>
    /**
     * In case the UserProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProgressUpdateInput, UserProgressUncheckedUpdateInput>
  }

  /**
   * UserProgress delete
   */
  export type UserProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter which UserProgress to delete.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress deleteMany
   */
  export type UserProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgresses to delete
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserProgress without action
   */
  export type UserProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
  }


  /**
   * Model ArticleFactCheck
   */

  export type AggregateArticleFactCheck = {
    _count: ArticleFactCheckCountAggregateOutputType | null
    _avg: ArticleFactCheckAvgAggregateOutputType | null
    _sum: ArticleFactCheckSumAggregateOutputType | null
    _min: ArticleFactCheckMinAggregateOutputType | null
    _max: ArticleFactCheckMaxAggregateOutputType | null
  }

  export type ArticleFactCheckAvgAggregateOutputType = {
    score: number | null
  }

  export type ArticleFactCheckSumAggregateOutputType = {
    score: number | null
  }

  export type ArticleFactCheckMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    score: number | null
    status: string | null
    summary: string | null
    createdAt: Date | null
  }

  export type ArticleFactCheckMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    score: number | null
    status: string | null
    summary: string | null
    createdAt: Date | null
  }

  export type ArticleFactCheckCountAggregateOutputType = {
    id: number
    articleId: number
    userId: number
    score: number
    status: number
    summary: number
    createdAt: number
    _all: number
  }


  export type ArticleFactCheckAvgAggregateInputType = {
    score?: true
  }

  export type ArticleFactCheckSumAggregateInputType = {
    score?: true
  }

  export type ArticleFactCheckMinAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    score?: true
    status?: true
    summary?: true
    createdAt?: true
  }

  export type ArticleFactCheckMaxAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    score?: true
    status?: true
    summary?: true
    createdAt?: true
  }

  export type ArticleFactCheckCountAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    score?: true
    status?: true
    summary?: true
    createdAt?: true
    _all?: true
  }

  export type ArticleFactCheckAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleFactCheck to aggregate.
     */
    where?: ArticleFactCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleFactChecks to fetch.
     */
    orderBy?: ArticleFactCheckOrderByWithRelationInput | ArticleFactCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleFactCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleFactChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleFactChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleFactChecks
    **/
    _count?: true | ArticleFactCheckCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleFactCheckAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleFactCheckSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleFactCheckMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleFactCheckMaxAggregateInputType
  }

  export type GetArticleFactCheckAggregateType<T extends ArticleFactCheckAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleFactCheck]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleFactCheck[P]>
      : GetScalarType<T[P], AggregateArticleFactCheck[P]>
  }




  export type ArticleFactCheckGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleFactCheckWhereInput
    orderBy?: ArticleFactCheckOrderByWithAggregationInput | ArticleFactCheckOrderByWithAggregationInput[]
    by: ArticleFactCheckScalarFieldEnum[] | ArticleFactCheckScalarFieldEnum
    having?: ArticleFactCheckScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleFactCheckCountAggregateInputType | true
    _avg?: ArticleFactCheckAvgAggregateInputType
    _sum?: ArticleFactCheckSumAggregateInputType
    _min?: ArticleFactCheckMinAggregateInputType
    _max?: ArticleFactCheckMaxAggregateInputType
  }

  export type ArticleFactCheckGroupByOutputType = {
    id: string
    articleId: string
    userId: string
    score: number
    status: string
    summary: string
    createdAt: Date
    _count: ArticleFactCheckCountAggregateOutputType | null
    _avg: ArticleFactCheckAvgAggregateOutputType | null
    _sum: ArticleFactCheckSumAggregateOutputType | null
    _min: ArticleFactCheckMinAggregateOutputType | null
    _max: ArticleFactCheckMaxAggregateOutputType | null
  }

  type GetArticleFactCheckGroupByPayload<T extends ArticleFactCheckGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleFactCheckGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleFactCheckGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleFactCheckGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleFactCheckGroupByOutputType[P]>
        }
      >
    >


  export type ArticleFactCheckSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    score?: boolean
    status?: boolean
    summary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["articleFactCheck"]>

  export type ArticleFactCheckSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    score?: boolean
    status?: boolean
    summary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["articleFactCheck"]>

  export type ArticleFactCheckSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    score?: boolean
    status?: boolean
    summary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["articleFactCheck"]>

  export type ArticleFactCheckSelectScalar = {
    id?: boolean
    articleId?: boolean
    userId?: boolean
    score?: boolean
    status?: boolean
    summary?: boolean
    createdAt?: boolean
  }

  export type ArticleFactCheckOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "userId" | "score" | "status" | "summary" | "createdAt", ExtArgs["result"]["articleFactCheck"]>

  export type $ArticleFactCheckPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleFactCheck"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      userId: string
      score: number
      status: string
      summary: string
      createdAt: Date
    }, ExtArgs["result"]["articleFactCheck"]>
    composites: {}
  }

  type ArticleFactCheckGetPayload<S extends boolean | null | undefined | ArticleFactCheckDefaultArgs> = $Result.GetResult<Prisma.$ArticleFactCheckPayload, S>

  type ArticleFactCheckCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFactCheckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleFactCheckCountAggregateInputType | true
    }

  export interface ArticleFactCheckDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleFactCheck'], meta: { name: 'ArticleFactCheck' } }
    /**
     * Find zero or one ArticleFactCheck that matches the filter.
     * @param {ArticleFactCheckFindUniqueArgs} args - Arguments to find a ArticleFactCheck
     * @example
     * // Get one ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFactCheckFindUniqueArgs>(args: SelectSubset<T, ArticleFactCheckFindUniqueArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleFactCheck that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFactCheckFindUniqueOrThrowArgs} args - Arguments to find a ArticleFactCheck
     * @example
     * // Get one ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFactCheckFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFactCheckFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleFactCheck that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckFindFirstArgs} args - Arguments to find a ArticleFactCheck
     * @example
     * // Get one ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFactCheckFindFirstArgs>(args?: SelectSubset<T, ArticleFactCheckFindFirstArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleFactCheck that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckFindFirstOrThrowArgs} args - Arguments to find a ArticleFactCheck
     * @example
     * // Get one ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFactCheckFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFactCheckFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleFactChecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleFactChecks
     * const articleFactChecks = await prisma.articleFactCheck.findMany()
     * 
     * // Get first 10 ArticleFactChecks
     * const articleFactChecks = await prisma.articleFactCheck.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleFactCheckWithIdOnly = await prisma.articleFactCheck.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFactCheckFindManyArgs>(args?: SelectSubset<T, ArticleFactCheckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleFactCheck.
     * @param {ArticleFactCheckCreateArgs} args - Arguments to create a ArticleFactCheck.
     * @example
     * // Create one ArticleFactCheck
     * const ArticleFactCheck = await prisma.articleFactCheck.create({
     *   data: {
     *     // ... data to create a ArticleFactCheck
     *   }
     * })
     * 
     */
    create<T extends ArticleFactCheckCreateArgs>(args: SelectSubset<T, ArticleFactCheckCreateArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleFactChecks.
     * @param {ArticleFactCheckCreateManyArgs} args - Arguments to create many ArticleFactChecks.
     * @example
     * // Create many ArticleFactChecks
     * const articleFactCheck = await prisma.articleFactCheck.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleFactCheckCreateManyArgs>(args?: SelectSubset<T, ArticleFactCheckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleFactChecks and returns the data saved in the database.
     * @param {ArticleFactCheckCreateManyAndReturnArgs} args - Arguments to create many ArticleFactChecks.
     * @example
     * // Create many ArticleFactChecks
     * const articleFactCheck = await prisma.articleFactCheck.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleFactChecks and only return the `id`
     * const articleFactCheckWithIdOnly = await prisma.articleFactCheck.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleFactCheckCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleFactCheckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleFactCheck.
     * @param {ArticleFactCheckDeleteArgs} args - Arguments to delete one ArticleFactCheck.
     * @example
     * // Delete one ArticleFactCheck
     * const ArticleFactCheck = await prisma.articleFactCheck.delete({
     *   where: {
     *     // ... filter to delete one ArticleFactCheck
     *   }
     * })
     * 
     */
    delete<T extends ArticleFactCheckDeleteArgs>(args: SelectSubset<T, ArticleFactCheckDeleteArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleFactCheck.
     * @param {ArticleFactCheckUpdateArgs} args - Arguments to update one ArticleFactCheck.
     * @example
     * // Update one ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleFactCheckUpdateArgs>(args: SelectSubset<T, ArticleFactCheckUpdateArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleFactChecks.
     * @param {ArticleFactCheckDeleteManyArgs} args - Arguments to filter ArticleFactChecks to delete.
     * @example
     * // Delete a few ArticleFactChecks
     * const { count } = await prisma.articleFactCheck.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleFactCheckDeleteManyArgs>(args?: SelectSubset<T, ArticleFactCheckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleFactChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleFactChecks
     * const articleFactCheck = await prisma.articleFactCheck.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleFactCheckUpdateManyArgs>(args: SelectSubset<T, ArticleFactCheckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleFactChecks and returns the data updated in the database.
     * @param {ArticleFactCheckUpdateManyAndReturnArgs} args - Arguments to update many ArticleFactChecks.
     * @example
     * // Update many ArticleFactChecks
     * const articleFactCheck = await prisma.articleFactCheck.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleFactChecks and only return the `id`
     * const articleFactCheckWithIdOnly = await prisma.articleFactCheck.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleFactCheckUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleFactCheckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleFactCheck.
     * @param {ArticleFactCheckUpsertArgs} args - Arguments to update or create a ArticleFactCheck.
     * @example
     * // Update or create a ArticleFactCheck
     * const articleFactCheck = await prisma.articleFactCheck.upsert({
     *   create: {
     *     // ... data to create a ArticleFactCheck
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleFactCheck we want to update
     *   }
     * })
     */
    upsert<T extends ArticleFactCheckUpsertArgs>(args: SelectSubset<T, ArticleFactCheckUpsertArgs<ExtArgs>>): Prisma__ArticleFactCheckClient<$Result.GetResult<Prisma.$ArticleFactCheckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleFactChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckCountArgs} args - Arguments to filter ArticleFactChecks to count.
     * @example
     * // Count the number of ArticleFactChecks
     * const count = await prisma.articleFactCheck.count({
     *   where: {
     *     // ... the filter for the ArticleFactChecks we want to count
     *   }
     * })
    **/
    count<T extends ArticleFactCheckCountArgs>(
      args?: Subset<T, ArticleFactCheckCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleFactCheckCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleFactCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleFactCheckAggregateArgs>(args: Subset<T, ArticleFactCheckAggregateArgs>): Prisma.PrismaPromise<GetArticleFactCheckAggregateType<T>>

    /**
     * Group by ArticleFactCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFactCheckGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleFactCheckGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleFactCheckGroupByArgs['orderBy'] }
        : { orderBy?: ArticleFactCheckGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleFactCheckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleFactCheckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleFactCheck model
   */
  readonly fields: ArticleFactCheckFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleFactCheck.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleFactCheckClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleFactCheck model
   */
  interface ArticleFactCheckFieldRefs {
    readonly id: FieldRef<"ArticleFactCheck", 'String'>
    readonly articleId: FieldRef<"ArticleFactCheck", 'String'>
    readonly userId: FieldRef<"ArticleFactCheck", 'String'>
    readonly score: FieldRef<"ArticleFactCheck", 'Float'>
    readonly status: FieldRef<"ArticleFactCheck", 'String'>
    readonly summary: FieldRef<"ArticleFactCheck", 'String'>
    readonly createdAt: FieldRef<"ArticleFactCheck", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleFactCheck findUnique
   */
  export type ArticleFactCheckFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter, which ArticleFactCheck to fetch.
     */
    where: ArticleFactCheckWhereUniqueInput
  }

  /**
   * ArticleFactCheck findUniqueOrThrow
   */
  export type ArticleFactCheckFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter, which ArticleFactCheck to fetch.
     */
    where: ArticleFactCheckWhereUniqueInput
  }

  /**
   * ArticleFactCheck findFirst
   */
  export type ArticleFactCheckFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter, which ArticleFactCheck to fetch.
     */
    where?: ArticleFactCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleFactChecks to fetch.
     */
    orderBy?: ArticleFactCheckOrderByWithRelationInput | ArticleFactCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleFactChecks.
     */
    cursor?: ArticleFactCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleFactChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleFactChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleFactChecks.
     */
    distinct?: ArticleFactCheckScalarFieldEnum | ArticleFactCheckScalarFieldEnum[]
  }

  /**
   * ArticleFactCheck findFirstOrThrow
   */
  export type ArticleFactCheckFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter, which ArticleFactCheck to fetch.
     */
    where?: ArticleFactCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleFactChecks to fetch.
     */
    orderBy?: ArticleFactCheckOrderByWithRelationInput | ArticleFactCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleFactChecks.
     */
    cursor?: ArticleFactCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleFactChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleFactChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleFactChecks.
     */
    distinct?: ArticleFactCheckScalarFieldEnum | ArticleFactCheckScalarFieldEnum[]
  }

  /**
   * ArticleFactCheck findMany
   */
  export type ArticleFactCheckFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter, which ArticleFactChecks to fetch.
     */
    where?: ArticleFactCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleFactChecks to fetch.
     */
    orderBy?: ArticleFactCheckOrderByWithRelationInput | ArticleFactCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleFactChecks.
     */
    cursor?: ArticleFactCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleFactChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleFactChecks.
     */
    skip?: number
    distinct?: ArticleFactCheckScalarFieldEnum | ArticleFactCheckScalarFieldEnum[]
  }

  /**
   * ArticleFactCheck create
   */
  export type ArticleFactCheckCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * The data needed to create a ArticleFactCheck.
     */
    data: XOR<ArticleFactCheckCreateInput, ArticleFactCheckUncheckedCreateInput>
  }

  /**
   * ArticleFactCheck createMany
   */
  export type ArticleFactCheckCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleFactChecks.
     */
    data: ArticleFactCheckCreateManyInput | ArticleFactCheckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleFactCheck createManyAndReturn
   */
  export type ArticleFactCheckCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleFactChecks.
     */
    data: ArticleFactCheckCreateManyInput | ArticleFactCheckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleFactCheck update
   */
  export type ArticleFactCheckUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * The data needed to update a ArticleFactCheck.
     */
    data: XOR<ArticleFactCheckUpdateInput, ArticleFactCheckUncheckedUpdateInput>
    /**
     * Choose, which ArticleFactCheck to update.
     */
    where: ArticleFactCheckWhereUniqueInput
  }

  /**
   * ArticleFactCheck updateMany
   */
  export type ArticleFactCheckUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleFactChecks.
     */
    data: XOR<ArticleFactCheckUpdateManyMutationInput, ArticleFactCheckUncheckedUpdateManyInput>
    /**
     * Filter which ArticleFactChecks to update
     */
    where?: ArticleFactCheckWhereInput
    /**
     * Limit how many ArticleFactChecks to update.
     */
    limit?: number
  }

  /**
   * ArticleFactCheck updateManyAndReturn
   */
  export type ArticleFactCheckUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * The data used to update ArticleFactChecks.
     */
    data: XOR<ArticleFactCheckUpdateManyMutationInput, ArticleFactCheckUncheckedUpdateManyInput>
    /**
     * Filter which ArticleFactChecks to update
     */
    where?: ArticleFactCheckWhereInput
    /**
     * Limit how many ArticleFactChecks to update.
     */
    limit?: number
  }

  /**
   * ArticleFactCheck upsert
   */
  export type ArticleFactCheckUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * The filter to search for the ArticleFactCheck to update in case it exists.
     */
    where: ArticleFactCheckWhereUniqueInput
    /**
     * In case the ArticleFactCheck found by the `where` argument doesn't exist, create a new ArticleFactCheck with this data.
     */
    create: XOR<ArticleFactCheckCreateInput, ArticleFactCheckUncheckedCreateInput>
    /**
     * In case the ArticleFactCheck was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleFactCheckUpdateInput, ArticleFactCheckUncheckedUpdateInput>
  }

  /**
   * ArticleFactCheck delete
   */
  export type ArticleFactCheckDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
    /**
     * Filter which ArticleFactCheck to delete.
     */
    where: ArticleFactCheckWhereUniqueInput
  }

  /**
   * ArticleFactCheck deleteMany
   */
  export type ArticleFactCheckDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleFactChecks to delete
     */
    where?: ArticleFactCheckWhereInput
    /**
     * Limit how many ArticleFactChecks to delete.
     */
    limit?: number
  }

  /**
   * ArticleFactCheck without action
   */
  export type ArticleFactCheckDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleFactCheck
     */
    select?: ArticleFactCheckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleFactCheck
     */
    omit?: ArticleFactCheckOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    password: 'password',
    image: 'image',
    clerkId: 'clerkId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    points: 'points',
    badges: 'badges'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    type: 'type',
    excerpt: 'excerpt',
    published: 'published',
    authorId: 'authorId',
    category: 'category',
    tags: 'tags',
    sentiment: 'sentiment',
    factCheckScore: 'factCheckScore',
    factCheckSources: 'factCheckSources',
    factCheckDate: 'factCheckDate',
    factCheckStatus: 'factCheckStatus',
    factCheckClicks: 'factCheckClicks',
    level: 'level',
    contentType: 'contentType',
    readTime: 'readTime',
    warningLevel: 'warningLevel',
    securityTips: 'securityTips',
    courseSequence: 'courseSequence',
    relatedArticles: 'relatedArticles',
    projectHighlight: 'projectHighlight',
    coverImage: 'coverImage',
    coverImageAlt: 'coverImageAlt',
    quizData: 'quizData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const CitationScalarFieldEnum: {
    id: 'id',
    url: 'url',
    title: 'title',
    domain: 'domain',
    articleId: 'articleId',
    order: 'order',
    verified: 'verified',
    createdAt: 'createdAt'
  };

  export type CitationScalarFieldEnum = (typeof CitationScalarFieldEnum)[keyof typeof CitationScalarFieldEnum]


  export const ResourceScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    verified: 'verified',
    shortDescription: 'shortDescription',
    officialUrl: 'officialUrl',
    platforms: 'platforms',
    tags: 'tags',
    heroTitle: 'heroTitle',
    heroDescription: 'heroDescription',
    heroGradient: 'heroGradient',
    whyGoodTitle: 'whyGoodTitle',
    whyGoodContent: 'whyGoodContent',
    features: 'features',
    howToStartTitle: 'howToStartTitle',
    howToStartSteps: 'howToStartSteps',
    pros: 'pros',
    cons: 'cons',
    faq: 'faq',
    securityTips: 'securityTips',
    securityAudit: 'securityAudit',
    securityAuditDate: 'securityAuditDate',
    auditedByCommunity: 'auditedByCommunity',
    toolConfig: 'toolConfig',
    interactiveType: 'interactiveType',
    showCompatibleWallets: 'showCompatibleWallets',
    relatedResources: 'relatedResources',
    views: 'views',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastVerified: 'lastVerified'
  };

  export type ResourceScalarFieldEnum = (typeof ResourceScalarFieldEnum)[keyof typeof ResourceScalarFieldEnum]


  export const CryptocurrencyScalarFieldEnum: {
    id: 'id',
    coingeckoId: 'coingeckoId',
    symbol: 'symbol',
    name: 'name',
    currentPrice: 'currentPrice',
    marketCap: 'marketCap',
    marketCapRank: 'marketCapRank',
    totalVolume: 'totalVolume',
    high24h: 'high24h',
    low24h: 'low24h',
    priceChange24h: 'priceChange24h',
    priceChangePercentage24h: 'priceChangePercentage24h',
    circulatingSupply: 'circulatingSupply',
    totalSupply: 'totalSupply',
    maxSupply: 'maxSupply',
    ath: 'ath',
    athDate: 'athDate',
    atl: 'atl',
    atlDate: 'atlDate',
    description: 'description',
    homepage: 'homepage',
    whitepaper: 'whitepaper',
    blockchain: 'blockchain',
    socialLinks: 'socialLinks',
    imageSmall: 'imageSmall',
    imageLarge: 'imageLarge',
    slug: 'slug',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type CryptocurrencyScalarFieldEnum = (typeof CryptocurrencyScalarFieldEnum)[keyof typeof CryptocurrencyScalarFieldEnum]


  export const CopilotActivityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    parameters: 'parameters',
    result: 'result',
    status: 'status',
    requiresConfirmation: 'requiresConfirmation',
    confirmed: 'confirmed',
    confirmedAt: 'confirmedAt',
    createdAt: 'createdAt'
  };

  export type CopilotActivityScalarFieldEnum = (typeof CopilotActivityScalarFieldEnum)[keyof typeof CopilotActivityScalarFieldEnum]


  export const AutomationTaskScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    type: 'type',
    schedule: 'schedule',
    enabled: 'enabled',
    lastRun: 'lastRun',
    nextRun: 'nextRun',
    runCount: 'runCount',
    config: 'config',
    lastResult: 'lastResult',
    lastStatus: 'lastStatus',
    lastError: 'lastError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AutomationTaskScalarFieldEnum = (typeof AutomationTaskScalarFieldEnum)[keyof typeof AutomationTaskScalarFieldEnum]


  export const CopilotReportScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    startDate: 'startDate',
    endDate: 'endDate',
    summary: 'summary',
    data: 'data',
    sections: 'sections',
    generatedBy: 'generatedBy',
    taskId: 'taskId',
    articlesAnalyzed: 'articlesAnalyzed',
    alertsFound: 'alertsFound',
    createdAt: 'createdAt'
  };

  export type CopilotReportScalarFieldEnum = (typeof CopilotReportScalarFieldEnum)[keyof typeof CopilotReportScalarFieldEnum]


  export const CommunityStoryScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    authorName: 'authorName',
    authorAvatar: 'authorAvatar',
    userId: 'userId',
    title: 'title',
    content: 'content',
    category: 'category',
    likes: 'likes',
    verified: 'verified',
    featured: 'featured',
    published: 'published',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommunityStoryScalarFieldEnum = (typeof CommunityStoryScalarFieldEnum)[keyof typeof CommunityStoryScalarFieldEnum]


  export const SocialProjectScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    description: 'description',
    longDescription: 'longDescription',
    fundingGoal: 'fundingGoal',
    currentFunding: 'currentFunding',
    currency: 'currency',
    walletAddress: 'walletAddress',
    category: 'category',
    location: 'location',
    tags: 'tags',
    verified: 'verified',
    active: 'active',
    featured: 'featured',
    startDate: 'startDate',
    endDate: 'endDate',
    supporters: 'supporters',
    views: 'views',
    coverImage: 'coverImage',
    gallery: 'gallery',
    organizer: 'organizer',
    organizerEmail: 'organizerEmail',
    organizerPhone: 'organizerPhone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SocialProjectScalarFieldEnum = (typeof SocialProjectScalarFieldEnum)[keyof typeof SocialProjectScalarFieldEnum]


  export const ProjectMapScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    latitude: 'latitude',
    longitude: 'longitude',
    address: 'address',
    city: 'city',
    state: 'state',
    country: 'country',
    markerColor: 'markerColor',
    markerIcon: 'markerIcon',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectMapScalarFieldEnum = (typeof ProjectMapScalarFieldEnum)[keyof typeof ProjectMapScalarFieldEnum]


  export const UserProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    articleSlug: 'articleSlug',
    completed: 'completed',
    progress: 'progress',
    quizScore: 'quizScore',
    quizAttempts: 'quizAttempts',
    certificateIssued: 'certificateIssued',
    certificateUrl: 'certificateUrl',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    lastAccessed: 'lastAccessed'
  };

  export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum]


  export const ArticleFactCheckScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    userId: 'userId',
    score: 'score',
    status: 'status',
    summary: 'summary',
    createdAt: 'createdAt'
  };

  export type ArticleFactCheckScalarFieldEnum = (typeof ArticleFactCheckScalarFieldEnum)[keyof typeof ArticleFactCheckScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Sentiment'
   */
  export type EnumSentimentFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sentiment'>
    


  /**
   * Reference to a field of type 'Sentiment[]'
   */
  export type ListEnumSentimentFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sentiment[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'WarningLevel'
   */
  export type EnumWarningLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WarningLevel'>
    


  /**
   * Reference to a field of type 'WarningLevel[]'
   */
  export type ListEnumWarningLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WarningLevel[]'>
    


  /**
   * Reference to a field of type 'StoryCategory'
   */
  export type EnumStoryCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StoryCategory'>
    


  /**
   * Reference to a field of type 'StoryCategory[]'
   */
  export type ListEnumStoryCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StoryCategory[]'>
    


  /**
   * Reference to a field of type 'ProjectCategory'
   */
  export type EnumProjectCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectCategory'>
    


  /**
   * Reference to a field of type 'ProjectCategory[]'
   */
  export type ListEnumProjectCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectCategory[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    password?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    clerkId?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    points?: IntFilter<"User"> | number
    badges?: StringNullableFilter<"User"> | string | null
    articles?: ArticleListRelationFilter
    copilotActivities?: CopilotActivityListRelationFilter
    communityStories?: CommunityStoryListRelationFilter
    userProgress?: UserProgressListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    clerkId?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    points?: SortOrder
    badges?: SortOrderInput | SortOrder
    articles?: ArticleOrderByRelationAggregateInput
    copilotActivities?: CopilotActivityOrderByRelationAggregateInput
    communityStories?: CommunityStoryOrderByRelationAggregateInput
    userProgress?: UserProgressOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    clerkId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    password?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    points?: IntFilter<"User"> | number
    badges?: StringNullableFilter<"User"> | string | null
    articles?: ArticleListRelationFilter
    copilotActivities?: CopilotActivityListRelationFilter
    communityStories?: CommunityStoryListRelationFilter
    userProgress?: UserProgressListRelationFilter
  }, "id" | "email" | "clerkId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    clerkId?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    points?: SortOrder
    badges?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    clerkId?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    points?: IntWithAggregatesFilter<"User"> | number
    badges?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    slug?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    type?: StringFilter<"Article"> | string
    excerpt?: StringNullableFilter<"Article"> | string | null
    published?: BoolFilter<"Article"> | boolean
    authorId?: StringFilter<"Article"> | string
    category?: StringFilter<"Article"> | string
    tags?: StringFilter<"Article"> | string
    sentiment?: EnumSentimentFilter<"Article"> | $Enums.Sentiment
    factCheckScore?: FloatNullableFilter<"Article"> | number | null
    factCheckSources?: StringNullableFilter<"Article"> | string | null
    factCheckDate?: DateTimeNullableFilter<"Article"> | Date | string | null
    factCheckStatus?: StringNullableFilter<"Article"> | string | null
    factCheckClicks?: IntFilter<"Article"> | number
    level?: StringNullableFilter<"Article"> | string | null
    contentType?: StringNullableFilter<"Article"> | string | null
    readTime?: StringNullableFilter<"Article"> | string | null
    warningLevel?: EnumWarningLevelNullableFilter<"Article"> | $Enums.WarningLevel | null
    securityTips?: StringNullableFilter<"Article"> | string | null
    courseSequence?: IntNullableFilter<"Article"> | number | null
    relatedArticles?: StringNullableFilter<"Article"> | string | null
    projectHighlight?: BoolFilter<"Article"> | boolean
    coverImage?: StringNullableFilter<"Article"> | string | null
    coverImageAlt?: StringNullableFilter<"Article"> | string | null
    quizData?: StringNullableFilter<"Article"> | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    citations?: CitationListRelationFilter
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    type?: SortOrder
    excerpt?: SortOrderInput | SortOrder
    published?: SortOrder
    authorId?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    sentiment?: SortOrder
    factCheckScore?: SortOrderInput | SortOrder
    factCheckSources?: SortOrderInput | SortOrder
    factCheckDate?: SortOrderInput | SortOrder
    factCheckStatus?: SortOrderInput | SortOrder
    factCheckClicks?: SortOrder
    level?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    readTime?: SortOrderInput | SortOrder
    warningLevel?: SortOrderInput | SortOrder
    securityTips?: SortOrderInput | SortOrder
    courseSequence?: SortOrderInput | SortOrder
    relatedArticles?: SortOrderInput | SortOrder
    projectHighlight?: SortOrder
    coverImage?: SortOrderInput | SortOrder
    coverImageAlt?: SortOrderInput | SortOrder
    quizData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    author?: UserOrderByWithRelationInput
    citations?: CitationOrderByRelationAggregateInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    type?: StringFilter<"Article"> | string
    excerpt?: StringNullableFilter<"Article"> | string | null
    published?: BoolFilter<"Article"> | boolean
    authorId?: StringFilter<"Article"> | string
    category?: StringFilter<"Article"> | string
    tags?: StringFilter<"Article"> | string
    sentiment?: EnumSentimentFilter<"Article"> | $Enums.Sentiment
    factCheckScore?: FloatNullableFilter<"Article"> | number | null
    factCheckSources?: StringNullableFilter<"Article"> | string | null
    factCheckDate?: DateTimeNullableFilter<"Article"> | Date | string | null
    factCheckStatus?: StringNullableFilter<"Article"> | string | null
    factCheckClicks?: IntFilter<"Article"> | number
    level?: StringNullableFilter<"Article"> | string | null
    contentType?: StringNullableFilter<"Article"> | string | null
    readTime?: StringNullableFilter<"Article"> | string | null
    warningLevel?: EnumWarningLevelNullableFilter<"Article"> | $Enums.WarningLevel | null
    securityTips?: StringNullableFilter<"Article"> | string | null
    courseSequence?: IntNullableFilter<"Article"> | number | null
    relatedArticles?: StringNullableFilter<"Article"> | string | null
    projectHighlight?: BoolFilter<"Article"> | boolean
    coverImage?: StringNullableFilter<"Article"> | string | null
    coverImageAlt?: StringNullableFilter<"Article"> | string | null
    quizData?: StringNullableFilter<"Article"> | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    citations?: CitationListRelationFilter
  }, "id" | "slug">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    type?: SortOrder
    excerpt?: SortOrderInput | SortOrder
    published?: SortOrder
    authorId?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    sentiment?: SortOrder
    factCheckScore?: SortOrderInput | SortOrder
    factCheckSources?: SortOrderInput | SortOrder
    factCheckDate?: SortOrderInput | SortOrder
    factCheckStatus?: SortOrderInput | SortOrder
    factCheckClicks?: SortOrder
    level?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    readTime?: SortOrderInput | SortOrder
    warningLevel?: SortOrderInput | SortOrder
    securityTips?: SortOrderInput | SortOrder
    courseSequence?: SortOrderInput | SortOrder
    relatedArticles?: SortOrderInput | SortOrder
    projectHighlight?: SortOrder
    coverImage?: SortOrderInput | SortOrder
    coverImageAlt?: SortOrderInput | SortOrder
    quizData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _avg?: ArticleAvgOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
    _sum?: ArticleSumOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    slug?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    type?: StringWithAggregatesFilter<"Article"> | string
    excerpt?: StringNullableWithAggregatesFilter<"Article"> | string | null
    published?: BoolWithAggregatesFilter<"Article"> | boolean
    authorId?: StringWithAggregatesFilter<"Article"> | string
    category?: StringWithAggregatesFilter<"Article"> | string
    tags?: StringWithAggregatesFilter<"Article"> | string
    sentiment?: EnumSentimentWithAggregatesFilter<"Article"> | $Enums.Sentiment
    factCheckScore?: FloatNullableWithAggregatesFilter<"Article"> | number | null
    factCheckSources?: StringNullableWithAggregatesFilter<"Article"> | string | null
    factCheckDate?: DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null
    factCheckStatus?: StringNullableWithAggregatesFilter<"Article"> | string | null
    factCheckClicks?: IntWithAggregatesFilter<"Article"> | number
    level?: StringNullableWithAggregatesFilter<"Article"> | string | null
    contentType?: StringNullableWithAggregatesFilter<"Article"> | string | null
    readTime?: StringNullableWithAggregatesFilter<"Article"> | string | null
    warningLevel?: EnumWarningLevelNullableWithAggregatesFilter<"Article"> | $Enums.WarningLevel | null
    securityTips?: StringNullableWithAggregatesFilter<"Article"> | string | null
    courseSequence?: IntNullableWithAggregatesFilter<"Article"> | number | null
    relatedArticles?: StringNullableWithAggregatesFilter<"Article"> | string | null
    projectHighlight?: BoolWithAggregatesFilter<"Article"> | boolean
    coverImage?: StringNullableWithAggregatesFilter<"Article"> | string | null
    coverImageAlt?: StringNullableWithAggregatesFilter<"Article"> | string | null
    quizData?: StringNullableWithAggregatesFilter<"Article"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
  }

  export type CitationWhereInput = {
    AND?: CitationWhereInput | CitationWhereInput[]
    OR?: CitationWhereInput[]
    NOT?: CitationWhereInput | CitationWhereInput[]
    id?: StringFilter<"Citation"> | string
    url?: StringFilter<"Citation"> | string
    title?: StringNullableFilter<"Citation"> | string | null
    domain?: StringNullableFilter<"Citation"> | string | null
    articleId?: StringFilter<"Citation"> | string
    order?: IntFilter<"Citation"> | number
    verified?: BoolFilter<"Citation"> | boolean
    createdAt?: DateTimeFilter<"Citation"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type CitationOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    domain?: SortOrderInput | SortOrder
    articleId?: SortOrder
    order?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type CitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CitationWhereInput | CitationWhereInput[]
    OR?: CitationWhereInput[]
    NOT?: CitationWhereInput | CitationWhereInput[]
    url?: StringFilter<"Citation"> | string
    title?: StringNullableFilter<"Citation"> | string | null
    domain?: StringNullableFilter<"Citation"> | string | null
    articleId?: StringFilter<"Citation"> | string
    order?: IntFilter<"Citation"> | number
    verified?: BoolFilter<"Citation"> | boolean
    createdAt?: DateTimeFilter<"Citation"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id">

  export type CitationOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    domain?: SortOrderInput | SortOrder
    articleId?: SortOrder
    order?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
    _count?: CitationCountOrderByAggregateInput
    _avg?: CitationAvgOrderByAggregateInput
    _max?: CitationMaxOrderByAggregateInput
    _min?: CitationMinOrderByAggregateInput
    _sum?: CitationSumOrderByAggregateInput
  }

  export type CitationScalarWhereWithAggregatesInput = {
    AND?: CitationScalarWhereWithAggregatesInput | CitationScalarWhereWithAggregatesInput[]
    OR?: CitationScalarWhereWithAggregatesInput[]
    NOT?: CitationScalarWhereWithAggregatesInput | CitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Citation"> | string
    url?: StringWithAggregatesFilter<"Citation"> | string
    title?: StringNullableWithAggregatesFilter<"Citation"> | string | null
    domain?: StringNullableWithAggregatesFilter<"Citation"> | string | null
    articleId?: StringWithAggregatesFilter<"Citation"> | string
    order?: IntWithAggregatesFilter<"Citation"> | number
    verified?: BoolWithAggregatesFilter<"Citation"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Citation"> | Date | string
  }

  export type ResourceWhereInput = {
    AND?: ResourceWhereInput | ResourceWhereInput[]
    OR?: ResourceWhereInput[]
    NOT?: ResourceWhereInput | ResourceWhereInput[]
    id?: StringFilter<"Resource"> | string
    slug?: StringFilter<"Resource"> | string
    name?: StringFilter<"Resource"> | string
    category?: StringFilter<"Resource"> | string
    verified?: BoolFilter<"Resource"> | boolean
    shortDescription?: StringFilter<"Resource"> | string
    officialUrl?: StringFilter<"Resource"> | string
    platforms?: StringFilter<"Resource"> | string
    tags?: StringFilter<"Resource"> | string
    heroTitle?: StringFilter<"Resource"> | string
    heroDescription?: StringFilter<"Resource"> | string
    heroGradient?: StringFilter<"Resource"> | string
    whyGoodTitle?: StringFilter<"Resource"> | string
    whyGoodContent?: StringFilter<"Resource"> | string
    features?: StringFilter<"Resource"> | string
    howToStartTitle?: StringFilter<"Resource"> | string
    howToStartSteps?: StringFilter<"Resource"> | string
    pros?: StringFilter<"Resource"> | string
    cons?: StringFilter<"Resource"> | string
    faq?: StringFilter<"Resource"> | string
    securityTips?: StringFilter<"Resource"> | string
    securityAudit?: StringNullableFilter<"Resource"> | string | null
    securityAuditDate?: DateTimeNullableFilter<"Resource"> | Date | string | null
    auditedByCommunity?: BoolFilter<"Resource"> | boolean
    toolConfig?: StringNullableFilter<"Resource"> | string | null
    interactiveType?: StringNullableFilter<"Resource"> | string | null
    showCompatibleWallets?: BoolFilter<"Resource"> | boolean
    relatedResources?: StringNullableFilter<"Resource"> | string | null
    views?: IntFilter<"Resource"> | number
    createdAt?: DateTimeFilter<"Resource"> | Date | string
    updatedAt?: DateTimeFilter<"Resource"> | Date | string
    lastVerified?: DateTimeFilter<"Resource"> | Date | string
  }

  export type ResourceOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    verified?: SortOrder
    shortDescription?: SortOrder
    officialUrl?: SortOrder
    platforms?: SortOrder
    tags?: SortOrder
    heroTitle?: SortOrder
    heroDescription?: SortOrder
    heroGradient?: SortOrder
    whyGoodTitle?: SortOrder
    whyGoodContent?: SortOrder
    features?: SortOrder
    howToStartTitle?: SortOrder
    howToStartSteps?: SortOrder
    pros?: SortOrder
    cons?: SortOrder
    faq?: SortOrder
    securityTips?: SortOrder
    securityAudit?: SortOrderInput | SortOrder
    securityAuditDate?: SortOrderInput | SortOrder
    auditedByCommunity?: SortOrder
    toolConfig?: SortOrderInput | SortOrder
    interactiveType?: SortOrderInput | SortOrder
    showCompatibleWallets?: SortOrder
    relatedResources?: SortOrderInput | SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVerified?: SortOrder
  }

  export type ResourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ResourceWhereInput | ResourceWhereInput[]
    OR?: ResourceWhereInput[]
    NOT?: ResourceWhereInput | ResourceWhereInput[]
    name?: StringFilter<"Resource"> | string
    category?: StringFilter<"Resource"> | string
    verified?: BoolFilter<"Resource"> | boolean
    shortDescription?: StringFilter<"Resource"> | string
    officialUrl?: StringFilter<"Resource"> | string
    platforms?: StringFilter<"Resource"> | string
    tags?: StringFilter<"Resource"> | string
    heroTitle?: StringFilter<"Resource"> | string
    heroDescription?: StringFilter<"Resource"> | string
    heroGradient?: StringFilter<"Resource"> | string
    whyGoodTitle?: StringFilter<"Resource"> | string
    whyGoodContent?: StringFilter<"Resource"> | string
    features?: StringFilter<"Resource"> | string
    howToStartTitle?: StringFilter<"Resource"> | string
    howToStartSteps?: StringFilter<"Resource"> | string
    pros?: StringFilter<"Resource"> | string
    cons?: StringFilter<"Resource"> | string
    faq?: StringFilter<"Resource"> | string
    securityTips?: StringFilter<"Resource"> | string
    securityAudit?: StringNullableFilter<"Resource"> | string | null
    securityAuditDate?: DateTimeNullableFilter<"Resource"> | Date | string | null
    auditedByCommunity?: BoolFilter<"Resource"> | boolean
    toolConfig?: StringNullableFilter<"Resource"> | string | null
    interactiveType?: StringNullableFilter<"Resource"> | string | null
    showCompatibleWallets?: BoolFilter<"Resource"> | boolean
    relatedResources?: StringNullableFilter<"Resource"> | string | null
    views?: IntFilter<"Resource"> | number
    createdAt?: DateTimeFilter<"Resource"> | Date | string
    updatedAt?: DateTimeFilter<"Resource"> | Date | string
    lastVerified?: DateTimeFilter<"Resource"> | Date | string
  }, "id" | "slug">

  export type ResourceOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    verified?: SortOrder
    shortDescription?: SortOrder
    officialUrl?: SortOrder
    platforms?: SortOrder
    tags?: SortOrder
    heroTitle?: SortOrder
    heroDescription?: SortOrder
    heroGradient?: SortOrder
    whyGoodTitle?: SortOrder
    whyGoodContent?: SortOrder
    features?: SortOrder
    howToStartTitle?: SortOrder
    howToStartSteps?: SortOrder
    pros?: SortOrder
    cons?: SortOrder
    faq?: SortOrder
    securityTips?: SortOrder
    securityAudit?: SortOrderInput | SortOrder
    securityAuditDate?: SortOrderInput | SortOrder
    auditedByCommunity?: SortOrder
    toolConfig?: SortOrderInput | SortOrder
    interactiveType?: SortOrderInput | SortOrder
    showCompatibleWallets?: SortOrder
    relatedResources?: SortOrderInput | SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVerified?: SortOrder
    _count?: ResourceCountOrderByAggregateInput
    _avg?: ResourceAvgOrderByAggregateInput
    _max?: ResourceMaxOrderByAggregateInput
    _min?: ResourceMinOrderByAggregateInput
    _sum?: ResourceSumOrderByAggregateInput
  }

  export type ResourceScalarWhereWithAggregatesInput = {
    AND?: ResourceScalarWhereWithAggregatesInput | ResourceScalarWhereWithAggregatesInput[]
    OR?: ResourceScalarWhereWithAggregatesInput[]
    NOT?: ResourceScalarWhereWithAggregatesInput | ResourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resource"> | string
    slug?: StringWithAggregatesFilter<"Resource"> | string
    name?: StringWithAggregatesFilter<"Resource"> | string
    category?: StringWithAggregatesFilter<"Resource"> | string
    verified?: BoolWithAggregatesFilter<"Resource"> | boolean
    shortDescription?: StringWithAggregatesFilter<"Resource"> | string
    officialUrl?: StringWithAggregatesFilter<"Resource"> | string
    platforms?: StringWithAggregatesFilter<"Resource"> | string
    tags?: StringWithAggregatesFilter<"Resource"> | string
    heroTitle?: StringWithAggregatesFilter<"Resource"> | string
    heroDescription?: StringWithAggregatesFilter<"Resource"> | string
    heroGradient?: StringWithAggregatesFilter<"Resource"> | string
    whyGoodTitle?: StringWithAggregatesFilter<"Resource"> | string
    whyGoodContent?: StringWithAggregatesFilter<"Resource"> | string
    features?: StringWithAggregatesFilter<"Resource"> | string
    howToStartTitle?: StringWithAggregatesFilter<"Resource"> | string
    howToStartSteps?: StringWithAggregatesFilter<"Resource"> | string
    pros?: StringWithAggregatesFilter<"Resource"> | string
    cons?: StringWithAggregatesFilter<"Resource"> | string
    faq?: StringWithAggregatesFilter<"Resource"> | string
    securityTips?: StringWithAggregatesFilter<"Resource"> | string
    securityAudit?: StringNullableWithAggregatesFilter<"Resource"> | string | null
    securityAuditDate?: DateTimeNullableWithAggregatesFilter<"Resource"> | Date | string | null
    auditedByCommunity?: BoolWithAggregatesFilter<"Resource"> | boolean
    toolConfig?: StringNullableWithAggregatesFilter<"Resource"> | string | null
    interactiveType?: StringNullableWithAggregatesFilter<"Resource"> | string | null
    showCompatibleWallets?: BoolWithAggregatesFilter<"Resource"> | boolean
    relatedResources?: StringNullableWithAggregatesFilter<"Resource"> | string | null
    views?: IntWithAggregatesFilter<"Resource"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Resource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Resource"> | Date | string
    lastVerified?: DateTimeWithAggregatesFilter<"Resource"> | Date | string
  }

  export type CryptocurrencyWhereInput = {
    AND?: CryptocurrencyWhereInput | CryptocurrencyWhereInput[]
    OR?: CryptocurrencyWhereInput[]
    NOT?: CryptocurrencyWhereInput | CryptocurrencyWhereInput[]
    id?: StringFilter<"Cryptocurrency"> | string
    coingeckoId?: StringFilter<"Cryptocurrency"> | string
    symbol?: StringFilter<"Cryptocurrency"> | string
    name?: StringFilter<"Cryptocurrency"> | string
    currentPrice?: FloatNullableFilter<"Cryptocurrency"> | number | null
    marketCap?: FloatNullableFilter<"Cryptocurrency"> | number | null
    marketCapRank?: IntNullableFilter<"Cryptocurrency"> | number | null
    totalVolume?: FloatNullableFilter<"Cryptocurrency"> | number | null
    high24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    low24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    priceChange24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    priceChangePercentage24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    circulatingSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    totalSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    maxSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    ath?: FloatNullableFilter<"Cryptocurrency"> | number | null
    athDate?: DateTimeNullableFilter<"Cryptocurrency"> | Date | string | null
    atl?: FloatNullableFilter<"Cryptocurrency"> | number | null
    atlDate?: DateTimeNullableFilter<"Cryptocurrency"> | Date | string | null
    description?: StringNullableFilter<"Cryptocurrency"> | string | null
    homepage?: StringNullableFilter<"Cryptocurrency"> | string | null
    whitepaper?: StringNullableFilter<"Cryptocurrency"> | string | null
    blockchain?: StringNullableFilter<"Cryptocurrency"> | string | null
    socialLinks?: StringNullableFilter<"Cryptocurrency"> | string | null
    imageSmall?: StringNullableFilter<"Cryptocurrency"> | string | null
    imageLarge?: StringNullableFilter<"Cryptocurrency"> | string | null
    slug?: StringNullableFilter<"Cryptocurrency"> | string | null
    lastUpdated?: DateTimeFilter<"Cryptocurrency"> | Date | string
    createdAt?: DateTimeFilter<"Cryptocurrency"> | Date | string
  }

  export type CryptocurrencyOrderByWithRelationInput = {
    id?: SortOrder
    coingeckoId?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    currentPrice?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    marketCapRank?: SortOrderInput | SortOrder
    totalVolume?: SortOrderInput | SortOrder
    high24h?: SortOrderInput | SortOrder
    low24h?: SortOrderInput | SortOrder
    priceChange24h?: SortOrderInput | SortOrder
    priceChangePercentage24h?: SortOrderInput | SortOrder
    circulatingSupply?: SortOrderInput | SortOrder
    totalSupply?: SortOrderInput | SortOrder
    maxSupply?: SortOrderInput | SortOrder
    ath?: SortOrderInput | SortOrder
    athDate?: SortOrderInput | SortOrder
    atl?: SortOrderInput | SortOrder
    atlDate?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    homepage?: SortOrderInput | SortOrder
    whitepaper?: SortOrderInput | SortOrder
    blockchain?: SortOrderInput | SortOrder
    socialLinks?: SortOrderInput | SortOrder
    imageSmall?: SortOrderInput | SortOrder
    imageLarge?: SortOrderInput | SortOrder
    slug?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type CryptocurrencyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    coingeckoId?: string
    AND?: CryptocurrencyWhereInput | CryptocurrencyWhereInput[]
    OR?: CryptocurrencyWhereInput[]
    NOT?: CryptocurrencyWhereInput | CryptocurrencyWhereInput[]
    symbol?: StringFilter<"Cryptocurrency"> | string
    name?: StringFilter<"Cryptocurrency"> | string
    currentPrice?: FloatNullableFilter<"Cryptocurrency"> | number | null
    marketCap?: FloatNullableFilter<"Cryptocurrency"> | number | null
    marketCapRank?: IntNullableFilter<"Cryptocurrency"> | number | null
    totalVolume?: FloatNullableFilter<"Cryptocurrency"> | number | null
    high24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    low24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    priceChange24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    priceChangePercentage24h?: FloatNullableFilter<"Cryptocurrency"> | number | null
    circulatingSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    totalSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    maxSupply?: FloatNullableFilter<"Cryptocurrency"> | number | null
    ath?: FloatNullableFilter<"Cryptocurrency"> | number | null
    athDate?: DateTimeNullableFilter<"Cryptocurrency"> | Date | string | null
    atl?: FloatNullableFilter<"Cryptocurrency"> | number | null
    atlDate?: DateTimeNullableFilter<"Cryptocurrency"> | Date | string | null
    description?: StringNullableFilter<"Cryptocurrency"> | string | null
    homepage?: StringNullableFilter<"Cryptocurrency"> | string | null
    whitepaper?: StringNullableFilter<"Cryptocurrency"> | string | null
    blockchain?: StringNullableFilter<"Cryptocurrency"> | string | null
    socialLinks?: StringNullableFilter<"Cryptocurrency"> | string | null
    imageSmall?: StringNullableFilter<"Cryptocurrency"> | string | null
    imageLarge?: StringNullableFilter<"Cryptocurrency"> | string | null
    slug?: StringNullableFilter<"Cryptocurrency"> | string | null
    lastUpdated?: DateTimeFilter<"Cryptocurrency"> | Date | string
    createdAt?: DateTimeFilter<"Cryptocurrency"> | Date | string
  }, "id" | "coingeckoId">

  export type CryptocurrencyOrderByWithAggregationInput = {
    id?: SortOrder
    coingeckoId?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    currentPrice?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    marketCapRank?: SortOrderInput | SortOrder
    totalVolume?: SortOrderInput | SortOrder
    high24h?: SortOrderInput | SortOrder
    low24h?: SortOrderInput | SortOrder
    priceChange24h?: SortOrderInput | SortOrder
    priceChangePercentage24h?: SortOrderInput | SortOrder
    circulatingSupply?: SortOrderInput | SortOrder
    totalSupply?: SortOrderInput | SortOrder
    maxSupply?: SortOrderInput | SortOrder
    ath?: SortOrderInput | SortOrder
    athDate?: SortOrderInput | SortOrder
    atl?: SortOrderInput | SortOrder
    atlDate?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    homepage?: SortOrderInput | SortOrder
    whitepaper?: SortOrderInput | SortOrder
    blockchain?: SortOrderInput | SortOrder
    socialLinks?: SortOrderInput | SortOrder
    imageSmall?: SortOrderInput | SortOrder
    imageLarge?: SortOrderInput | SortOrder
    slug?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: CryptocurrencyCountOrderByAggregateInput
    _avg?: CryptocurrencyAvgOrderByAggregateInput
    _max?: CryptocurrencyMaxOrderByAggregateInput
    _min?: CryptocurrencyMinOrderByAggregateInput
    _sum?: CryptocurrencySumOrderByAggregateInput
  }

  export type CryptocurrencyScalarWhereWithAggregatesInput = {
    AND?: CryptocurrencyScalarWhereWithAggregatesInput | CryptocurrencyScalarWhereWithAggregatesInput[]
    OR?: CryptocurrencyScalarWhereWithAggregatesInput[]
    NOT?: CryptocurrencyScalarWhereWithAggregatesInput | CryptocurrencyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cryptocurrency"> | string
    coingeckoId?: StringWithAggregatesFilter<"Cryptocurrency"> | string
    symbol?: StringWithAggregatesFilter<"Cryptocurrency"> | string
    name?: StringWithAggregatesFilter<"Cryptocurrency"> | string
    currentPrice?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    marketCap?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    marketCapRank?: IntNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    totalVolume?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    high24h?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    low24h?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    priceChange24h?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    priceChangePercentage24h?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    circulatingSupply?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    totalSupply?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    maxSupply?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    ath?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    athDate?: DateTimeNullableWithAggregatesFilter<"Cryptocurrency"> | Date | string | null
    atl?: FloatNullableWithAggregatesFilter<"Cryptocurrency"> | number | null
    atlDate?: DateTimeNullableWithAggregatesFilter<"Cryptocurrency"> | Date | string | null
    description?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    homepage?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    whitepaper?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    blockchain?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    socialLinks?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    imageSmall?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    imageLarge?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    slug?: StringNullableWithAggregatesFilter<"Cryptocurrency"> | string | null
    lastUpdated?: DateTimeWithAggregatesFilter<"Cryptocurrency"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Cryptocurrency"> | Date | string
  }

  export type CopilotActivityWhereInput = {
    AND?: CopilotActivityWhereInput | CopilotActivityWhereInput[]
    OR?: CopilotActivityWhereInput[]
    NOT?: CopilotActivityWhereInput | CopilotActivityWhereInput[]
    id?: StringFilter<"CopilotActivity"> | string
    userId?: StringFilter<"CopilotActivity"> | string
    action?: StringFilter<"CopilotActivity"> | string
    parameters?: StringFilter<"CopilotActivity"> | string
    result?: StringNullableFilter<"CopilotActivity"> | string | null
    status?: StringFilter<"CopilotActivity"> | string
    requiresConfirmation?: BoolFilter<"CopilotActivity"> | boolean
    confirmed?: BoolFilter<"CopilotActivity"> | boolean
    confirmedAt?: DateTimeNullableFilter<"CopilotActivity"> | Date | string | null
    createdAt?: DateTimeFilter<"CopilotActivity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CopilotActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    parameters?: SortOrder
    result?: SortOrderInput | SortOrder
    status?: SortOrder
    requiresConfirmation?: SortOrder
    confirmed?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CopilotActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CopilotActivityWhereInput | CopilotActivityWhereInput[]
    OR?: CopilotActivityWhereInput[]
    NOT?: CopilotActivityWhereInput | CopilotActivityWhereInput[]
    userId?: StringFilter<"CopilotActivity"> | string
    action?: StringFilter<"CopilotActivity"> | string
    parameters?: StringFilter<"CopilotActivity"> | string
    result?: StringNullableFilter<"CopilotActivity"> | string | null
    status?: StringFilter<"CopilotActivity"> | string
    requiresConfirmation?: BoolFilter<"CopilotActivity"> | boolean
    confirmed?: BoolFilter<"CopilotActivity"> | boolean
    confirmedAt?: DateTimeNullableFilter<"CopilotActivity"> | Date | string | null
    createdAt?: DateTimeFilter<"CopilotActivity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CopilotActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    parameters?: SortOrder
    result?: SortOrderInput | SortOrder
    status?: SortOrder
    requiresConfirmation?: SortOrder
    confirmed?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CopilotActivityCountOrderByAggregateInput
    _max?: CopilotActivityMaxOrderByAggregateInput
    _min?: CopilotActivityMinOrderByAggregateInput
  }

  export type CopilotActivityScalarWhereWithAggregatesInput = {
    AND?: CopilotActivityScalarWhereWithAggregatesInput | CopilotActivityScalarWhereWithAggregatesInput[]
    OR?: CopilotActivityScalarWhereWithAggregatesInput[]
    NOT?: CopilotActivityScalarWhereWithAggregatesInput | CopilotActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CopilotActivity"> | string
    userId?: StringWithAggregatesFilter<"CopilotActivity"> | string
    action?: StringWithAggregatesFilter<"CopilotActivity"> | string
    parameters?: StringWithAggregatesFilter<"CopilotActivity"> | string
    result?: StringNullableWithAggregatesFilter<"CopilotActivity"> | string | null
    status?: StringWithAggregatesFilter<"CopilotActivity"> | string
    requiresConfirmation?: BoolWithAggregatesFilter<"CopilotActivity"> | boolean
    confirmed?: BoolWithAggregatesFilter<"CopilotActivity"> | boolean
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"CopilotActivity"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CopilotActivity"> | Date | string
  }

  export type AutomationTaskWhereInput = {
    AND?: AutomationTaskWhereInput | AutomationTaskWhereInput[]
    OR?: AutomationTaskWhereInput[]
    NOT?: AutomationTaskWhereInput | AutomationTaskWhereInput[]
    id?: StringFilter<"AutomationTask"> | string
    name?: StringFilter<"AutomationTask"> | string
    description?: StringNullableFilter<"AutomationTask"> | string | null
    type?: StringFilter<"AutomationTask"> | string
    schedule?: StringNullableFilter<"AutomationTask"> | string | null
    enabled?: BoolFilter<"AutomationTask"> | boolean
    lastRun?: DateTimeNullableFilter<"AutomationTask"> | Date | string | null
    nextRun?: DateTimeNullableFilter<"AutomationTask"> | Date | string | null
    runCount?: IntFilter<"AutomationTask"> | number
    config?: StringNullableFilter<"AutomationTask"> | string | null
    lastResult?: StringNullableFilter<"AutomationTask"> | string | null
    lastStatus?: StringNullableFilter<"AutomationTask"> | string | null
    lastError?: StringNullableFilter<"AutomationTask"> | string | null
    createdAt?: DateTimeFilter<"AutomationTask"> | Date | string
    updatedAt?: DateTimeFilter<"AutomationTask"> | Date | string
  }

  export type AutomationTaskOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    schedule?: SortOrderInput | SortOrder
    enabled?: SortOrder
    lastRun?: SortOrderInput | SortOrder
    nextRun?: SortOrderInput | SortOrder
    runCount?: SortOrder
    config?: SortOrderInput | SortOrder
    lastResult?: SortOrderInput | SortOrder
    lastStatus?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutomationTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AutomationTaskWhereInput | AutomationTaskWhereInput[]
    OR?: AutomationTaskWhereInput[]
    NOT?: AutomationTaskWhereInput | AutomationTaskWhereInput[]
    name?: StringFilter<"AutomationTask"> | string
    description?: StringNullableFilter<"AutomationTask"> | string | null
    type?: StringFilter<"AutomationTask"> | string
    schedule?: StringNullableFilter<"AutomationTask"> | string | null
    enabled?: BoolFilter<"AutomationTask"> | boolean
    lastRun?: DateTimeNullableFilter<"AutomationTask"> | Date | string | null
    nextRun?: DateTimeNullableFilter<"AutomationTask"> | Date | string | null
    runCount?: IntFilter<"AutomationTask"> | number
    config?: StringNullableFilter<"AutomationTask"> | string | null
    lastResult?: StringNullableFilter<"AutomationTask"> | string | null
    lastStatus?: StringNullableFilter<"AutomationTask"> | string | null
    lastError?: StringNullableFilter<"AutomationTask"> | string | null
    createdAt?: DateTimeFilter<"AutomationTask"> | Date | string
    updatedAt?: DateTimeFilter<"AutomationTask"> | Date | string
  }, "id">

  export type AutomationTaskOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    schedule?: SortOrderInput | SortOrder
    enabled?: SortOrder
    lastRun?: SortOrderInput | SortOrder
    nextRun?: SortOrderInput | SortOrder
    runCount?: SortOrder
    config?: SortOrderInput | SortOrder
    lastResult?: SortOrderInput | SortOrder
    lastStatus?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AutomationTaskCountOrderByAggregateInput
    _avg?: AutomationTaskAvgOrderByAggregateInput
    _max?: AutomationTaskMaxOrderByAggregateInput
    _min?: AutomationTaskMinOrderByAggregateInput
    _sum?: AutomationTaskSumOrderByAggregateInput
  }

  export type AutomationTaskScalarWhereWithAggregatesInput = {
    AND?: AutomationTaskScalarWhereWithAggregatesInput | AutomationTaskScalarWhereWithAggregatesInput[]
    OR?: AutomationTaskScalarWhereWithAggregatesInput[]
    NOT?: AutomationTaskScalarWhereWithAggregatesInput | AutomationTaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AutomationTask"> | string
    name?: StringWithAggregatesFilter<"AutomationTask"> | string
    description?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    type?: StringWithAggregatesFilter<"AutomationTask"> | string
    schedule?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    enabled?: BoolWithAggregatesFilter<"AutomationTask"> | boolean
    lastRun?: DateTimeNullableWithAggregatesFilter<"AutomationTask"> | Date | string | null
    nextRun?: DateTimeNullableWithAggregatesFilter<"AutomationTask"> | Date | string | null
    runCount?: IntWithAggregatesFilter<"AutomationTask"> | number
    config?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    lastResult?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    lastStatus?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    lastError?: StringNullableWithAggregatesFilter<"AutomationTask"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AutomationTask"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AutomationTask"> | Date | string
  }

  export type CopilotReportWhereInput = {
    AND?: CopilotReportWhereInput | CopilotReportWhereInput[]
    OR?: CopilotReportWhereInput[]
    NOT?: CopilotReportWhereInput | CopilotReportWhereInput[]
    id?: StringFilter<"CopilotReport"> | string
    type?: StringFilter<"CopilotReport"> | string
    title?: StringFilter<"CopilotReport"> | string
    startDate?: DateTimeFilter<"CopilotReport"> | Date | string
    endDate?: DateTimeFilter<"CopilotReport"> | Date | string
    summary?: StringFilter<"CopilotReport"> | string
    data?: StringFilter<"CopilotReport"> | string
    sections?: StringFilter<"CopilotReport"> | string
    generatedBy?: StringFilter<"CopilotReport"> | string
    taskId?: StringNullableFilter<"CopilotReport"> | string | null
    articlesAnalyzed?: IntFilter<"CopilotReport"> | number
    alertsFound?: IntFilter<"CopilotReport"> | number
    createdAt?: DateTimeFilter<"CopilotReport"> | Date | string
  }

  export type CopilotReportOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    data?: SortOrder
    sections?: SortOrder
    generatedBy?: SortOrder
    taskId?: SortOrderInput | SortOrder
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CopilotReportWhereInput | CopilotReportWhereInput[]
    OR?: CopilotReportWhereInput[]
    NOT?: CopilotReportWhereInput | CopilotReportWhereInput[]
    type?: StringFilter<"CopilotReport"> | string
    title?: StringFilter<"CopilotReport"> | string
    startDate?: DateTimeFilter<"CopilotReport"> | Date | string
    endDate?: DateTimeFilter<"CopilotReport"> | Date | string
    summary?: StringFilter<"CopilotReport"> | string
    data?: StringFilter<"CopilotReport"> | string
    sections?: StringFilter<"CopilotReport"> | string
    generatedBy?: StringFilter<"CopilotReport"> | string
    taskId?: StringNullableFilter<"CopilotReport"> | string | null
    articlesAnalyzed?: IntFilter<"CopilotReport"> | number
    alertsFound?: IntFilter<"CopilotReport"> | number
    createdAt?: DateTimeFilter<"CopilotReport"> | Date | string
  }, "id">

  export type CopilotReportOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    data?: SortOrder
    sections?: SortOrder
    generatedBy?: SortOrder
    taskId?: SortOrderInput | SortOrder
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
    createdAt?: SortOrder
    _count?: CopilotReportCountOrderByAggregateInput
    _avg?: CopilotReportAvgOrderByAggregateInput
    _max?: CopilotReportMaxOrderByAggregateInput
    _min?: CopilotReportMinOrderByAggregateInput
    _sum?: CopilotReportSumOrderByAggregateInput
  }

  export type CopilotReportScalarWhereWithAggregatesInput = {
    AND?: CopilotReportScalarWhereWithAggregatesInput | CopilotReportScalarWhereWithAggregatesInput[]
    OR?: CopilotReportScalarWhereWithAggregatesInput[]
    NOT?: CopilotReportScalarWhereWithAggregatesInput | CopilotReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CopilotReport"> | string
    type?: StringWithAggregatesFilter<"CopilotReport"> | string
    title?: StringWithAggregatesFilter<"CopilotReport"> | string
    startDate?: DateTimeWithAggregatesFilter<"CopilotReport"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"CopilotReport"> | Date | string
    summary?: StringWithAggregatesFilter<"CopilotReport"> | string
    data?: StringWithAggregatesFilter<"CopilotReport"> | string
    sections?: StringWithAggregatesFilter<"CopilotReport"> | string
    generatedBy?: StringWithAggregatesFilter<"CopilotReport"> | string
    taskId?: StringNullableWithAggregatesFilter<"CopilotReport"> | string | null
    articlesAnalyzed?: IntWithAggregatesFilter<"CopilotReport"> | number
    alertsFound?: IntWithAggregatesFilter<"CopilotReport"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CopilotReport"> | Date | string
  }

  export type CommunityStoryWhereInput = {
    AND?: CommunityStoryWhereInput | CommunityStoryWhereInput[]
    OR?: CommunityStoryWhereInput[]
    NOT?: CommunityStoryWhereInput | CommunityStoryWhereInput[]
    id?: StringFilter<"CommunityStory"> | string
    slug?: StringFilter<"CommunityStory"> | string
    authorName?: StringFilter<"CommunityStory"> | string
    authorAvatar?: StringNullableFilter<"CommunityStory"> | string | null
    userId?: StringNullableFilter<"CommunityStory"> | string | null
    title?: StringFilter<"CommunityStory"> | string
    content?: StringFilter<"CommunityStory"> | string
    category?: EnumStoryCategoryFilter<"CommunityStory"> | $Enums.StoryCategory
    likes?: IntFilter<"CommunityStory"> | number
    verified?: BoolFilter<"CommunityStory"> | boolean
    featured?: BoolFilter<"CommunityStory"> | boolean
    published?: BoolFilter<"CommunityStory"> | boolean
    createdAt?: DateTimeFilter<"CommunityStory"> | Date | string
    updatedAt?: DateTimeFilter<"CommunityStory"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type CommunityStoryOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    authorName?: SortOrder
    authorAvatar?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    likes?: SortOrder
    verified?: SortOrder
    featured?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CommunityStoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: CommunityStoryWhereInput | CommunityStoryWhereInput[]
    OR?: CommunityStoryWhereInput[]
    NOT?: CommunityStoryWhereInput | CommunityStoryWhereInput[]
    authorName?: StringFilter<"CommunityStory"> | string
    authorAvatar?: StringNullableFilter<"CommunityStory"> | string | null
    userId?: StringNullableFilter<"CommunityStory"> | string | null
    title?: StringFilter<"CommunityStory"> | string
    content?: StringFilter<"CommunityStory"> | string
    category?: EnumStoryCategoryFilter<"CommunityStory"> | $Enums.StoryCategory
    likes?: IntFilter<"CommunityStory"> | number
    verified?: BoolFilter<"CommunityStory"> | boolean
    featured?: BoolFilter<"CommunityStory"> | boolean
    published?: BoolFilter<"CommunityStory"> | boolean
    createdAt?: DateTimeFilter<"CommunityStory"> | Date | string
    updatedAt?: DateTimeFilter<"CommunityStory"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "slug">

  export type CommunityStoryOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    authorName?: SortOrder
    authorAvatar?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    likes?: SortOrder
    verified?: SortOrder
    featured?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommunityStoryCountOrderByAggregateInput
    _avg?: CommunityStoryAvgOrderByAggregateInput
    _max?: CommunityStoryMaxOrderByAggregateInput
    _min?: CommunityStoryMinOrderByAggregateInput
    _sum?: CommunityStorySumOrderByAggregateInput
  }

  export type CommunityStoryScalarWhereWithAggregatesInput = {
    AND?: CommunityStoryScalarWhereWithAggregatesInput | CommunityStoryScalarWhereWithAggregatesInput[]
    OR?: CommunityStoryScalarWhereWithAggregatesInput[]
    NOT?: CommunityStoryScalarWhereWithAggregatesInput | CommunityStoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityStory"> | string
    slug?: StringWithAggregatesFilter<"CommunityStory"> | string
    authorName?: StringWithAggregatesFilter<"CommunityStory"> | string
    authorAvatar?: StringNullableWithAggregatesFilter<"CommunityStory"> | string | null
    userId?: StringNullableWithAggregatesFilter<"CommunityStory"> | string | null
    title?: StringWithAggregatesFilter<"CommunityStory"> | string
    content?: StringWithAggregatesFilter<"CommunityStory"> | string
    category?: EnumStoryCategoryWithAggregatesFilter<"CommunityStory"> | $Enums.StoryCategory
    likes?: IntWithAggregatesFilter<"CommunityStory"> | number
    verified?: BoolWithAggregatesFilter<"CommunityStory"> | boolean
    featured?: BoolWithAggregatesFilter<"CommunityStory"> | boolean
    published?: BoolWithAggregatesFilter<"CommunityStory"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CommunityStory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CommunityStory"> | Date | string
  }

  export type SocialProjectWhereInput = {
    AND?: SocialProjectWhereInput | SocialProjectWhereInput[]
    OR?: SocialProjectWhereInput[]
    NOT?: SocialProjectWhereInput | SocialProjectWhereInput[]
    id?: StringFilter<"SocialProject"> | string
    slug?: StringFilter<"SocialProject"> | string
    name?: StringFilter<"SocialProject"> | string
    description?: StringFilter<"SocialProject"> | string
    longDescription?: StringNullableFilter<"SocialProject"> | string | null
    fundingGoal?: FloatFilter<"SocialProject"> | number
    currentFunding?: FloatFilter<"SocialProject"> | number
    currency?: StringFilter<"SocialProject"> | string
    walletAddress?: StringNullableFilter<"SocialProject"> | string | null
    category?: EnumProjectCategoryFilter<"SocialProject"> | $Enums.ProjectCategory
    location?: StringNullableFilter<"SocialProject"> | string | null
    tags?: StringNullableFilter<"SocialProject"> | string | null
    verified?: BoolFilter<"SocialProject"> | boolean
    active?: BoolFilter<"SocialProject"> | boolean
    featured?: BoolFilter<"SocialProject"> | boolean
    startDate?: DateTimeFilter<"SocialProject"> | Date | string
    endDate?: DateTimeNullableFilter<"SocialProject"> | Date | string | null
    supporters?: IntFilter<"SocialProject"> | number
    views?: IntFilter<"SocialProject"> | number
    coverImage?: StringNullableFilter<"SocialProject"> | string | null
    gallery?: StringNullableFilter<"SocialProject"> | string | null
    organizer?: StringFilter<"SocialProject"> | string
    organizerEmail?: StringNullableFilter<"SocialProject"> | string | null
    organizerPhone?: StringNullableFilter<"SocialProject"> | string | null
    createdAt?: DateTimeFilter<"SocialProject"> | Date | string
    updatedAt?: DateTimeFilter<"SocialProject"> | Date | string
    map?: XOR<ProjectMapNullableScalarRelationFilter, ProjectMapWhereInput> | null
  }

  export type SocialProjectOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    longDescription?: SortOrderInput | SortOrder
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    currency?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    category?: SortOrder
    location?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    verified?: SortOrder
    active?: SortOrder
    featured?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    supporters?: SortOrder
    views?: SortOrder
    coverImage?: SortOrderInput | SortOrder
    gallery?: SortOrderInput | SortOrder
    organizer?: SortOrder
    organizerEmail?: SortOrderInput | SortOrder
    organizerPhone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    map?: ProjectMapOrderByWithRelationInput
  }

  export type SocialProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: SocialProjectWhereInput | SocialProjectWhereInput[]
    OR?: SocialProjectWhereInput[]
    NOT?: SocialProjectWhereInput | SocialProjectWhereInput[]
    name?: StringFilter<"SocialProject"> | string
    description?: StringFilter<"SocialProject"> | string
    longDescription?: StringNullableFilter<"SocialProject"> | string | null
    fundingGoal?: FloatFilter<"SocialProject"> | number
    currentFunding?: FloatFilter<"SocialProject"> | number
    currency?: StringFilter<"SocialProject"> | string
    walletAddress?: StringNullableFilter<"SocialProject"> | string | null
    category?: EnumProjectCategoryFilter<"SocialProject"> | $Enums.ProjectCategory
    location?: StringNullableFilter<"SocialProject"> | string | null
    tags?: StringNullableFilter<"SocialProject"> | string | null
    verified?: BoolFilter<"SocialProject"> | boolean
    active?: BoolFilter<"SocialProject"> | boolean
    featured?: BoolFilter<"SocialProject"> | boolean
    startDate?: DateTimeFilter<"SocialProject"> | Date | string
    endDate?: DateTimeNullableFilter<"SocialProject"> | Date | string | null
    supporters?: IntFilter<"SocialProject"> | number
    views?: IntFilter<"SocialProject"> | number
    coverImage?: StringNullableFilter<"SocialProject"> | string | null
    gallery?: StringNullableFilter<"SocialProject"> | string | null
    organizer?: StringFilter<"SocialProject"> | string
    organizerEmail?: StringNullableFilter<"SocialProject"> | string | null
    organizerPhone?: StringNullableFilter<"SocialProject"> | string | null
    createdAt?: DateTimeFilter<"SocialProject"> | Date | string
    updatedAt?: DateTimeFilter<"SocialProject"> | Date | string
    map?: XOR<ProjectMapNullableScalarRelationFilter, ProjectMapWhereInput> | null
  }, "id" | "slug">

  export type SocialProjectOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    longDescription?: SortOrderInput | SortOrder
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    currency?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    category?: SortOrder
    location?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    verified?: SortOrder
    active?: SortOrder
    featured?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    supporters?: SortOrder
    views?: SortOrder
    coverImage?: SortOrderInput | SortOrder
    gallery?: SortOrderInput | SortOrder
    organizer?: SortOrder
    organizerEmail?: SortOrderInput | SortOrder
    organizerPhone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SocialProjectCountOrderByAggregateInput
    _avg?: SocialProjectAvgOrderByAggregateInput
    _max?: SocialProjectMaxOrderByAggregateInput
    _min?: SocialProjectMinOrderByAggregateInput
    _sum?: SocialProjectSumOrderByAggregateInput
  }

  export type SocialProjectScalarWhereWithAggregatesInput = {
    AND?: SocialProjectScalarWhereWithAggregatesInput | SocialProjectScalarWhereWithAggregatesInput[]
    OR?: SocialProjectScalarWhereWithAggregatesInput[]
    NOT?: SocialProjectScalarWhereWithAggregatesInput | SocialProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SocialProject"> | string
    slug?: StringWithAggregatesFilter<"SocialProject"> | string
    name?: StringWithAggregatesFilter<"SocialProject"> | string
    description?: StringWithAggregatesFilter<"SocialProject"> | string
    longDescription?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    fundingGoal?: FloatWithAggregatesFilter<"SocialProject"> | number
    currentFunding?: FloatWithAggregatesFilter<"SocialProject"> | number
    currency?: StringWithAggregatesFilter<"SocialProject"> | string
    walletAddress?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    category?: EnumProjectCategoryWithAggregatesFilter<"SocialProject"> | $Enums.ProjectCategory
    location?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    tags?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    verified?: BoolWithAggregatesFilter<"SocialProject"> | boolean
    active?: BoolWithAggregatesFilter<"SocialProject"> | boolean
    featured?: BoolWithAggregatesFilter<"SocialProject"> | boolean
    startDate?: DateTimeWithAggregatesFilter<"SocialProject"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"SocialProject"> | Date | string | null
    supporters?: IntWithAggregatesFilter<"SocialProject"> | number
    views?: IntWithAggregatesFilter<"SocialProject"> | number
    coverImage?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    gallery?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    organizer?: StringWithAggregatesFilter<"SocialProject"> | string
    organizerEmail?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    organizerPhone?: StringNullableWithAggregatesFilter<"SocialProject"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SocialProject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SocialProject"> | Date | string
  }

  export type ProjectMapWhereInput = {
    AND?: ProjectMapWhereInput | ProjectMapWhereInput[]
    OR?: ProjectMapWhereInput[]
    NOT?: ProjectMapWhereInput | ProjectMapWhereInput[]
    id?: StringFilter<"ProjectMap"> | string
    projectId?: StringFilter<"ProjectMap"> | string
    latitude?: FloatFilter<"ProjectMap"> | number
    longitude?: FloatFilter<"ProjectMap"> | number
    address?: StringNullableFilter<"ProjectMap"> | string | null
    city?: StringFilter<"ProjectMap"> | string
    state?: StringFilter<"ProjectMap"> | string
    country?: StringFilter<"ProjectMap"> | string
    markerColor?: StringFilter<"ProjectMap"> | string
    markerIcon?: StringNullableFilter<"ProjectMap"> | string | null
    createdAt?: DateTimeFilter<"ProjectMap"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectMap"> | Date | string
    project?: XOR<SocialProjectScalarRelationFilter, SocialProjectWhereInput>
  }

  export type ProjectMapOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    markerColor?: SortOrder
    markerIcon?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: SocialProjectOrderByWithRelationInput
  }

  export type ProjectMapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId?: string
    AND?: ProjectMapWhereInput | ProjectMapWhereInput[]
    OR?: ProjectMapWhereInput[]
    NOT?: ProjectMapWhereInput | ProjectMapWhereInput[]
    latitude?: FloatFilter<"ProjectMap"> | number
    longitude?: FloatFilter<"ProjectMap"> | number
    address?: StringNullableFilter<"ProjectMap"> | string | null
    city?: StringFilter<"ProjectMap"> | string
    state?: StringFilter<"ProjectMap"> | string
    country?: StringFilter<"ProjectMap"> | string
    markerColor?: StringFilter<"ProjectMap"> | string
    markerIcon?: StringNullableFilter<"ProjectMap"> | string | null
    createdAt?: DateTimeFilter<"ProjectMap"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectMap"> | Date | string
    project?: XOR<SocialProjectScalarRelationFilter, SocialProjectWhereInput>
  }, "id" | "projectId">

  export type ProjectMapOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    markerColor?: SortOrder
    markerIcon?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectMapCountOrderByAggregateInput
    _avg?: ProjectMapAvgOrderByAggregateInput
    _max?: ProjectMapMaxOrderByAggregateInput
    _min?: ProjectMapMinOrderByAggregateInput
    _sum?: ProjectMapSumOrderByAggregateInput
  }

  export type ProjectMapScalarWhereWithAggregatesInput = {
    AND?: ProjectMapScalarWhereWithAggregatesInput | ProjectMapScalarWhereWithAggregatesInput[]
    OR?: ProjectMapScalarWhereWithAggregatesInput[]
    NOT?: ProjectMapScalarWhereWithAggregatesInput | ProjectMapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectMap"> | string
    projectId?: StringWithAggregatesFilter<"ProjectMap"> | string
    latitude?: FloatWithAggregatesFilter<"ProjectMap"> | number
    longitude?: FloatWithAggregatesFilter<"ProjectMap"> | number
    address?: StringNullableWithAggregatesFilter<"ProjectMap"> | string | null
    city?: StringWithAggregatesFilter<"ProjectMap"> | string
    state?: StringWithAggregatesFilter<"ProjectMap"> | string
    country?: StringWithAggregatesFilter<"ProjectMap"> | string
    markerColor?: StringWithAggregatesFilter<"ProjectMap"> | string
    markerIcon?: StringNullableWithAggregatesFilter<"ProjectMap"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProjectMap"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProjectMap"> | Date | string
  }

  export type UserProgressWhereInput = {
    AND?: UserProgressWhereInput | UserProgressWhereInput[]
    OR?: UserProgressWhereInput[]
    NOT?: UserProgressWhereInput | UserProgressWhereInput[]
    id?: StringFilter<"UserProgress"> | string
    userId?: StringFilter<"UserProgress"> | string
    articleSlug?: StringFilter<"UserProgress"> | string
    completed?: BoolFilter<"UserProgress"> | boolean
    progress?: IntFilter<"UserProgress"> | number
    quizScore?: FloatNullableFilter<"UserProgress"> | number | null
    quizAttempts?: IntFilter<"UserProgress"> | number
    certificateIssued?: BoolFilter<"UserProgress"> | boolean
    certificateUrl?: StringNullableFilter<"UserProgress"> | string | null
    startedAt?: DateTimeFilter<"UserProgress"> | Date | string
    completedAt?: DateTimeNullableFilter<"UserProgress"> | Date | string | null
    lastAccessed?: DateTimeFilter<"UserProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleSlug?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    quizScore?: SortOrderInput | SortOrder
    quizAttempts?: SortOrder
    certificateIssued?: SortOrder
    certificateUrl?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    lastAccessed?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_articleSlug?: UserProgressUserIdArticleSlugCompoundUniqueInput
    AND?: UserProgressWhereInput | UserProgressWhereInput[]
    OR?: UserProgressWhereInput[]
    NOT?: UserProgressWhereInput | UserProgressWhereInput[]
    userId?: StringFilter<"UserProgress"> | string
    articleSlug?: StringFilter<"UserProgress"> | string
    completed?: BoolFilter<"UserProgress"> | boolean
    progress?: IntFilter<"UserProgress"> | number
    quizScore?: FloatNullableFilter<"UserProgress"> | number | null
    quizAttempts?: IntFilter<"UserProgress"> | number
    certificateIssued?: BoolFilter<"UserProgress"> | boolean
    certificateUrl?: StringNullableFilter<"UserProgress"> | string | null
    startedAt?: DateTimeFilter<"UserProgress"> | Date | string
    completedAt?: DateTimeNullableFilter<"UserProgress"> | Date | string | null
    lastAccessed?: DateTimeFilter<"UserProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_articleSlug">

  export type UserProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleSlug?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    quizScore?: SortOrderInput | SortOrder
    quizAttempts?: SortOrder
    certificateIssued?: SortOrder
    certificateUrl?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    lastAccessed?: SortOrder
    _count?: UserProgressCountOrderByAggregateInput
    _avg?: UserProgressAvgOrderByAggregateInput
    _max?: UserProgressMaxOrderByAggregateInput
    _min?: UserProgressMinOrderByAggregateInput
    _sum?: UserProgressSumOrderByAggregateInput
  }

  export type UserProgressScalarWhereWithAggregatesInput = {
    AND?: UserProgressScalarWhereWithAggregatesInput | UserProgressScalarWhereWithAggregatesInput[]
    OR?: UserProgressScalarWhereWithAggregatesInput[]
    NOT?: UserProgressScalarWhereWithAggregatesInput | UserProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProgress"> | string
    userId?: StringWithAggregatesFilter<"UserProgress"> | string
    articleSlug?: StringWithAggregatesFilter<"UserProgress"> | string
    completed?: BoolWithAggregatesFilter<"UserProgress"> | boolean
    progress?: IntWithAggregatesFilter<"UserProgress"> | number
    quizScore?: FloatNullableWithAggregatesFilter<"UserProgress"> | number | null
    quizAttempts?: IntWithAggregatesFilter<"UserProgress"> | number
    certificateIssued?: BoolWithAggregatesFilter<"UserProgress"> | boolean
    certificateUrl?: StringNullableWithAggregatesFilter<"UserProgress"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"UserProgress"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"UserProgress"> | Date | string | null
    lastAccessed?: DateTimeWithAggregatesFilter<"UserProgress"> | Date | string
  }

  export type ArticleFactCheckWhereInput = {
    AND?: ArticleFactCheckWhereInput | ArticleFactCheckWhereInput[]
    OR?: ArticleFactCheckWhereInput[]
    NOT?: ArticleFactCheckWhereInput | ArticleFactCheckWhereInput[]
    id?: StringFilter<"ArticleFactCheck"> | string
    articleId?: StringFilter<"ArticleFactCheck"> | string
    userId?: StringFilter<"ArticleFactCheck"> | string
    score?: FloatFilter<"ArticleFactCheck"> | number
    status?: StringFilter<"ArticleFactCheck"> | string
    summary?: StringFilter<"ArticleFactCheck"> | string
    createdAt?: DateTimeFilter<"ArticleFactCheck"> | Date | string
  }

  export type ArticleFactCheckOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleFactCheckWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    articleId_userId?: ArticleFactCheckArticleIdUserIdCompoundUniqueInput
    AND?: ArticleFactCheckWhereInput | ArticleFactCheckWhereInput[]
    OR?: ArticleFactCheckWhereInput[]
    NOT?: ArticleFactCheckWhereInput | ArticleFactCheckWhereInput[]
    articleId?: StringFilter<"ArticleFactCheck"> | string
    userId?: StringFilter<"ArticleFactCheck"> | string
    score?: FloatFilter<"ArticleFactCheck"> | number
    status?: StringFilter<"ArticleFactCheck"> | string
    summary?: StringFilter<"ArticleFactCheck"> | string
    createdAt?: DateTimeFilter<"ArticleFactCheck"> | Date | string
  }, "id" | "articleId_userId">

  export type ArticleFactCheckOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    _count?: ArticleFactCheckCountOrderByAggregateInput
    _avg?: ArticleFactCheckAvgOrderByAggregateInput
    _max?: ArticleFactCheckMaxOrderByAggregateInput
    _min?: ArticleFactCheckMinOrderByAggregateInput
    _sum?: ArticleFactCheckSumOrderByAggregateInput
  }

  export type ArticleFactCheckScalarWhereWithAggregatesInput = {
    AND?: ArticleFactCheckScalarWhereWithAggregatesInput | ArticleFactCheckScalarWhereWithAggregatesInput[]
    OR?: ArticleFactCheckScalarWhereWithAggregatesInput[]
    NOT?: ArticleFactCheckScalarWhereWithAggregatesInput | ArticleFactCheckScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleFactCheck"> | string
    articleId?: StringWithAggregatesFilter<"ArticleFactCheck"> | string
    userId?: StringWithAggregatesFilter<"ArticleFactCheck"> | string
    score?: FloatWithAggregatesFilter<"ArticleFactCheck"> | number
    status?: StringWithAggregatesFilter<"ArticleFactCheck"> | string
    summary?: StringWithAggregatesFilter<"ArticleFactCheck"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ArticleFactCheck"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryCreateNestedManyWithoutUserInput
    userProgress?: UserProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleUncheckedCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityUncheckedCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryUncheckedCreateNestedManyWithoutUserInput
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUncheckedUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUncheckedUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUncheckedUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserCreateNestedOneWithoutArticlesInput
    citations?: CitationCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    authorId: string
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    citations?: CitationUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutArticlesNestedInput
    citations?: CitationUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    authorId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    citations?: CitationUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    authorId: string
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    authorId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationCreateInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    order?: number
    verified?: boolean
    createdAt?: Date | string
    article: ArticleCreateNestedOneWithoutCitationsInput
  }

  export type CitationUncheckedCreateInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    articleId: string
    order?: number
    verified?: boolean
    createdAt?: Date | string
  }

  export type CitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutCitationsNestedInput
  }

  export type CitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    articleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationCreateManyInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    articleId: string
    order?: number
    verified?: boolean
    createdAt?: Date | string
  }

  export type CitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    articleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    verified?: boolean
    shortDescription: string
    officialUrl: string
    platforms: string
    tags: string
    heroTitle: string
    heroDescription: string
    heroGradient: string
    whyGoodTitle: string
    whyGoodContent: string
    features: string
    howToStartTitle: string
    howToStartSteps: string
    pros: string
    cons: string
    faq: string
    securityTips: string
    securityAudit?: string | null
    securityAuditDate?: Date | string | null
    auditedByCommunity?: boolean
    toolConfig?: string | null
    interactiveType?: string | null
    showCompatibleWallets?: boolean
    relatedResources?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVerified?: Date | string
  }

  export type ResourceUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    verified?: boolean
    shortDescription: string
    officialUrl: string
    platforms: string
    tags: string
    heroTitle: string
    heroDescription: string
    heroGradient: string
    whyGoodTitle: string
    whyGoodContent: string
    features: string
    howToStartTitle: string
    howToStartSteps: string
    pros: string
    cons: string
    faq: string
    securityTips: string
    securityAudit?: string | null
    securityAuditDate?: Date | string | null
    auditedByCommunity?: boolean
    toolConfig?: string | null
    interactiveType?: string | null
    showCompatibleWallets?: boolean
    relatedResources?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVerified?: Date | string
  }

  export type ResourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    shortDescription?: StringFieldUpdateOperationsInput | string
    officialUrl?: StringFieldUpdateOperationsInput | string
    platforms?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    heroTitle?: StringFieldUpdateOperationsInput | string
    heroDescription?: StringFieldUpdateOperationsInput | string
    heroGradient?: StringFieldUpdateOperationsInput | string
    whyGoodTitle?: StringFieldUpdateOperationsInput | string
    whyGoodContent?: StringFieldUpdateOperationsInput | string
    features?: StringFieldUpdateOperationsInput | string
    howToStartTitle?: StringFieldUpdateOperationsInput | string
    howToStartSteps?: StringFieldUpdateOperationsInput | string
    pros?: StringFieldUpdateOperationsInput | string
    cons?: StringFieldUpdateOperationsInput | string
    faq?: StringFieldUpdateOperationsInput | string
    securityTips?: StringFieldUpdateOperationsInput | string
    securityAudit?: NullableStringFieldUpdateOperationsInput | string | null
    securityAuditDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditedByCommunity?: BoolFieldUpdateOperationsInput | boolean
    toolConfig?: NullableStringFieldUpdateOperationsInput | string | null
    interactiveType?: NullableStringFieldUpdateOperationsInput | string | null
    showCompatibleWallets?: BoolFieldUpdateOperationsInput | boolean
    relatedResources?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVerified?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    shortDescription?: StringFieldUpdateOperationsInput | string
    officialUrl?: StringFieldUpdateOperationsInput | string
    platforms?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    heroTitle?: StringFieldUpdateOperationsInput | string
    heroDescription?: StringFieldUpdateOperationsInput | string
    heroGradient?: StringFieldUpdateOperationsInput | string
    whyGoodTitle?: StringFieldUpdateOperationsInput | string
    whyGoodContent?: StringFieldUpdateOperationsInput | string
    features?: StringFieldUpdateOperationsInput | string
    howToStartTitle?: StringFieldUpdateOperationsInput | string
    howToStartSteps?: StringFieldUpdateOperationsInput | string
    pros?: StringFieldUpdateOperationsInput | string
    cons?: StringFieldUpdateOperationsInput | string
    faq?: StringFieldUpdateOperationsInput | string
    securityTips?: StringFieldUpdateOperationsInput | string
    securityAudit?: NullableStringFieldUpdateOperationsInput | string | null
    securityAuditDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditedByCommunity?: BoolFieldUpdateOperationsInput | boolean
    toolConfig?: NullableStringFieldUpdateOperationsInput | string | null
    interactiveType?: NullableStringFieldUpdateOperationsInput | string | null
    showCompatibleWallets?: BoolFieldUpdateOperationsInput | boolean
    relatedResources?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVerified?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceCreateManyInput = {
    id?: string
    slug: string
    name: string
    category: string
    verified?: boolean
    shortDescription: string
    officialUrl: string
    platforms: string
    tags: string
    heroTitle: string
    heroDescription: string
    heroGradient: string
    whyGoodTitle: string
    whyGoodContent: string
    features: string
    howToStartTitle: string
    howToStartSteps: string
    pros: string
    cons: string
    faq: string
    securityTips: string
    securityAudit?: string | null
    securityAuditDate?: Date | string | null
    auditedByCommunity?: boolean
    toolConfig?: string | null
    interactiveType?: string | null
    showCompatibleWallets?: boolean
    relatedResources?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVerified?: Date | string
  }

  export type ResourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    shortDescription?: StringFieldUpdateOperationsInput | string
    officialUrl?: StringFieldUpdateOperationsInput | string
    platforms?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    heroTitle?: StringFieldUpdateOperationsInput | string
    heroDescription?: StringFieldUpdateOperationsInput | string
    heroGradient?: StringFieldUpdateOperationsInput | string
    whyGoodTitle?: StringFieldUpdateOperationsInput | string
    whyGoodContent?: StringFieldUpdateOperationsInput | string
    features?: StringFieldUpdateOperationsInput | string
    howToStartTitle?: StringFieldUpdateOperationsInput | string
    howToStartSteps?: StringFieldUpdateOperationsInput | string
    pros?: StringFieldUpdateOperationsInput | string
    cons?: StringFieldUpdateOperationsInput | string
    faq?: StringFieldUpdateOperationsInput | string
    securityTips?: StringFieldUpdateOperationsInput | string
    securityAudit?: NullableStringFieldUpdateOperationsInput | string | null
    securityAuditDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditedByCommunity?: BoolFieldUpdateOperationsInput | boolean
    toolConfig?: NullableStringFieldUpdateOperationsInput | string | null
    interactiveType?: NullableStringFieldUpdateOperationsInput | string | null
    showCompatibleWallets?: BoolFieldUpdateOperationsInput | boolean
    relatedResources?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVerified?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    shortDescription?: StringFieldUpdateOperationsInput | string
    officialUrl?: StringFieldUpdateOperationsInput | string
    platforms?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    heroTitle?: StringFieldUpdateOperationsInput | string
    heroDescription?: StringFieldUpdateOperationsInput | string
    heroGradient?: StringFieldUpdateOperationsInput | string
    whyGoodTitle?: StringFieldUpdateOperationsInput | string
    whyGoodContent?: StringFieldUpdateOperationsInput | string
    features?: StringFieldUpdateOperationsInput | string
    howToStartTitle?: StringFieldUpdateOperationsInput | string
    howToStartSteps?: StringFieldUpdateOperationsInput | string
    pros?: StringFieldUpdateOperationsInput | string
    cons?: StringFieldUpdateOperationsInput | string
    faq?: StringFieldUpdateOperationsInput | string
    securityTips?: StringFieldUpdateOperationsInput | string
    securityAudit?: NullableStringFieldUpdateOperationsInput | string | null
    securityAuditDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditedByCommunity?: BoolFieldUpdateOperationsInput | boolean
    toolConfig?: NullableStringFieldUpdateOperationsInput | string | null
    interactiveType?: NullableStringFieldUpdateOperationsInput | string | null
    showCompatibleWallets?: BoolFieldUpdateOperationsInput | boolean
    relatedResources?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVerified?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CryptocurrencyCreateInput = {
    id?: string
    coingeckoId: string
    symbol: string
    name: string
    currentPrice?: number | null
    marketCap?: number | null
    marketCapRank?: number | null
    totalVolume?: number | null
    high24h?: number | null
    low24h?: number | null
    priceChange24h?: number | null
    priceChangePercentage24h?: number | null
    circulatingSupply?: number | null
    totalSupply?: number | null
    maxSupply?: number | null
    ath?: number | null
    athDate?: Date | string | null
    atl?: number | null
    atlDate?: Date | string | null
    description?: string | null
    homepage?: string | null
    whitepaper?: string | null
    blockchain?: string | null
    socialLinks?: string | null
    imageSmall?: string | null
    imageLarge?: string | null
    slug?: string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type CryptocurrencyUncheckedCreateInput = {
    id?: string
    coingeckoId: string
    symbol: string
    name: string
    currentPrice?: number | null
    marketCap?: number | null
    marketCapRank?: number | null
    totalVolume?: number | null
    high24h?: number | null
    low24h?: number | null
    priceChange24h?: number | null
    priceChangePercentage24h?: number | null
    circulatingSupply?: number | null
    totalSupply?: number | null
    maxSupply?: number | null
    ath?: number | null
    athDate?: Date | string | null
    atl?: number | null
    atlDate?: Date | string | null
    description?: string | null
    homepage?: string | null
    whitepaper?: string | null
    blockchain?: string | null
    socialLinks?: string | null
    imageSmall?: string | null
    imageLarge?: string | null
    slug?: string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type CryptocurrencyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    coingeckoId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCapRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalVolume?: NullableFloatFieldUpdateOperationsInput | number | null
    high24h?: NullableFloatFieldUpdateOperationsInput | number | null
    low24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChangePercentage24h?: NullableFloatFieldUpdateOperationsInput | number | null
    circulatingSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    maxSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    ath?: NullableFloatFieldUpdateOperationsInput | number | null
    athDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    atl?: NullableFloatFieldUpdateOperationsInput | number | null
    atlDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    homepage?: NullableStringFieldUpdateOperationsInput | string | null
    whitepaper?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableStringFieldUpdateOperationsInput | string | null
    imageSmall?: NullableStringFieldUpdateOperationsInput | string | null
    imageLarge?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CryptocurrencyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    coingeckoId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCapRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalVolume?: NullableFloatFieldUpdateOperationsInput | number | null
    high24h?: NullableFloatFieldUpdateOperationsInput | number | null
    low24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChangePercentage24h?: NullableFloatFieldUpdateOperationsInput | number | null
    circulatingSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    maxSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    ath?: NullableFloatFieldUpdateOperationsInput | number | null
    athDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    atl?: NullableFloatFieldUpdateOperationsInput | number | null
    atlDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    homepage?: NullableStringFieldUpdateOperationsInput | string | null
    whitepaper?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableStringFieldUpdateOperationsInput | string | null
    imageSmall?: NullableStringFieldUpdateOperationsInput | string | null
    imageLarge?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CryptocurrencyCreateManyInput = {
    id?: string
    coingeckoId: string
    symbol: string
    name: string
    currentPrice?: number | null
    marketCap?: number | null
    marketCapRank?: number | null
    totalVolume?: number | null
    high24h?: number | null
    low24h?: number | null
    priceChange24h?: number | null
    priceChangePercentage24h?: number | null
    circulatingSupply?: number | null
    totalSupply?: number | null
    maxSupply?: number | null
    ath?: number | null
    athDate?: Date | string | null
    atl?: number | null
    atlDate?: Date | string | null
    description?: string | null
    homepage?: string | null
    whitepaper?: string | null
    blockchain?: string | null
    socialLinks?: string | null
    imageSmall?: string | null
    imageLarge?: string | null
    slug?: string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type CryptocurrencyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    coingeckoId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCapRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalVolume?: NullableFloatFieldUpdateOperationsInput | number | null
    high24h?: NullableFloatFieldUpdateOperationsInput | number | null
    low24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChangePercentage24h?: NullableFloatFieldUpdateOperationsInput | number | null
    circulatingSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    maxSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    ath?: NullableFloatFieldUpdateOperationsInput | number | null
    athDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    atl?: NullableFloatFieldUpdateOperationsInput | number | null
    atlDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    homepage?: NullableStringFieldUpdateOperationsInput | string | null
    whitepaper?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableStringFieldUpdateOperationsInput | string | null
    imageSmall?: NullableStringFieldUpdateOperationsInput | string | null
    imageLarge?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CryptocurrencyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    coingeckoId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCapRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalVolume?: NullableFloatFieldUpdateOperationsInput | number | null
    high24h?: NullableFloatFieldUpdateOperationsInput | number | null
    low24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChangePercentage24h?: NullableFloatFieldUpdateOperationsInput | number | null
    circulatingSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    maxSupply?: NullableFloatFieldUpdateOperationsInput | number | null
    ath?: NullableFloatFieldUpdateOperationsInput | number | null
    athDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    atl?: NullableFloatFieldUpdateOperationsInput | number | null
    atlDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    homepage?: NullableStringFieldUpdateOperationsInput | string | null
    whitepaper?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableStringFieldUpdateOperationsInput | string | null
    imageSmall?: NullableStringFieldUpdateOperationsInput | string | null
    imageLarge?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityCreateInput = {
    id?: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCopilotActivitiesInput
  }

  export type CopilotActivityUncheckedCreateInput = {
    id?: string
    userId: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CopilotActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCopilotActivitiesNestedInput
  }

  export type CopilotActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityCreateManyInput = {
    id?: string
    userId: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CopilotActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutomationTaskCreateInput = {
    id?: string
    name: string
    description?: string | null
    type: string
    schedule?: string | null
    enabled?: boolean
    lastRun?: Date | string | null
    nextRun?: Date | string | null
    runCount?: number
    config?: string | null
    lastResult?: string | null
    lastStatus?: string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutomationTaskUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    type: string
    schedule?: string | null
    enabled?: boolean
    lastRun?: Date | string | null
    nextRun?: Date | string | null
    runCount?: number
    config?: string | null
    lastResult?: string | null
    lastStatus?: string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutomationTaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    lastRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    runCount?: IntFieldUpdateOperationsInput | number
    config?: NullableStringFieldUpdateOperationsInput | string | null
    lastResult?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutomationTaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    lastRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    runCount?: IntFieldUpdateOperationsInput | number
    config?: NullableStringFieldUpdateOperationsInput | string | null
    lastResult?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutomationTaskCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    type: string
    schedule?: string | null
    enabled?: boolean
    lastRun?: Date | string | null
    nextRun?: Date | string | null
    runCount?: number
    config?: string | null
    lastResult?: string | null
    lastStatus?: string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutomationTaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    lastRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    runCount?: IntFieldUpdateOperationsInput | number
    config?: NullableStringFieldUpdateOperationsInput | string | null
    lastResult?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutomationTaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    lastRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    runCount?: IntFieldUpdateOperationsInput | number
    config?: NullableStringFieldUpdateOperationsInput | string | null
    lastResult?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotReportCreateInput = {
    id?: string
    type: string
    title: string
    startDate: Date | string
    endDate: Date | string
    summary: string
    data: string
    sections: string
    generatedBy: string
    taskId?: string | null
    articlesAnalyzed?: number
    alertsFound?: number
    createdAt?: Date | string
  }

  export type CopilotReportUncheckedCreateInput = {
    id?: string
    type: string
    title: string
    startDate: Date | string
    endDate: Date | string
    summary: string
    data: string
    sections: string
    generatedBy: string
    taskId?: string | null
    articlesAnalyzed?: number
    alertsFound?: number
    createdAt?: Date | string
  }

  export type CopilotReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    sections?: StringFieldUpdateOperationsInput | string
    generatedBy?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    articlesAnalyzed?: IntFieldUpdateOperationsInput | number
    alertsFound?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    sections?: StringFieldUpdateOperationsInput | string
    generatedBy?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    articlesAnalyzed?: IntFieldUpdateOperationsInput | number
    alertsFound?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotReportCreateManyInput = {
    id?: string
    type: string
    title: string
    startDate: Date | string
    endDate: Date | string
    summary: string
    data: string
    sections: string
    generatedBy: string
    taskId?: string | null
    articlesAnalyzed?: number
    alertsFound?: number
    createdAt?: Date | string
  }

  export type CopilotReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    sections?: StringFieldUpdateOperationsInput | string
    generatedBy?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    articlesAnalyzed?: IntFieldUpdateOperationsInput | number
    alertsFound?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    summary?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    sections?: StringFieldUpdateOperationsInput | string
    generatedBy?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    articlesAnalyzed?: IntFieldUpdateOperationsInput | number
    alertsFound?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryCreateInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutCommunityStoriesInput
  }

  export type CommunityStoryUncheckedCreateInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    userId?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityStoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutCommunityStoriesNestedInput
  }

  export type CommunityStoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryCreateManyInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    userId?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityStoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialProjectCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    longDescription?: string | null
    fundingGoal: number
    currentFunding?: number
    currency?: string
    walletAddress?: string | null
    category: $Enums.ProjectCategory
    location?: string | null
    tags?: string | null
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    supporters?: number
    views?: number
    coverImage?: string | null
    gallery?: string | null
    organizer: string
    organizerEmail?: string | null
    organizerPhone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    map?: ProjectMapCreateNestedOneWithoutProjectInput
  }

  export type SocialProjectUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    longDescription?: string | null
    fundingGoal: number
    currentFunding?: number
    currency?: string
    walletAddress?: string | null
    category: $Enums.ProjectCategory
    location?: string | null
    tags?: string | null
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    supporters?: number
    views?: number
    coverImage?: string | null
    gallery?: string | null
    organizer: string
    organizerEmail?: string | null
    organizerPhone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    map?: ProjectMapUncheckedCreateNestedOneWithoutProjectInput
  }

  export type SocialProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    map?: ProjectMapUpdateOneWithoutProjectNestedInput
  }

  export type SocialProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    map?: ProjectMapUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type SocialProjectCreateManyInput = {
    id?: string
    slug: string
    name: string
    description: string
    longDescription?: string | null
    fundingGoal: number
    currentFunding?: number
    currency?: string
    walletAddress?: string | null
    category: $Enums.ProjectCategory
    location?: string | null
    tags?: string | null
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    supporters?: number
    views?: number
    coverImage?: string | null
    gallery?: string | null
    organizer: string
    organizerEmail?: string | null
    organizerPhone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMapCreateInput = {
    id?: string
    latitude: number
    longitude: number
    address?: string | null
    city: string
    state: string
    country: string
    markerColor?: string
    markerIcon?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: SocialProjectCreateNestedOneWithoutMapInput
  }

  export type ProjectMapUncheckedCreateInput = {
    id?: string
    projectId: string
    latitude: number
    longitude: number
    address?: string | null
    city: string
    state: string
    country: string
    markerColor?: string
    markerIcon?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: SocialProjectUpdateOneRequiredWithoutMapNestedInput
  }

  export type ProjectMapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMapCreateManyInput = {
    id?: string
    projectId: string
    latitude: number
    longitude: number
    address?: string | null
    city: string
    state: string
    country: string
    markerColor?: string
    markerIcon?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressCreateInput = {
    id?: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
    user: UserCreateNestedOneWithoutUserProgressInput
  }

  export type UserProgressUncheckedCreateInput = {
    id?: string
    userId: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
  }

  export type UserProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type UserProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressCreateManyInput = {
    id?: string
    userId: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
  }

  export type UserProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleFactCheckCreateInput = {
    id?: string
    articleId: string
    userId: string
    score: number
    status: string
    summary: string
    createdAt?: Date | string
  }

  export type ArticleFactCheckUncheckedCreateInput = {
    id?: string
    articleId: string
    userId: string
    score: number
    status: string
    summary: string
    createdAt?: Date | string
  }

  export type ArticleFactCheckUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleFactCheckUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleFactCheckCreateManyInput = {
    id?: string
    articleId: string
    userId: string
    score: number
    status: string
    summary: string
    createdAt?: Date | string
  }

  export type ArticleFactCheckUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleFactCheckUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ArticleListRelationFilter = {
    every?: ArticleWhereInput
    some?: ArticleWhereInput
    none?: ArticleWhereInput
  }

  export type CopilotActivityListRelationFilter = {
    every?: CopilotActivityWhereInput
    some?: CopilotActivityWhereInput
    none?: CopilotActivityWhereInput
  }

  export type CommunityStoryListRelationFilter = {
    every?: CommunityStoryWhereInput
    some?: CommunityStoryWhereInput
    none?: CommunityStoryWhereInput
  }

  export type UserProgressListRelationFilter = {
    every?: UserProgressWhereInput
    some?: UserProgressWhereInput
    none?: UserProgressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CopilotActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommunityStoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    clerkId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    points?: SortOrder
    badges?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    points?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    clerkId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    points?: SortOrder
    badges?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    clerkId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    points?: SortOrder
    badges?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    points?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumSentimentFilter<$PrismaModel = never> = {
    equals?: $Enums.Sentiment | EnumSentimentFieldRefInput<$PrismaModel>
    in?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    not?: NestedEnumSentimentFilter<$PrismaModel> | $Enums.Sentiment
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumWarningLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WarningLevel | EnumWarningLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWarningLevelNullableFilter<$PrismaModel> | $Enums.WarningLevel | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CitationListRelationFilter = {
    every?: CitationWhereInput
    some?: CitationWhereInput
    none?: CitationWhereInput
  }

  export type CitationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    type?: SortOrder
    excerpt?: SortOrder
    published?: SortOrder
    authorId?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    sentiment?: SortOrder
    factCheckScore?: SortOrder
    factCheckSources?: SortOrder
    factCheckDate?: SortOrder
    factCheckStatus?: SortOrder
    factCheckClicks?: SortOrder
    level?: SortOrder
    contentType?: SortOrder
    readTime?: SortOrder
    warningLevel?: SortOrder
    securityTips?: SortOrder
    courseSequence?: SortOrder
    relatedArticles?: SortOrder
    projectHighlight?: SortOrder
    coverImage?: SortOrder
    coverImageAlt?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleAvgOrderByAggregateInput = {
    factCheckScore?: SortOrder
    factCheckClicks?: SortOrder
    courseSequence?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    type?: SortOrder
    excerpt?: SortOrder
    published?: SortOrder
    authorId?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    sentiment?: SortOrder
    factCheckScore?: SortOrder
    factCheckSources?: SortOrder
    factCheckDate?: SortOrder
    factCheckStatus?: SortOrder
    factCheckClicks?: SortOrder
    level?: SortOrder
    contentType?: SortOrder
    readTime?: SortOrder
    warningLevel?: SortOrder
    securityTips?: SortOrder
    courseSequence?: SortOrder
    relatedArticles?: SortOrder
    projectHighlight?: SortOrder
    coverImage?: SortOrder
    coverImageAlt?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    type?: SortOrder
    excerpt?: SortOrder
    published?: SortOrder
    authorId?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    sentiment?: SortOrder
    factCheckScore?: SortOrder
    factCheckSources?: SortOrder
    factCheckDate?: SortOrder
    factCheckStatus?: SortOrder
    factCheckClicks?: SortOrder
    level?: SortOrder
    contentType?: SortOrder
    readTime?: SortOrder
    warningLevel?: SortOrder
    securityTips?: SortOrder
    courseSequence?: SortOrder
    relatedArticles?: SortOrder
    projectHighlight?: SortOrder
    coverImage?: SortOrder
    coverImageAlt?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleSumOrderByAggregateInput = {
    factCheckScore?: SortOrder
    factCheckClicks?: SortOrder
    courseSequence?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumSentimentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sentiment | EnumSentimentFieldRefInput<$PrismaModel>
    in?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    not?: NestedEnumSentimentWithAggregatesFilter<$PrismaModel> | $Enums.Sentiment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSentimentFilter<$PrismaModel>
    _max?: NestedEnumSentimentFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumWarningLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WarningLevel | EnumWarningLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWarningLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.WarningLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWarningLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumWarningLevelNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ArticleScalarRelationFilter = {
    is?: ArticleWhereInput
    isNot?: ArticleWhereInput
  }

  export type CitationCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    domain?: SortOrder
    articleId?: SortOrder
    order?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
  }

  export type CitationAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type CitationMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    domain?: SortOrder
    articleId?: SortOrder
    order?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
  }

  export type CitationMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    domain?: SortOrder
    articleId?: SortOrder
    order?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
  }

  export type CitationSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ResourceCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    verified?: SortOrder
    shortDescription?: SortOrder
    officialUrl?: SortOrder
    platforms?: SortOrder
    tags?: SortOrder
    heroTitle?: SortOrder
    heroDescription?: SortOrder
    heroGradient?: SortOrder
    whyGoodTitle?: SortOrder
    whyGoodContent?: SortOrder
    features?: SortOrder
    howToStartTitle?: SortOrder
    howToStartSteps?: SortOrder
    pros?: SortOrder
    cons?: SortOrder
    faq?: SortOrder
    securityTips?: SortOrder
    securityAudit?: SortOrder
    securityAuditDate?: SortOrder
    auditedByCommunity?: SortOrder
    toolConfig?: SortOrder
    interactiveType?: SortOrder
    showCompatibleWallets?: SortOrder
    relatedResources?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVerified?: SortOrder
  }

  export type ResourceAvgOrderByAggregateInput = {
    views?: SortOrder
  }

  export type ResourceMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    verified?: SortOrder
    shortDescription?: SortOrder
    officialUrl?: SortOrder
    platforms?: SortOrder
    tags?: SortOrder
    heroTitle?: SortOrder
    heroDescription?: SortOrder
    heroGradient?: SortOrder
    whyGoodTitle?: SortOrder
    whyGoodContent?: SortOrder
    features?: SortOrder
    howToStartTitle?: SortOrder
    howToStartSteps?: SortOrder
    pros?: SortOrder
    cons?: SortOrder
    faq?: SortOrder
    securityTips?: SortOrder
    securityAudit?: SortOrder
    securityAuditDate?: SortOrder
    auditedByCommunity?: SortOrder
    toolConfig?: SortOrder
    interactiveType?: SortOrder
    showCompatibleWallets?: SortOrder
    relatedResources?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVerified?: SortOrder
  }

  export type ResourceMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    verified?: SortOrder
    shortDescription?: SortOrder
    officialUrl?: SortOrder
    platforms?: SortOrder
    tags?: SortOrder
    heroTitle?: SortOrder
    heroDescription?: SortOrder
    heroGradient?: SortOrder
    whyGoodTitle?: SortOrder
    whyGoodContent?: SortOrder
    features?: SortOrder
    howToStartTitle?: SortOrder
    howToStartSteps?: SortOrder
    pros?: SortOrder
    cons?: SortOrder
    faq?: SortOrder
    securityTips?: SortOrder
    securityAudit?: SortOrder
    securityAuditDate?: SortOrder
    auditedByCommunity?: SortOrder
    toolConfig?: SortOrder
    interactiveType?: SortOrder
    showCompatibleWallets?: SortOrder
    relatedResources?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVerified?: SortOrder
  }

  export type ResourceSumOrderByAggregateInput = {
    views?: SortOrder
  }

  export type CryptocurrencyCountOrderByAggregateInput = {
    id?: SortOrder
    coingeckoId?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    currentPrice?: SortOrder
    marketCap?: SortOrder
    marketCapRank?: SortOrder
    totalVolume?: SortOrder
    high24h?: SortOrder
    low24h?: SortOrder
    priceChange24h?: SortOrder
    priceChangePercentage24h?: SortOrder
    circulatingSupply?: SortOrder
    totalSupply?: SortOrder
    maxSupply?: SortOrder
    ath?: SortOrder
    athDate?: SortOrder
    atl?: SortOrder
    atlDate?: SortOrder
    description?: SortOrder
    homepage?: SortOrder
    whitepaper?: SortOrder
    blockchain?: SortOrder
    socialLinks?: SortOrder
    imageSmall?: SortOrder
    imageLarge?: SortOrder
    slug?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type CryptocurrencyAvgOrderByAggregateInput = {
    currentPrice?: SortOrder
    marketCap?: SortOrder
    marketCapRank?: SortOrder
    totalVolume?: SortOrder
    high24h?: SortOrder
    low24h?: SortOrder
    priceChange24h?: SortOrder
    priceChangePercentage24h?: SortOrder
    circulatingSupply?: SortOrder
    totalSupply?: SortOrder
    maxSupply?: SortOrder
    ath?: SortOrder
    atl?: SortOrder
  }

  export type CryptocurrencyMaxOrderByAggregateInput = {
    id?: SortOrder
    coingeckoId?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    currentPrice?: SortOrder
    marketCap?: SortOrder
    marketCapRank?: SortOrder
    totalVolume?: SortOrder
    high24h?: SortOrder
    low24h?: SortOrder
    priceChange24h?: SortOrder
    priceChangePercentage24h?: SortOrder
    circulatingSupply?: SortOrder
    totalSupply?: SortOrder
    maxSupply?: SortOrder
    ath?: SortOrder
    athDate?: SortOrder
    atl?: SortOrder
    atlDate?: SortOrder
    description?: SortOrder
    homepage?: SortOrder
    whitepaper?: SortOrder
    blockchain?: SortOrder
    socialLinks?: SortOrder
    imageSmall?: SortOrder
    imageLarge?: SortOrder
    slug?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type CryptocurrencyMinOrderByAggregateInput = {
    id?: SortOrder
    coingeckoId?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    currentPrice?: SortOrder
    marketCap?: SortOrder
    marketCapRank?: SortOrder
    totalVolume?: SortOrder
    high24h?: SortOrder
    low24h?: SortOrder
    priceChange24h?: SortOrder
    priceChangePercentage24h?: SortOrder
    circulatingSupply?: SortOrder
    totalSupply?: SortOrder
    maxSupply?: SortOrder
    ath?: SortOrder
    athDate?: SortOrder
    atl?: SortOrder
    atlDate?: SortOrder
    description?: SortOrder
    homepage?: SortOrder
    whitepaper?: SortOrder
    blockchain?: SortOrder
    socialLinks?: SortOrder
    imageSmall?: SortOrder
    imageLarge?: SortOrder
    slug?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type CryptocurrencySumOrderByAggregateInput = {
    currentPrice?: SortOrder
    marketCap?: SortOrder
    marketCapRank?: SortOrder
    totalVolume?: SortOrder
    high24h?: SortOrder
    low24h?: SortOrder
    priceChange24h?: SortOrder
    priceChangePercentage24h?: SortOrder
    circulatingSupply?: SortOrder
    totalSupply?: SortOrder
    maxSupply?: SortOrder
    ath?: SortOrder
    atl?: SortOrder
  }

  export type CopilotActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    parameters?: SortOrder
    result?: SortOrder
    status?: SortOrder
    requiresConfirmation?: SortOrder
    confirmed?: SortOrder
    confirmedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    parameters?: SortOrder
    result?: SortOrder
    status?: SortOrder
    requiresConfirmation?: SortOrder
    confirmed?: SortOrder
    confirmedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    parameters?: SortOrder
    result?: SortOrder
    status?: SortOrder
    requiresConfirmation?: SortOrder
    confirmed?: SortOrder
    confirmedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AutomationTaskCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    schedule?: SortOrder
    enabled?: SortOrder
    lastRun?: SortOrder
    nextRun?: SortOrder
    runCount?: SortOrder
    config?: SortOrder
    lastResult?: SortOrder
    lastStatus?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutomationTaskAvgOrderByAggregateInput = {
    runCount?: SortOrder
  }

  export type AutomationTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    schedule?: SortOrder
    enabled?: SortOrder
    lastRun?: SortOrder
    nextRun?: SortOrder
    runCount?: SortOrder
    config?: SortOrder
    lastResult?: SortOrder
    lastStatus?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutomationTaskMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    schedule?: SortOrder
    enabled?: SortOrder
    lastRun?: SortOrder
    nextRun?: SortOrder
    runCount?: SortOrder
    config?: SortOrder
    lastResult?: SortOrder
    lastStatus?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutomationTaskSumOrderByAggregateInput = {
    runCount?: SortOrder
  }

  export type CopilotReportCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    data?: SortOrder
    sections?: SortOrder
    generatedBy?: SortOrder
    taskId?: SortOrder
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotReportAvgOrderByAggregateInput = {
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
  }

  export type CopilotReportMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    data?: SortOrder
    sections?: SortOrder
    generatedBy?: SortOrder
    taskId?: SortOrder
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotReportMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    data?: SortOrder
    sections?: SortOrder
    generatedBy?: SortOrder
    taskId?: SortOrder
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
    createdAt?: SortOrder
  }

  export type CopilotReportSumOrderByAggregateInput = {
    articlesAnalyzed?: SortOrder
    alertsFound?: SortOrder
  }

  export type EnumStoryCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.StoryCategory | EnumStoryCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumStoryCategoryFilter<$PrismaModel> | $Enums.StoryCategory
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CommunityStoryCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    authorName?: SortOrder
    authorAvatar?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    likes?: SortOrder
    verified?: SortOrder
    featured?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityStoryAvgOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type CommunityStoryMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    authorName?: SortOrder
    authorAvatar?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    likes?: SortOrder
    verified?: SortOrder
    featured?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityStoryMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    authorName?: SortOrder
    authorAvatar?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    likes?: SortOrder
    verified?: SortOrder
    featured?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityStorySumOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type EnumStoryCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StoryCategory | EnumStoryCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumStoryCategoryWithAggregatesFilter<$PrismaModel> | $Enums.StoryCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStoryCategoryFilter<$PrismaModel>
    _max?: NestedEnumStoryCategoryFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumProjectCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectCategory | EnumProjectCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectCategoryFilter<$PrismaModel> | $Enums.ProjectCategory
  }

  export type ProjectMapNullableScalarRelationFilter = {
    is?: ProjectMapWhereInput | null
    isNot?: ProjectMapWhereInput | null
  }

  export type SocialProjectCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    longDescription?: SortOrder
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    currency?: SortOrder
    walletAddress?: SortOrder
    category?: SortOrder
    location?: SortOrder
    tags?: SortOrder
    verified?: SortOrder
    active?: SortOrder
    featured?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    supporters?: SortOrder
    views?: SortOrder
    coverImage?: SortOrder
    gallery?: SortOrder
    organizer?: SortOrder
    organizerEmail?: SortOrder
    organizerPhone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialProjectAvgOrderByAggregateInput = {
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    supporters?: SortOrder
    views?: SortOrder
  }

  export type SocialProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    longDescription?: SortOrder
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    currency?: SortOrder
    walletAddress?: SortOrder
    category?: SortOrder
    location?: SortOrder
    tags?: SortOrder
    verified?: SortOrder
    active?: SortOrder
    featured?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    supporters?: SortOrder
    views?: SortOrder
    coverImage?: SortOrder
    gallery?: SortOrder
    organizer?: SortOrder
    organizerEmail?: SortOrder
    organizerPhone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialProjectMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    longDescription?: SortOrder
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    currency?: SortOrder
    walletAddress?: SortOrder
    category?: SortOrder
    location?: SortOrder
    tags?: SortOrder
    verified?: SortOrder
    active?: SortOrder
    featured?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    supporters?: SortOrder
    views?: SortOrder
    coverImage?: SortOrder
    gallery?: SortOrder
    organizer?: SortOrder
    organizerEmail?: SortOrder
    organizerPhone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialProjectSumOrderByAggregateInput = {
    fundingGoal?: SortOrder
    currentFunding?: SortOrder
    supporters?: SortOrder
    views?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumProjectCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectCategory | EnumProjectCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ProjectCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectCategoryFilter<$PrismaModel>
    _max?: NestedEnumProjectCategoryFilter<$PrismaModel>
  }

  export type SocialProjectScalarRelationFilter = {
    is?: SocialProjectWhereInput
    isNot?: SocialProjectWhereInput
  }

  export type ProjectMapCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    markerColor?: SortOrder
    markerIcon?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMapAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type ProjectMapMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    markerColor?: SortOrder
    markerIcon?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMapMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    markerColor?: SortOrder
    markerIcon?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMapSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type UserProgressUserIdArticleSlugCompoundUniqueInput = {
    userId: string
    articleSlug: string
  }

  export type UserProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleSlug?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    quizScore?: SortOrder
    quizAttempts?: SortOrder
    certificateIssued?: SortOrder
    certificateUrl?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    lastAccessed?: SortOrder
  }

  export type UserProgressAvgOrderByAggregateInput = {
    progress?: SortOrder
    quizScore?: SortOrder
    quizAttempts?: SortOrder
  }

  export type UserProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleSlug?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    quizScore?: SortOrder
    quizAttempts?: SortOrder
    certificateIssued?: SortOrder
    certificateUrl?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    lastAccessed?: SortOrder
  }

  export type UserProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleSlug?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    quizScore?: SortOrder
    quizAttempts?: SortOrder
    certificateIssued?: SortOrder
    certificateUrl?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    lastAccessed?: SortOrder
  }

  export type UserProgressSumOrderByAggregateInput = {
    progress?: SortOrder
    quizScore?: SortOrder
    quizAttempts?: SortOrder
  }

  export type ArticleFactCheckArticleIdUserIdCompoundUniqueInput = {
    articleId: string
    userId: string
  }

  export type ArticleFactCheckCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleFactCheckAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ArticleFactCheckMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleFactCheckMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleFactCheckSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ArticleCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput> | ArticleCreateWithoutAuthorInput[] | ArticleUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutAuthorInput | ArticleCreateOrConnectWithoutAuthorInput[]
    createMany?: ArticleCreateManyAuthorInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type CopilotActivityCreateNestedManyWithoutUserInput = {
    create?: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput> | CopilotActivityCreateWithoutUserInput[] | CopilotActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CopilotActivityCreateOrConnectWithoutUserInput | CopilotActivityCreateOrConnectWithoutUserInput[]
    createMany?: CopilotActivityCreateManyUserInputEnvelope
    connect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
  }

  export type CommunityStoryCreateNestedManyWithoutUserInput = {
    create?: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput> | CommunityStoryCreateWithoutUserInput[] | CommunityStoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommunityStoryCreateOrConnectWithoutUserInput | CommunityStoryCreateOrConnectWithoutUserInput[]
    createMany?: CommunityStoryCreateManyUserInputEnvelope
    connect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
  }

  export type UserProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput> | ArticleCreateWithoutAuthorInput[] | ArticleUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutAuthorInput | ArticleCreateOrConnectWithoutAuthorInput[]
    createMany?: ArticleCreateManyAuthorInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type CopilotActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput> | CopilotActivityCreateWithoutUserInput[] | CopilotActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CopilotActivityCreateOrConnectWithoutUserInput | CopilotActivityCreateOrConnectWithoutUserInput[]
    createMany?: CopilotActivityCreateManyUserInputEnvelope
    connect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
  }

  export type CommunityStoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput> | CommunityStoryCreateWithoutUserInput[] | CommunityStoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommunityStoryCreateOrConnectWithoutUserInput | CommunityStoryCreateOrConnectWithoutUserInput[]
    createMany?: CommunityStoryCreateManyUserInputEnvelope
    connect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
  }

  export type UserProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ArticleUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput> | ArticleCreateWithoutAuthorInput[] | ArticleUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutAuthorInput | ArticleCreateOrConnectWithoutAuthorInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutAuthorInput | ArticleUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ArticleCreateManyAuthorInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutAuthorInput | ArticleUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutAuthorInput | ArticleUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type CopilotActivityUpdateManyWithoutUserNestedInput = {
    create?: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput> | CopilotActivityCreateWithoutUserInput[] | CopilotActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CopilotActivityCreateOrConnectWithoutUserInput | CopilotActivityCreateOrConnectWithoutUserInput[]
    upsert?: CopilotActivityUpsertWithWhereUniqueWithoutUserInput | CopilotActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CopilotActivityCreateManyUserInputEnvelope
    set?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    disconnect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    delete?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    connect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    update?: CopilotActivityUpdateWithWhereUniqueWithoutUserInput | CopilotActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CopilotActivityUpdateManyWithWhereWithoutUserInput | CopilotActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CopilotActivityScalarWhereInput | CopilotActivityScalarWhereInput[]
  }

  export type CommunityStoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput> | CommunityStoryCreateWithoutUserInput[] | CommunityStoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommunityStoryCreateOrConnectWithoutUserInput | CommunityStoryCreateOrConnectWithoutUserInput[]
    upsert?: CommunityStoryUpsertWithWhereUniqueWithoutUserInput | CommunityStoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommunityStoryCreateManyUserInputEnvelope
    set?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    disconnect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    delete?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    connect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    update?: CommunityStoryUpdateWithWhereUniqueWithoutUserInput | CommunityStoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommunityStoryUpdateManyWithWhereWithoutUserInput | CommunityStoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommunityStoryScalarWhereInput | CommunityStoryScalarWhereInput[]
  }

  export type UserProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutUserInput | UserProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutUserInput | UserProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutUserInput | UserProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput> | ArticleCreateWithoutAuthorInput[] | ArticleUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutAuthorInput | ArticleCreateOrConnectWithoutAuthorInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutAuthorInput | ArticleUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ArticleCreateManyAuthorInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutAuthorInput | ArticleUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutAuthorInput | ArticleUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type CopilotActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput> | CopilotActivityCreateWithoutUserInput[] | CopilotActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CopilotActivityCreateOrConnectWithoutUserInput | CopilotActivityCreateOrConnectWithoutUserInput[]
    upsert?: CopilotActivityUpsertWithWhereUniqueWithoutUserInput | CopilotActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CopilotActivityCreateManyUserInputEnvelope
    set?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    disconnect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    delete?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    connect?: CopilotActivityWhereUniqueInput | CopilotActivityWhereUniqueInput[]
    update?: CopilotActivityUpdateWithWhereUniqueWithoutUserInput | CopilotActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CopilotActivityUpdateManyWithWhereWithoutUserInput | CopilotActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CopilotActivityScalarWhereInput | CopilotActivityScalarWhereInput[]
  }

  export type CommunityStoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput> | CommunityStoryCreateWithoutUserInput[] | CommunityStoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommunityStoryCreateOrConnectWithoutUserInput | CommunityStoryCreateOrConnectWithoutUserInput[]
    upsert?: CommunityStoryUpsertWithWhereUniqueWithoutUserInput | CommunityStoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommunityStoryCreateManyUserInputEnvelope
    set?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    disconnect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    delete?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    connect?: CommunityStoryWhereUniqueInput | CommunityStoryWhereUniqueInput[]
    update?: CommunityStoryUpdateWithWhereUniqueWithoutUserInput | CommunityStoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommunityStoryUpdateManyWithWhereWithoutUserInput | CommunityStoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommunityStoryScalarWhereInput | CommunityStoryScalarWhereInput[]
  }

  export type UserProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutUserInput | UserProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutUserInput | UserProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutUserInput | UserProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutArticlesInput = {
    create?: XOR<UserCreateWithoutArticlesInput, UserUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutArticlesInput
    connect?: UserWhereUniqueInput
  }

  export type CitationCreateNestedManyWithoutArticleInput = {
    create?: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput> | CitationCreateWithoutArticleInput[] | CitationUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CitationCreateOrConnectWithoutArticleInput | CitationCreateOrConnectWithoutArticleInput[]
    createMany?: CitationCreateManyArticleInputEnvelope
    connect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
  }

  export type CitationUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput> | CitationCreateWithoutArticleInput[] | CitationUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CitationCreateOrConnectWithoutArticleInput | CitationCreateOrConnectWithoutArticleInput[]
    createMany?: CitationCreateManyArticleInputEnvelope
    connect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumSentimentFieldUpdateOperationsInput = {
    set?: $Enums.Sentiment
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumWarningLevelFieldUpdateOperationsInput = {
    set?: $Enums.WarningLevel | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<UserCreateWithoutArticlesInput, UserUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutArticlesInput
    upsert?: UserUpsertWithoutArticlesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutArticlesInput, UserUpdateWithoutArticlesInput>, UserUncheckedUpdateWithoutArticlesInput>
  }

  export type CitationUpdateManyWithoutArticleNestedInput = {
    create?: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput> | CitationCreateWithoutArticleInput[] | CitationUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CitationCreateOrConnectWithoutArticleInput | CitationCreateOrConnectWithoutArticleInput[]
    upsert?: CitationUpsertWithWhereUniqueWithoutArticleInput | CitationUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: CitationCreateManyArticleInputEnvelope
    set?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    disconnect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    delete?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    connect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    update?: CitationUpdateWithWhereUniqueWithoutArticleInput | CitationUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: CitationUpdateManyWithWhereWithoutArticleInput | CitationUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: CitationScalarWhereInput | CitationScalarWhereInput[]
  }

  export type CitationUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput> | CitationCreateWithoutArticleInput[] | CitationUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CitationCreateOrConnectWithoutArticleInput | CitationCreateOrConnectWithoutArticleInput[]
    upsert?: CitationUpsertWithWhereUniqueWithoutArticleInput | CitationUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: CitationCreateManyArticleInputEnvelope
    set?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    disconnect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    delete?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    connect?: CitationWhereUniqueInput | CitationWhereUniqueInput[]
    update?: CitationUpdateWithWhereUniqueWithoutArticleInput | CitationUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: CitationUpdateManyWithWhereWithoutArticleInput | CitationUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: CitationScalarWhereInput | CitationScalarWhereInput[]
  }

  export type ArticleCreateNestedOneWithoutCitationsInput = {
    create?: XOR<ArticleCreateWithoutCitationsInput, ArticleUncheckedCreateWithoutCitationsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCitationsInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleUpdateOneRequiredWithoutCitationsNestedInput = {
    create?: XOR<ArticleCreateWithoutCitationsInput, ArticleUncheckedCreateWithoutCitationsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCitationsInput
    upsert?: ArticleUpsertWithoutCitationsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutCitationsInput, ArticleUpdateWithoutCitationsInput>, ArticleUncheckedUpdateWithoutCitationsInput>
  }

  export type UserCreateNestedOneWithoutCopilotActivitiesInput = {
    create?: XOR<UserCreateWithoutCopilotActivitiesInput, UserUncheckedCreateWithoutCopilotActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCopilotActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCopilotActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutCopilotActivitiesInput, UserUncheckedCreateWithoutCopilotActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCopilotActivitiesInput
    upsert?: UserUpsertWithoutCopilotActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCopilotActivitiesInput, UserUpdateWithoutCopilotActivitiesInput>, UserUncheckedUpdateWithoutCopilotActivitiesInput>
  }

  export type UserCreateNestedOneWithoutCommunityStoriesInput = {
    create?: XOR<UserCreateWithoutCommunityStoriesInput, UserUncheckedCreateWithoutCommunityStoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommunityStoriesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumStoryCategoryFieldUpdateOperationsInput = {
    set?: $Enums.StoryCategory
  }

  export type UserUpdateOneWithoutCommunityStoriesNestedInput = {
    create?: XOR<UserCreateWithoutCommunityStoriesInput, UserUncheckedCreateWithoutCommunityStoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommunityStoriesInput
    upsert?: UserUpsertWithoutCommunityStoriesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommunityStoriesInput, UserUpdateWithoutCommunityStoriesInput>, UserUncheckedUpdateWithoutCommunityStoriesInput>
  }

  export type ProjectMapCreateNestedOneWithoutProjectInput = {
    create?: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectMapCreateOrConnectWithoutProjectInput
    connect?: ProjectMapWhereUniqueInput
  }

  export type ProjectMapUncheckedCreateNestedOneWithoutProjectInput = {
    create?: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectMapCreateOrConnectWithoutProjectInput
    connect?: ProjectMapWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumProjectCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ProjectCategory
  }

  export type ProjectMapUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectMapCreateOrConnectWithoutProjectInput
    upsert?: ProjectMapUpsertWithoutProjectInput
    disconnect?: ProjectMapWhereInput | boolean
    delete?: ProjectMapWhereInput | boolean
    connect?: ProjectMapWhereUniqueInput
    update?: XOR<XOR<ProjectMapUpdateToOneWithWhereWithoutProjectInput, ProjectMapUpdateWithoutProjectInput>, ProjectMapUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectMapUncheckedUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectMapCreateOrConnectWithoutProjectInput
    upsert?: ProjectMapUpsertWithoutProjectInput
    disconnect?: ProjectMapWhereInput | boolean
    delete?: ProjectMapWhereInput | boolean
    connect?: ProjectMapWhereUniqueInput
    update?: XOR<XOR<ProjectMapUpdateToOneWithWhereWithoutProjectInput, ProjectMapUpdateWithoutProjectInput>, ProjectMapUncheckedUpdateWithoutProjectInput>
  }

  export type SocialProjectCreateNestedOneWithoutMapInput = {
    create?: XOR<SocialProjectCreateWithoutMapInput, SocialProjectUncheckedCreateWithoutMapInput>
    connectOrCreate?: SocialProjectCreateOrConnectWithoutMapInput
    connect?: SocialProjectWhereUniqueInput
  }

  export type SocialProjectUpdateOneRequiredWithoutMapNestedInput = {
    create?: XOR<SocialProjectCreateWithoutMapInput, SocialProjectUncheckedCreateWithoutMapInput>
    connectOrCreate?: SocialProjectCreateOrConnectWithoutMapInput
    upsert?: SocialProjectUpsertWithoutMapInput
    connect?: SocialProjectWhereUniqueInput
    update?: XOR<XOR<SocialProjectUpdateToOneWithWhereWithoutMapInput, SocialProjectUpdateWithoutMapInput>, SocialProjectUncheckedUpdateWithoutMapInput>
  }

  export type UserCreateNestedOneWithoutUserProgressInput = {
    create?: XOR<UserCreateWithoutUserProgressInput, UserUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserProgressInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserProgressNestedInput = {
    create?: XOR<UserCreateWithoutUserProgressInput, UserUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserProgressInput
    upsert?: UserUpsertWithoutUserProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserProgressInput, UserUpdateWithoutUserProgressInput>, UserUncheckedUpdateWithoutUserProgressInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumSentimentFilter<$PrismaModel = never> = {
    equals?: $Enums.Sentiment | EnumSentimentFieldRefInput<$PrismaModel>
    in?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    not?: NestedEnumSentimentFilter<$PrismaModel> | $Enums.Sentiment
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumWarningLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WarningLevel | EnumWarningLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWarningLevelNullableFilter<$PrismaModel> | $Enums.WarningLevel | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumSentimentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sentiment | EnumSentimentFieldRefInput<$PrismaModel>
    in?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sentiment[] | ListEnumSentimentFieldRefInput<$PrismaModel>
    not?: NestedEnumSentimentWithAggregatesFilter<$PrismaModel> | $Enums.Sentiment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSentimentFilter<$PrismaModel>
    _max?: NestedEnumSentimentFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumWarningLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WarningLevel | EnumWarningLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WarningLevel[] | ListEnumWarningLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWarningLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.WarningLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWarningLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumWarningLevelNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumStoryCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.StoryCategory | EnumStoryCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumStoryCategoryFilter<$PrismaModel> | $Enums.StoryCategory
  }

  export type NestedEnumStoryCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StoryCategory | EnumStoryCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.StoryCategory[] | ListEnumStoryCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumStoryCategoryWithAggregatesFilter<$PrismaModel> | $Enums.StoryCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStoryCategoryFilter<$PrismaModel>
    _max?: NestedEnumStoryCategoryFilter<$PrismaModel>
  }

  export type NestedEnumProjectCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectCategory | EnumProjectCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectCategoryFilter<$PrismaModel> | $Enums.ProjectCategory
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumProjectCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectCategory | EnumProjectCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectCategory[] | ListEnumProjectCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ProjectCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectCategoryFilter<$PrismaModel>
    _max?: NestedEnumProjectCategoryFilter<$PrismaModel>
  }

  export type ArticleCreateWithoutAuthorInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    citations?: CitationCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    citations?: CitationUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutAuthorInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput>
  }

  export type ArticleCreateManyAuthorInputEnvelope = {
    data: ArticleCreateManyAuthorInput | ArticleCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type CopilotActivityCreateWithoutUserInput = {
    id?: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CopilotActivityUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CopilotActivityCreateOrConnectWithoutUserInput = {
    where: CopilotActivityWhereUniqueInput
    create: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput>
  }

  export type CopilotActivityCreateManyUserInputEnvelope = {
    data: CopilotActivityCreateManyUserInput | CopilotActivityCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommunityStoryCreateWithoutUserInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityStoryUncheckedCreateWithoutUserInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityStoryCreateOrConnectWithoutUserInput = {
    where: CommunityStoryWhereUniqueInput
    create: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput>
  }

  export type CommunityStoryCreateManyUserInputEnvelope = {
    data: CommunityStoryCreateManyUserInput | CommunityStoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserProgressCreateWithoutUserInput = {
    id?: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
  }

  export type UserProgressUncheckedCreateWithoutUserInput = {
    id?: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
  }

  export type UserProgressCreateOrConnectWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    create: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput>
  }

  export type UserProgressCreateManyUserInputEnvelope = {
    data: UserProgressCreateManyUserInput | UserProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ArticleUpsertWithWhereUniqueWithoutAuthorInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutAuthorInput, ArticleUncheckedUpdateWithoutAuthorInput>
    create: XOR<ArticleCreateWithoutAuthorInput, ArticleUncheckedCreateWithoutAuthorInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutAuthorInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutAuthorInput, ArticleUncheckedUpdateWithoutAuthorInput>
  }

  export type ArticleUpdateManyWithWhereWithoutAuthorInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutAuthorInput>
  }

  export type ArticleScalarWhereInput = {
    AND?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    OR?: ArticleScalarWhereInput[]
    NOT?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    slug?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    type?: StringFilter<"Article"> | string
    excerpt?: StringNullableFilter<"Article"> | string | null
    published?: BoolFilter<"Article"> | boolean
    authorId?: StringFilter<"Article"> | string
    category?: StringFilter<"Article"> | string
    tags?: StringFilter<"Article"> | string
    sentiment?: EnumSentimentFilter<"Article"> | $Enums.Sentiment
    factCheckScore?: FloatNullableFilter<"Article"> | number | null
    factCheckSources?: StringNullableFilter<"Article"> | string | null
    factCheckDate?: DateTimeNullableFilter<"Article"> | Date | string | null
    factCheckStatus?: StringNullableFilter<"Article"> | string | null
    factCheckClicks?: IntFilter<"Article"> | number
    level?: StringNullableFilter<"Article"> | string | null
    contentType?: StringNullableFilter<"Article"> | string | null
    readTime?: StringNullableFilter<"Article"> | string | null
    warningLevel?: EnumWarningLevelNullableFilter<"Article"> | $Enums.WarningLevel | null
    securityTips?: StringNullableFilter<"Article"> | string | null
    courseSequence?: IntNullableFilter<"Article"> | number | null
    relatedArticles?: StringNullableFilter<"Article"> | string | null
    projectHighlight?: BoolFilter<"Article"> | boolean
    coverImage?: StringNullableFilter<"Article"> | string | null
    coverImageAlt?: StringNullableFilter<"Article"> | string | null
    quizData?: StringNullableFilter<"Article"> | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
  }

  export type CopilotActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: CopilotActivityWhereUniqueInput
    update: XOR<CopilotActivityUpdateWithoutUserInput, CopilotActivityUncheckedUpdateWithoutUserInput>
    create: XOR<CopilotActivityCreateWithoutUserInput, CopilotActivityUncheckedCreateWithoutUserInput>
  }

  export type CopilotActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: CopilotActivityWhereUniqueInput
    data: XOR<CopilotActivityUpdateWithoutUserInput, CopilotActivityUncheckedUpdateWithoutUserInput>
  }

  export type CopilotActivityUpdateManyWithWhereWithoutUserInput = {
    where: CopilotActivityScalarWhereInput
    data: XOR<CopilotActivityUpdateManyMutationInput, CopilotActivityUncheckedUpdateManyWithoutUserInput>
  }

  export type CopilotActivityScalarWhereInput = {
    AND?: CopilotActivityScalarWhereInput | CopilotActivityScalarWhereInput[]
    OR?: CopilotActivityScalarWhereInput[]
    NOT?: CopilotActivityScalarWhereInput | CopilotActivityScalarWhereInput[]
    id?: StringFilter<"CopilotActivity"> | string
    userId?: StringFilter<"CopilotActivity"> | string
    action?: StringFilter<"CopilotActivity"> | string
    parameters?: StringFilter<"CopilotActivity"> | string
    result?: StringNullableFilter<"CopilotActivity"> | string | null
    status?: StringFilter<"CopilotActivity"> | string
    requiresConfirmation?: BoolFilter<"CopilotActivity"> | boolean
    confirmed?: BoolFilter<"CopilotActivity"> | boolean
    confirmedAt?: DateTimeNullableFilter<"CopilotActivity"> | Date | string | null
    createdAt?: DateTimeFilter<"CopilotActivity"> | Date | string
  }

  export type CommunityStoryUpsertWithWhereUniqueWithoutUserInput = {
    where: CommunityStoryWhereUniqueInput
    update: XOR<CommunityStoryUpdateWithoutUserInput, CommunityStoryUncheckedUpdateWithoutUserInput>
    create: XOR<CommunityStoryCreateWithoutUserInput, CommunityStoryUncheckedCreateWithoutUserInput>
  }

  export type CommunityStoryUpdateWithWhereUniqueWithoutUserInput = {
    where: CommunityStoryWhereUniqueInput
    data: XOR<CommunityStoryUpdateWithoutUserInput, CommunityStoryUncheckedUpdateWithoutUserInput>
  }

  export type CommunityStoryUpdateManyWithWhereWithoutUserInput = {
    where: CommunityStoryScalarWhereInput
    data: XOR<CommunityStoryUpdateManyMutationInput, CommunityStoryUncheckedUpdateManyWithoutUserInput>
  }

  export type CommunityStoryScalarWhereInput = {
    AND?: CommunityStoryScalarWhereInput | CommunityStoryScalarWhereInput[]
    OR?: CommunityStoryScalarWhereInput[]
    NOT?: CommunityStoryScalarWhereInput | CommunityStoryScalarWhereInput[]
    id?: StringFilter<"CommunityStory"> | string
    slug?: StringFilter<"CommunityStory"> | string
    authorName?: StringFilter<"CommunityStory"> | string
    authorAvatar?: StringNullableFilter<"CommunityStory"> | string | null
    userId?: StringNullableFilter<"CommunityStory"> | string | null
    title?: StringFilter<"CommunityStory"> | string
    content?: StringFilter<"CommunityStory"> | string
    category?: EnumStoryCategoryFilter<"CommunityStory"> | $Enums.StoryCategory
    likes?: IntFilter<"CommunityStory"> | number
    verified?: BoolFilter<"CommunityStory"> | boolean
    featured?: BoolFilter<"CommunityStory"> | boolean
    published?: BoolFilter<"CommunityStory"> | boolean
    createdAt?: DateTimeFilter<"CommunityStory"> | Date | string
    updatedAt?: DateTimeFilter<"CommunityStory"> | Date | string
  }

  export type UserProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    update: XOR<UserProgressUpdateWithoutUserInput, UserProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput>
  }

  export type UserProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    data: XOR<UserProgressUpdateWithoutUserInput, UserProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserProgressScalarWhereInput
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProgressScalarWhereInput = {
    AND?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
    OR?: UserProgressScalarWhereInput[]
    NOT?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
    id?: StringFilter<"UserProgress"> | string
    userId?: StringFilter<"UserProgress"> | string
    articleSlug?: StringFilter<"UserProgress"> | string
    completed?: BoolFilter<"UserProgress"> | boolean
    progress?: IntFilter<"UserProgress"> | number
    quizScore?: FloatNullableFilter<"UserProgress"> | number | null
    quizAttempts?: IntFilter<"UserProgress"> | number
    certificateIssued?: BoolFilter<"UserProgress"> | boolean
    certificateUrl?: StringNullableFilter<"UserProgress"> | string | null
    startedAt?: DateTimeFilter<"UserProgress"> | Date | string
    completedAt?: DateTimeNullableFilter<"UserProgress"> | Date | string | null
    lastAccessed?: DateTimeFilter<"UserProgress"> | Date | string
  }

  export type UserCreateWithoutArticlesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    copilotActivities?: CopilotActivityCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryCreateNestedManyWithoutUserInput
    userProgress?: UserProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutArticlesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    copilotActivities?: CopilotActivityUncheckedCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryUncheckedCreateNestedManyWithoutUserInput
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutArticlesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutArticlesInput, UserUncheckedCreateWithoutArticlesInput>
  }

  export type CitationCreateWithoutArticleInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    order?: number
    verified?: boolean
    createdAt?: Date | string
  }

  export type CitationUncheckedCreateWithoutArticleInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    order?: number
    verified?: boolean
    createdAt?: Date | string
  }

  export type CitationCreateOrConnectWithoutArticleInput = {
    where: CitationWhereUniqueInput
    create: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput>
  }

  export type CitationCreateManyArticleInputEnvelope = {
    data: CitationCreateManyArticleInput | CitationCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutArticlesInput = {
    update: XOR<UserUpdateWithoutArticlesInput, UserUncheckedUpdateWithoutArticlesInput>
    create: XOR<UserCreateWithoutArticlesInput, UserUncheckedCreateWithoutArticlesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutArticlesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutArticlesInput, UserUncheckedUpdateWithoutArticlesInput>
  }

  export type UserUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    copilotActivities?: CopilotActivityUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    copilotActivities?: CopilotActivityUncheckedUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUncheckedUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CitationUpsertWithWhereUniqueWithoutArticleInput = {
    where: CitationWhereUniqueInput
    update: XOR<CitationUpdateWithoutArticleInput, CitationUncheckedUpdateWithoutArticleInput>
    create: XOR<CitationCreateWithoutArticleInput, CitationUncheckedCreateWithoutArticleInput>
  }

  export type CitationUpdateWithWhereUniqueWithoutArticleInput = {
    where: CitationWhereUniqueInput
    data: XOR<CitationUpdateWithoutArticleInput, CitationUncheckedUpdateWithoutArticleInput>
  }

  export type CitationUpdateManyWithWhereWithoutArticleInput = {
    where: CitationScalarWhereInput
    data: XOR<CitationUpdateManyMutationInput, CitationUncheckedUpdateManyWithoutArticleInput>
  }

  export type CitationScalarWhereInput = {
    AND?: CitationScalarWhereInput | CitationScalarWhereInput[]
    OR?: CitationScalarWhereInput[]
    NOT?: CitationScalarWhereInput | CitationScalarWhereInput[]
    id?: StringFilter<"Citation"> | string
    url?: StringFilter<"Citation"> | string
    title?: StringNullableFilter<"Citation"> | string | null
    domain?: StringNullableFilter<"Citation"> | string | null
    articleId?: StringFilter<"Citation"> | string
    order?: IntFilter<"Citation"> | number
    verified?: BoolFilter<"Citation"> | boolean
    createdAt?: DateTimeFilter<"Citation"> | Date | string
  }

  export type ArticleCreateWithoutCitationsInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserCreateNestedOneWithoutArticlesInput
  }

  export type ArticleUncheckedCreateWithoutCitationsInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    authorId: string
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCreateOrConnectWithoutCitationsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutCitationsInput, ArticleUncheckedCreateWithoutCitationsInput>
  }

  export type ArticleUpsertWithoutCitationsInput = {
    update: XOR<ArticleUpdateWithoutCitationsInput, ArticleUncheckedUpdateWithoutCitationsInput>
    create: XOR<ArticleCreateWithoutCitationsInput, ArticleUncheckedCreateWithoutCitationsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutCitationsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutCitationsInput, ArticleUncheckedUpdateWithoutCitationsInput>
  }

  export type ArticleUpdateWithoutCitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutArticlesNestedInput
  }

  export type ArticleUncheckedUpdateWithoutCitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    authorId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutCopilotActivitiesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleCreateNestedManyWithoutAuthorInput
    communityStories?: CommunityStoryCreateNestedManyWithoutUserInput
    userProgress?: UserProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCopilotActivitiesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleUncheckedCreateNestedManyWithoutAuthorInput
    communityStories?: CommunityStoryUncheckedCreateNestedManyWithoutUserInput
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCopilotActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCopilotActivitiesInput, UserUncheckedCreateWithoutCopilotActivitiesInput>
  }

  export type UserUpsertWithoutCopilotActivitiesInput = {
    update: XOR<UserUpdateWithoutCopilotActivitiesInput, UserUncheckedUpdateWithoutCopilotActivitiesInput>
    create: XOR<UserCreateWithoutCopilotActivitiesInput, UserUncheckedCreateWithoutCopilotActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCopilotActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCopilotActivitiesInput, UserUncheckedUpdateWithoutCopilotActivitiesInput>
  }

  export type UserUpdateWithoutCopilotActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUpdateManyWithoutAuthorNestedInput
    communityStories?: CommunityStoryUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCopilotActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUncheckedUpdateManyWithoutAuthorNestedInput
    communityStories?: CommunityStoryUncheckedUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCommunityStoriesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityCreateNestedManyWithoutUserInput
    userProgress?: UserProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommunityStoriesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleUncheckedCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityUncheckedCreateNestedManyWithoutUserInput
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommunityStoriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommunityStoriesInput, UserUncheckedCreateWithoutCommunityStoriesInput>
  }

  export type UserUpsertWithoutCommunityStoriesInput = {
    update: XOR<UserUpdateWithoutCommunityStoriesInput, UserUncheckedUpdateWithoutCommunityStoriesInput>
    create: XOR<UserCreateWithoutCommunityStoriesInput, UserUncheckedCreateWithoutCommunityStoriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommunityStoriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommunityStoriesInput, UserUncheckedUpdateWithoutCommunityStoriesInput>
  }

  export type UserUpdateWithoutCommunityStoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommunityStoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUncheckedUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUncheckedUpdateManyWithoutUserNestedInput
    userProgress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectMapCreateWithoutProjectInput = {
    id?: string
    latitude: number
    longitude: number
    address?: string | null
    city: string
    state: string
    country: string
    markerColor?: string
    markerIcon?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMapUncheckedCreateWithoutProjectInput = {
    id?: string
    latitude: number
    longitude: number
    address?: string | null
    city: string
    state: string
    country: string
    markerColor?: string
    markerIcon?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMapCreateOrConnectWithoutProjectInput = {
    where: ProjectMapWhereUniqueInput
    create: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
  }

  export type ProjectMapUpsertWithoutProjectInput = {
    update: XOR<ProjectMapUpdateWithoutProjectInput, ProjectMapUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectMapCreateWithoutProjectInput, ProjectMapUncheckedCreateWithoutProjectInput>
    where?: ProjectMapWhereInput
  }

  export type ProjectMapUpdateToOneWithWhereWithoutProjectInput = {
    where?: ProjectMapWhereInput
    data: XOR<ProjectMapUpdateWithoutProjectInput, ProjectMapUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectMapUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMapUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    markerColor?: StringFieldUpdateOperationsInput | string
    markerIcon?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialProjectCreateWithoutMapInput = {
    id?: string
    slug: string
    name: string
    description: string
    longDescription?: string | null
    fundingGoal: number
    currentFunding?: number
    currency?: string
    walletAddress?: string | null
    category: $Enums.ProjectCategory
    location?: string | null
    tags?: string | null
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    supporters?: number
    views?: number
    coverImage?: string | null
    gallery?: string | null
    organizer: string
    organizerEmail?: string | null
    organizerPhone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialProjectUncheckedCreateWithoutMapInput = {
    id?: string
    slug: string
    name: string
    description: string
    longDescription?: string | null
    fundingGoal: number
    currentFunding?: number
    currency?: string
    walletAddress?: string | null
    category: $Enums.ProjectCategory
    location?: string | null
    tags?: string | null
    verified?: boolean
    active?: boolean
    featured?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    supporters?: number
    views?: number
    coverImage?: string | null
    gallery?: string | null
    organizer: string
    organizerEmail?: string | null
    organizerPhone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialProjectCreateOrConnectWithoutMapInput = {
    where: SocialProjectWhereUniqueInput
    create: XOR<SocialProjectCreateWithoutMapInput, SocialProjectUncheckedCreateWithoutMapInput>
  }

  export type SocialProjectUpsertWithoutMapInput = {
    update: XOR<SocialProjectUpdateWithoutMapInput, SocialProjectUncheckedUpdateWithoutMapInput>
    create: XOR<SocialProjectCreateWithoutMapInput, SocialProjectUncheckedCreateWithoutMapInput>
    where?: SocialProjectWhereInput
  }

  export type SocialProjectUpdateToOneWithWhereWithoutMapInput = {
    where?: SocialProjectWhereInput
    data: XOR<SocialProjectUpdateWithoutMapInput, SocialProjectUncheckedUpdateWithoutMapInput>
  }

  export type SocialProjectUpdateWithoutMapInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialProjectUncheckedUpdateWithoutMapInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    longDescription?: NullableStringFieldUpdateOperationsInput | string | null
    fundingGoal?: FloatFieldUpdateOperationsInput | number
    currentFunding?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProjectCategoryFieldUpdateOperationsInput | $Enums.ProjectCategory
    location?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    verified?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    supporters?: IntFieldUpdateOperationsInput | number
    views?: IntFieldUpdateOperationsInput | number
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    gallery?: NullableStringFieldUpdateOperationsInput | string | null
    organizer?: StringFieldUpdateOperationsInput | string
    organizerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    organizerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutUserProgressInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserProgressInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    clerkId?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    points?: number
    badges?: string | null
    articles?: ArticleUncheckedCreateNestedManyWithoutAuthorInput
    copilotActivities?: CopilotActivityUncheckedCreateNestedManyWithoutUserInput
    communityStories?: CommunityStoryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserProgressInput, UserUncheckedCreateWithoutUserProgressInput>
  }

  export type UserUpsertWithoutUserProgressInput = {
    update: XOR<UserUpdateWithoutUserProgressInput, UserUncheckedUpdateWithoutUserProgressInput>
    create: XOR<UserCreateWithoutUserProgressInput, UserUncheckedCreateWithoutUserProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserProgressInput, UserUncheckedUpdateWithoutUserProgressInput>
  }

  export type UserUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    points?: IntFieldUpdateOperationsInput | number
    badges?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUncheckedUpdateManyWithoutAuthorNestedInput
    copilotActivities?: CopilotActivityUncheckedUpdateManyWithoutUserNestedInput
    communityStories?: CommunityStoryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ArticleCreateManyAuthorInput = {
    id?: string
    title: string
    slug: string
    content: string
    type?: string
    excerpt?: string | null
    published?: boolean
    category: string
    tags: string
    sentiment?: $Enums.Sentiment
    factCheckScore?: number | null
    factCheckSources?: string | null
    factCheckDate?: Date | string | null
    factCheckStatus?: string | null
    factCheckClicks?: number
    level?: string | null
    contentType?: string | null
    readTime?: string | null
    warningLevel?: $Enums.WarningLevel | null
    securityTips?: string | null
    courseSequence?: number | null
    relatedArticles?: string | null
    projectHighlight?: boolean
    coverImage?: string | null
    coverImageAlt?: string | null
    quizData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CopilotActivityCreateManyUserInput = {
    id?: string
    action: string
    parameters: string
    result?: string | null
    status: string
    requiresConfirmation?: boolean
    confirmed?: boolean
    confirmedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CommunityStoryCreateManyUserInput = {
    id?: string
    slug: string
    authorName: string
    authorAvatar?: string | null
    title: string
    content: string
    category: $Enums.StoryCategory
    likes?: number
    verified?: boolean
    featured?: boolean
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProgressCreateManyUserInput = {
    id?: string
    articleSlug: string
    completed?: boolean
    progress?: number
    quizScore?: number | null
    quizAttempts?: number
    certificateIssued?: boolean
    certificateUrl?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    lastAccessed?: Date | string
  }

  export type ArticleUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    citations?: CitationUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    citations?: CitationUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    excerpt?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    sentiment?: EnumSentimentFieldUpdateOperationsInput | $Enums.Sentiment
    factCheckScore?: NullableFloatFieldUpdateOperationsInput | number | null
    factCheckSources?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    factCheckStatus?: NullableStringFieldUpdateOperationsInput | string | null
    factCheckClicks?: IntFieldUpdateOperationsInput | number
    level?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    readTime?: NullableStringFieldUpdateOperationsInput | string | null
    warningLevel?: NullableEnumWarningLevelFieldUpdateOperationsInput | $Enums.WarningLevel | null
    securityTips?: NullableStringFieldUpdateOperationsInput | string | null
    courseSequence?: NullableIntFieldUpdateOperationsInput | number | null
    relatedArticles?: NullableStringFieldUpdateOperationsInput | string | null
    projectHighlight?: BoolFieldUpdateOperationsInput | boolean
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageAlt?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CopilotActivityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    result?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityStoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    authorAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: EnumStoryCategoryFieldUpdateOperationsInput | $Enums.StoryCategory
    likes?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    featured?: BoolFieldUpdateOperationsInput | boolean
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleSlug?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    quizScore?: NullableFloatFieldUpdateOperationsInput | number | null
    quizAttempts?: IntFieldUpdateOperationsInput | number
    certificateIssued?: BoolFieldUpdateOperationsInput | boolean
    certificateUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationCreateManyArticleInput = {
    id?: string
    url: string
    title?: string | null
    domain?: string | null
    order?: number
    verified?: boolean
    createdAt?: Date | string
  }

  export type CitationUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitationUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    verified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}