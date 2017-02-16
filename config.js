var config = {
    user: process.env.USER || 'sasql',
    password: process.env.PASSWORD || '#Lockbox45!',
    server: process.env.SERVER || 'DEVSQL1',
    database: process.env.DATABASE || 'ts',
    options: {
        instanceName: process.env.OPTIONS_INSTANCE_NAME || 'trunk',
        connectTimeout: process.env.OPTIONS_CONNECT_TIMEOUT || 3000
    }
}

module.exports = config;