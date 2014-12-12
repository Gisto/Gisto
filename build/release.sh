#!/bin/bash

### USAGE ###
# ../release.sh --linux 0.2.6b

if [[ ! -f "TMP" ]]; then
    mkdir -p TMP
fi

cd TMP

TMP=`pwd`

architechture="x64 ia32"

mklinux () {
    for arch in ${architechture[@]}; do
        cp -r ../resources/linux/Gisto-X.X.X-Linux . && mv Gisto-X.X.X-Linux Gisto-${1}-linux_${arch}
        cp -r ../script/TMP/linux-${arch}/latest-git/* Gisto-${1}-linux_${arch}/gisto
        tar czf Gisto-${1}-linux_${arch}.tar.gz Gisto-${1}-linux_${arch}
        printf "\nDone Linux ${arch}\n"
    done
    # clean
    rm -rf Gisto-${1}-linux_{x64,ia32}
}

mkosx () {
    for arch in ${architechture[@]}; do
        if [[ ! -f "libdmg-hfsplus" ]]; then
            git clone --depth 1 https://github.com/erwint/libdmg-hfsplus
            cd libdmg-hfsplus && cmake . && make
        fi
        cd ${TMP}
        genisoimage -D -V "Gisto ${1}" -no-pad -r -apple -o gisto-${1}-${arch}-uncompressed.dmg ../script/TMP/osx-${arch}/latest-git/gisto.app
        ${TMP}/libdmg-hfsplus/dmg/dmg dmg gisto-${1}-${arch}-uncompressed.dmg gisto-${1}-OSX-${arch}.dmg
        printf "\nDone OSX ${arch}\n"
    done
    rm -rf libdmg-hfsplus gisto-${1}-{x64,ia32}-uncompressed.dmg;
}

if [[ ${1} = "--linux" ]]; then
    mklinux ${2};
fi

if [[ ${1} = "--osx" ]]; then
    mkosx ${2};
fi

if [[ ${1} = "--all" ]]; then
    mkosx ${2};
    mklinux ${2};
fi