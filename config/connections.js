/**
 * Connections API Configuration
 *
 * Connections are like "saved settings" for your adapters.
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 *
 * NOTE: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 */

module.exports.connections = {
  /**
   * PostgreSQL configuration
   * @type {Object}
   */
  postgresql: {
    adapter: 'sails-postgresql',
    database: "mailmonitor",
    host: "localhost",
    user: "username",
    password: "password",
    port: 5432,
    pool: false,
    ssl: false
  },

  /**
   * MySQL configuration
   * @type {Object}
   */
  mysql: {
    adapter: 'sails-mysql',
    host: "localhost",
    port: 3306,
    user: "username",
    password: "password",
    database: "mailmonitor",
    charset: 'utf8',
    collation: 'utf8_swedish_ci'
  },

  /**
   * MongoDB configuration
   * @type {Object}
   */
  mongo: {
    adapter: 'sails-mongo',
    host: "localhost",
    port: 27017,
    //user: "username",
    //password: "password",
    database: "mailmonitor"
  },

  /**
   * Memory configuration
   * ONLY FOR DEVELOPMENT
   * @type {Object}
   */
  memory: {
    adapter: 'sails-memory'
  },

  /**
   * Disk configuration
   * ONLY FOR DEVELOPMENT
   * @type {Object}
   */
  disk: {
    adapter: 'sails-disk'
  },

  /**
   * Microsoft SQL Server configuration
   * @type {Object}
   */
  sqlserver: {
    adapter: 'sails-sqlserver',
    user: "username",
    password: "password",
    host: "localhost",
    database: "mailmonitor",
    options: {
      encrypt: false
    }
  },

  /**
   * Redis configuration
   * @type {Object}
   */
  redis: {
    adapter: 'sails-redis',
    port: 6379,
    host: "localhost",
    password: "password",
    database: "mailmonitor",
    options: {
      parser: 'hiredis',
      return_buffers: false,
      detect_buffers: false,
      socket_nodelay: true,
      no_ready_check: false,
      enable_offline_queue: true
    }
  },

  /**
   * OrientDB configuration
   * @type {Object}
   */
  orientdb: {
    adapter: 'sails-orientdb',
    host: "localhost",
    port: 2424,
    user: "username",
    password: "password",
    database: "mailmonitor",
    options: {
      databaseType: 'graph',
      storage: 'plocal',
      transport: 'binary',
      decodeURIComponent: true,
      removeCircularReferences: false,
      unsafeDrop: false,
      parameterized: true,
      fetchPlanLevel: 1
    }
  },

  /**
   * DynamoDB configuration
   * @type {Object}
   */
  dynamodb: {
    adapter: 'sails-dynamodb',
    accessKeyId: "",
    secretAccessKey: "",
    region: ""
  }
};
