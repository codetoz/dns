# DNS

Set DNS easily

## Installation

Use npm:

```sh
sudo npm i -g @codetoz/dns
```

If you do not have nodejs or want to use executable versions:
for linux and mac

```sh
# release version
version="v1.0.0"
# macos linux
platform=macos
# x64 arm64
arch=arm64

curl -o dns https://github.com/codetoz/dns/releases/download/$version/dns-$platform-$arch
```

after that you can move it to your `bin`:

```sh
# linux
mv dns /usr/bin/

# mac
mv dns /usr/local/bin/
```

for windows download the executable file from below link and add it to your `PATH`:

`https://github.com/codetoz/dns/releases/download/v1.0.0/dns-win-x64.exe`

## Commands

- `dns [-s|set] <dns-name>` Set Chosen DNS
- `dns [-alt|alter|change]` Set Random Dns
- `dns [-r|rm|remove|clear]` Remove DNS
- `dns [-c|crt|current]` Show Current DNS
- `dns [-l|ls|list]` List DNS Options
- `dns [-v|--version|version]` Show Package Version
- `dns [ |-h|help]` List Commands
