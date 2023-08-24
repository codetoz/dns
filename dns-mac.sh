#!/bin/bash

if [[ $1 == "shecan" ]]
then
    networksetup -setdnsservers Wi-Fi  178.22.122.100 185.51.200.2
    echo "[Shecan] dns has been set accrodingly"
elif [[ $1 == "radar" ]]
then
    networksetup -setdnsservers Wi-Fi  10.202.10.10 10.202.10.11
    echo "[Radar game] dns has been set accrodingly"
elif [[ $1 == "electro" ]]
then
    networksetup -setdnsservers Wi-Fi  78.157.42.100 78.157.42.101
    echo "[Electro Team] dns has been set accrodingly"
elif [[ $1 == "begzar" ]]
then
    networksetup -setdnsservers Wi-Fi  185.55.226.26 185.55.225.25
    echo "[Begzar] dns has been set accrodingly"
elif [[ $1 == "403" ]]
then
    networksetup -setdnsservers Wi-Fi  10.202.10.202 10.202.10.102
    echo "[403.online] dns has been set accrodingly"
elif [[ $1 == "asia" ]]
then
    networksetup -setdnsservers Wi-Fi  194.36.174.161 178.22.122.100
    echo "[asiatech] dns has been set accrodingly"
elif [[ $1 == "cloud" ]]
then
    networksetup -setdnsservers Wi-Fi  1.1.1.1 1.0.0.1
    echo "[Cloudflare] dns has been set accrodingly"
elif [[ $1 == "rm" ]] || [[ $1 == "remove" ]] || [[ $1 == "clear" ]]
then
    networksetup -setdnsservers Wi-Fi  "empty"
    echo "dns has been removed."
elif [[ $1 == "list" || $1 == "ls" ]]
then echo "shecan radar electro begzar 403 asia cloud"

elif [[ $(networksetup -getdnsservers Wi-Fi) == '178.22.122.100
185.51.200.2' ]]
then echo "[Shecan]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "10.202.10.10
10.202.10.11" ]]
then echo "[Radar game]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "78.157.42.100
78.157.42.101" ]]
then echo "[Electro Team]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "10.202.10.202
10.202.10.102" ]]
then echo "[403.online]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "194.36.174.161
178.22.122.100" ]]
then echo "[Asiatech]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "1.1.1.1
1.0.0.1" ]]
then echo "[Cloudflare]"

elif [[ $(networksetup -getdnsservers Wi-Fi) == "185.55.226.26
185.55.225.25" ]]
then echo "[Begzar]"

fi
