const dns = require("dns");

async function boot() {
  const servers = dns.getServers();

  console.log({ servers });
//   await dns.promises.setServers(["172.29.0.100", "172.29.2.100"]);
}
// dns.setServers(["172.29.0.100", "172.29.2.100"]);
boot()