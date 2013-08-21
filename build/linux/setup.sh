#!/bin/bash

### Check for lib

is_root() {
if [[ $EUID -ne 0 ]]; then
    echo -e "\n\n\n\e[41m  \e[0m Hi \e[1;37m$USER\e[0m, You need install \e[1;37m</Gisto>\e[0m as \e[1;37mroot\e[0m or with \e[1;37msudo\e[0m\n\e[41m\e[0m\n\n\n"
	exit 1
fi
}

greet () {
	echo -e "\n\n\n\e[44m  \e[0m Hi, This will install \e[1;37m</Gisto>\e[0m on your computer."
	echo -e "\n\n\n\e[43m  \e[0m Checking for dependencies.\n\n\n"
}

check_for_lib() {
	for i in `find /usr/lib /lib -name "libudev.so.0"`; do
		if [[ ${i} =~ "libudev.so.0" ]]; then
			LIB='yes'
		fi
	done;
}

is_root;
greet;
check_for_lib;

if [[ $LIB = 'yes' ]]; then
	echo -e "\e[42m  \e[0m It seems that all dependencies met, Install? [y/n]."
	read INST
	if [ $INST = 'y' -o $INST = 'Y' ]; then
		echo -e "\n\n\n\e[43m  \e[0m INSTALLING...\n\n\n"
		/bin/cp -rv ./gisto/bin ./gisto/share /usr
		echo -e "\n\n\n\e[42m  \e[0m Congrats! You can now find \e[1;37m</Gisto>\e[0m in your menu.\n\n\n"
	fi
else
	echo -e "\n\n\n\e[41m  \e[0m It seems you miss that \e[1;37mlibudev.so.0\e[0m library. Please read here \e[0;34mhttp://goo.gl/SsHdgs\e[0m\n\n\n"
fi