const dns = require('dns').promises;

async function resolve() {
    try {
        const name = '_mongodb._tcp.cluster0.yrpm5y1.mongodb.net';
        console.log(`Resolving SRV for ${name}...`);
        const addresses = await dns.resolveSrv(name);
        console.log('SRV Addresses:', addresses);
        
        for (const addr of addresses) {
            const host = addr.name;
            console.log(`Resolving A record for ${host}...`);
            const ips = await dns.resolve4(host);
            console.log(`IPs for ${host}:`, ips);
        }
    } catch (err) {
        console.error('❌ DNS Error:', err.message);
    }
}

resolve();
