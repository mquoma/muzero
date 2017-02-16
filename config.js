var config = {
    user: process.env.USER || '',
    password: process.env.PASSWORD || '',
    server: process.env.SERVER || '',
    database: process.env.DATABASE || '',
    options: {
        instanceName: process.env.OPTIONS_INSTANCE_NAME || 'trunk',
        connectTimeout: process.env.OPTIONS_CONNECT_TIMEOUT || 3000
    }
}

module.exports = config;
