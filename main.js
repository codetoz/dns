#! /usr/bin/env node

"use strict";
var { version: packageVersion } = require("./package.json");

var { platform } = require("os");
const { exec } = require("child_process");

const dnsOptions = [
  {
    name: "shecan",
    ips: ["178.22.122.100", "185.51.200.2"],
    address: "https://shecan.ir/",
  },
  {
    name: "403",
    ips: ["10.202.10.202", "10.202.10.102"],
    address: "https://403.online/",
  },
  {
    name: "server",
    ips: ["194.104.158.48", "194.104.158.78"],
    address: "https://server.ir",
  },
  {
    name: "hostiran",
    ips: ["172.29.0.100", "172.29.2.100"],
    address: "https://hostiran.net/landing/proxy",
  },
  {
    name: "begzar",
    ips: ["185.55.226.26", "185.55.225.25"],
    address: "https://begzar.ir/",
  },
  {
    name: "electro",
    ips: ["78.157.42.100", "78.157.42.101"],
    address: "https://electrotm.org/",
  },
  {
    name: "radar",
    ips: ["10.202.10.10", "10.202.10.11"],
    address: "https://radar.game/#/dns",
  },
  {
    name: "asiatech",
    ips: ["194.36.174.161", "178.22.122.100"],
    address: "https://asiatech.cloud/",
  },
  {
    name: "asrenovin",
    ips: ["46.224.1.42", "178.22.122.100"],
    address: "",
  },
  {
    name: "tums",
    ips: ["194.225.62.80", "178.22.122.100"],
    address: "",
  },
  {
    name: "pishgaman",
    ips: ["5.202.100.101", "178.22.122.100"],
    address: "",
  },
  {
    name: "parsonline",
    ips: ["91.99.101.12", "178.22.122.100"],
    address: "",
  },
  {
    name: "cloud",
    ips: ["1.1.1.1", "1.0.0.1"],
    address: "https://www.cloudflare.com/",
  },
  {
    name: "google",
    ips: ["8.8.8.8", "8.8.4.4"],
    address: "https://google.com",
  },
];

const commands = [
  { name: "dns [-s|set] <dns-name>", desc: "Set Chosen DNS" },
  { name: "dns [-alt|alter|change]", desc: "Set Random Dns" },
  { name: "dns [-r|rm|remove|clear]", desc: "Remove DNS" },
  { name: "dns [-c|crt|current]", desc: "Show Current DNS" },
  { name: "dns [-l|ls|list]", desc: "List DNS Options" },
  { name: "dns [-v|--version|version]", desc: "Package Version" },
  { name: "dns [-h|help]", desc: "List Commands" },
];

async function bootstrap() {
  const args = process.argv.slice(2);

  const commandsHandlers = await getCommands();

  if (/(-s)|(set)/.test(args[0])) {
    commandsHandlers.setDns(args);
    return;
  }

  if (/(-a)|(alter)|(change)/.test(args[0])) {
    commandsHandlers.changeDns();
    return;
  }

  if (/(-r)|(rm)|(remove)|(clear)/.test(args[0])) {
    commandsHandlers.removeDns();
    return;
  }

  if (/(-c)|(crt)|(current)/.test(args[0])) {
    commandsHandlers.currentDns();
    return;
  }

  if (/(-l)|(ls)|(list)/.test(args[0])) {
    commandsHandlers.list();
    return;
  }

  if (/(-v)|(--version)|(version)/.test(args[0])) {
    commandsHandlers.version();
    return;
  }

  if (/()|(-h)|(help)/.test(args[0])) {
    commandsHandlers.help();
    return;
  }
}

//#region helpers
function message(...message) {
  const prefix = "🥷";

  console.log(prefix, ...message);
}

function getRandomOption(list, exclude) {
  const filtered = list.filter((option) => !exclude.includes(option.name));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

async function execute(command) {
  return new Promise(function (resolve) {
    exec(command, (err, stdout) => {
      resolve(stdout);
      if (err) {
        message(`exec error: ${err}\n`, "command: ", command);
      }
    });
  });
}

async function getPlatform() {
  return platform();
}

//#endregion

//#region commands

async function getCommands() {
  const osType = await getPlatform();
  const isMac = osType.includes("darwin");
  const isLinux = osType.includes("linux");

  async function setDns(args) {
    if (args.length < 2) {
      message("Provide a DNS name from list of options\n");
      list();
      return;
    }

    const option = dnsOptions.find((opt) => opt.name === args[1]);

    if (!option) {
      message("Provide a valid DNS name\n");
      list();
      return;
    }

    if (isMac) {
      const ipString = option.ips.reduce(
        (prev, current) => `${prev}${current} `,
        ""
      );

      await execute(`networksetup -setdnsservers Wi-Fi ${ipString}`);
    }

    if (isLinux) {
      const ipString = option.ips.reduce(
        (prev, current) => `${prev}\nnameserver ${current}`,
        ""
      );

      await execute(`echo "${ipString}" > /etc/resolv.conf`);
    }

    message(`DNS Set [${option.name}]`);
  }

  async function changeDns() {
    const currentDnsName = await currentDns();
    const option = getRandomOption(dnsOptions, [currentDnsName, "google"]);

    if (isMac) {
      const ipString = option.ips.reduce(
        (prev, current) => `${prev}${current} `,
        ""
      );

      await execute(`networksetup -setdnsservers Wi-Fi ${ipString}`);
    }

    if (isLinux) {
      const ipString = option.ips.reduce(
        (prev, current) => `${prev}\nnameserver ${current}`,
        ""
      );

      await execute(`echo "${ipString}" > /etc/resolv.conf`);
    }

    message(`DNS Set [${option.name}]`);
  }

  async function removeDns() {
    if (isMac) await execute('networksetup -setdnsservers Wi-Fi "empty"');

    if (isLinux) {
      const ipString = "nameserver 8.8.8.8\nnameserver 8.8.4.4";

      await execute(`echo "${ipString}" > /etc/resolv.conf`);
    }

    message("DNS Removed");
  }

  async function currentDns() {
    let currentDns = "";
    let currentDnsName = "";

    if (isMac) currentDns = await execute("networksetup -getdnsservers Wi-Fi");

    if (isLinux) currentDns = await execute("cat /etc/resolv.conf");

    const ipPattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;

    let ips = ipPattern.exec(currentDns);
    if (ips !== null && ips.length > 1) {
      currentDnsName = dnsOptions.find((opt) =>
        opt.ips.find((optionIp) => optionIp === ips[0])
      )?.name;

      if (currentDnsName) message(`Current DNS: [${currentDnsName}]`);
      else message("Current DNS: No DNS");
    } else message("Current DNS: No DNS");

    return currentDnsName;
  }

  function version() {
    message(`Package Version: ${packageVersion}`);
  }

  function help() {
    message("Commands:");
    console.table(commands);
  }

  function list() {
    console.table(dnsOptions);
  }

  return {
    help,
    list,
    setDns,
    removeDns,
    currentDns,
    changeDns,
    version,
  };
}
//#endregion

bootstrap();
