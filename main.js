#! /usr/bin/env node

"use strict";

const { exec } = require("child_process");

const dnsOptions = [
  {
    name: "shecan",
    ips: ["178.22.122.100", "185.51.200.2"],
    address: "https://shecan.ir/",
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
    name: "403",
    ips: ["10.202.10.202", "10.202.10.102"],
    address: "https://403.online/",
  },
  {
    name: "asiatech",
    ips: ["194.36.174.161"],
    address: "https://asiatech.cloud/",
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
  { name: "dns [-a|change]", desc: "Set Random Dns" },
  { name: "dns [-r|rm|remove|clear]", desc: "Remove DNS" },
  { name: "dns [-c|crt|current]", desc: "Show Current DNS" },
  { name: "dns [-l|ls|list]", desc: "List DNS Options" },
  { name: "dns [-h|help]", desc: "List Commands" },
];

async function bootstrap() {
  const args = process.argv.slice(2);

  const commandsHandlers = await getCommands();

  if (/(-s)|(set)/.test(args[0])) {
    commandsHandlers.setDns(args);
    return;
  }

  if (/(-a)|(change)/.test(args[0])) {
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

async function getOsType() {
  return execute("echo $OSTYPE");
}

//#endregion

//#region commands

async function getCommands() {
  const osType = await getOsType();
  const isMac = osType.includes("darwin");
  const isLinux = osType.includes("linux-gnu");

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
        (prev, current) => `${prev}nameserver ${current}\n`,
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
        (prev, current) => `${prev}nameserver ${current}\n`,
        ""
      );

      await execute(`echo "${ipString}" > /etc/resolv.conf`);
    }

    message(`DNS Set [${option.name}]`);
  }

  async function removeDns() {
    if (isMac) await execute('networksetup -setdnsservers Wi-Fi "empty"');

    if (isLinux)
      await execute(
        `echo -e "nameserver 8.8.8.8\nnameserver 8.8.4.4" > /etc/resolv.conf`
      );

    message("DNS Removed");
  }

  async function currentDns() {
    let currentDns = "";

    if (isMac) currentDns = await execute("networksetup -getdnsservers Wi-Fi");

    if (isLinux) currentDns = await execute("cat /etc/resolv.conf");

    const currentDnsName = dnsOptions.find((opt) =>
      opt.ips.find((ip) => currentDns.includes(ip))
    )?.name;

    if (currentDnsName) message(`Current DNS [${currentDnsName}]`);
    else message("Current DNS None");

    return currentDnsName;
  }

  function help() {
    message("Commands:");
    console.table(commands);
  }

  function list() {
    console.table(dnsOptions);
  }

  return { help, list, setDns, removeDns, currentDns, changeDns };
}
//#endregion

bootstrap();
