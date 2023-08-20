function dns {
    if [[ $1 == "shecan" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 178.22.122.100
nameserver 185.51.200.2" > /etc/resolv.conf
        echo "[Shecan] dns has been set accrodingly"

    elif [[ $1 == "begzar" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 185.55.226.26
nameserver 185.55.225.25" > /etc/resolv.conf
        echo "[Begzar] dns has been set accrodingly"

    elif [[ $1 == "radar" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 10.202.10.10
nameserver 10.202.10.11" > /etc/resolv.conf
        echo "[Radar game] dns has been set accrodingly"

    elif [[ $1 == "electro" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 78.157.42.100
nameserver 78.157.42.101" > /etc/resolv.conf
        echo "[Electro Team] dns has been set accrodingly"

    elif [[ $1 == "403" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 10.202.10.202
nameserver 10.202.10.102" > /etc/resolv.conf
        echo "[403.online] dns has been set accrodingly"

    elif [[ $1 == "asia" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 194.36.174.161
nameserver 178.22.122.100" > /etc/resolv.conf
        echo "[asiatech] dns has been set accrodingly"

    elif [[ $1 == "cloud" ]]
    then
        rm -r /etc/resolv.conf
        echo "nameserver 1.1.1.1
nameserver 1.0.0.1" > /etc/resolv.conf
        echo "[Cloudflare] dns has been set accrodingly"

    elif [[ $1 == "list" || $1 == "ls" ]]
    then
        echo "shecan
radar
electro
begzar
403
asia
cloudflare"

    elif [[ $1 == "remove" || $1 == "rm" ]]
    then
        echo "nameserver 8.8.8.8
nameserver 8.8.4.4" > /etc/resolv.conf

    else
        cat /etc/resolv.conf

    fi
}
