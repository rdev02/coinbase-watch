module.exports = {
    apps : [{
        name: "coinbase-watch",
        script: "./index.js",
        cwd: "/var/opt/coinbase-watch",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
