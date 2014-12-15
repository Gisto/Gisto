#!/bin/bash

### USAGE ###
# ../release.sh --linux 0.2.6b

# Exit on error
set -e

BUILD_DIR=`pwd`
WORKING_DIR="${BUILD_DIR}/TMP"
PROJECT_DIR=`dirname ${BUILD_DIR}`

if [[ ! -f "${WORKING_DIR}" ]]; then
    mkdir -p TMP
fi

cd TMP

architechture="x64 ia32"

mklinux () {
    for arch in ${architechture[@]}; do
        cp -r ${BUILD_DIR}/resources/linux/Gisto-X.X.X-Linux ${WORKING_DIR} && mv ${WORKING_DIR}/Gisto-X.X.X-Linux ${WORKING_DIR}/Gisto-${1}-linux_${arch}
        mv ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/gisto ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/gisto-bin
        cp -r ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/* ${WORKING_DIR}/Gisto-${1}-linux_${arch}/gisto
        tar -C ${WORKING_DIR} -czf ${WORKING_DIR}/Gisto-${1}-linux_${arch}.tar.gz Gisto-${1}-linux_${arch}
        printf "\nDone Linux ${arch}\n"
    done
    # clean
    rm -rf ${WORKING_DIR}/Gisto-${1}-linux_{x64,ia32}
}

mkosx () {
    for arch in ${architechture[@]}; do
        if [[ ! -d "${WORKING_DIR}/libdmg-hfsplus" ]]; then
            git clone --depth 1 https://github.com/erwint/libdmg-hfsplus ${WORKING_DIR}/libdmg-hfsplus
            cd ${WORKING_DIR}/libdmg-hfsplus && cmake . && make
        fi
        cd ${BUILD_DIR}
        ln -s /Applications Applications && mv Applications ${BUILD_DIR}/script/TMP/osx-${arch}/latest-git
        cp -r ${BUILD_DIR}/resources/osx/.background ${BUILD_DIR}/resources/osx/.DS_Store ${BUILD_DIR}/script/TMP/osx-${arch}/latest-git
        genisoimage -D -V "Gisto ${1}" -no-pad -r -apple -o ${WORKING_DIR}/gisto-${1}-${arch}-uncompressed.dmg ${BUILD_DIR}/script/TMP/osx-${arch}/latest-git
        ${WORKING_DIR}/libdmg-hfsplus/dmg/dmg dmg ${WORKING_DIR}/gisto-${1}-${arch}-uncompressed.dmg ${WORKING_DIR}/gisto-${1}-OSX-${arch}.dmg
        printf "\nDone OSX ${arch}\n"
    done
    rm -rf ${WORKING_DIR}/libdmg-hfsplus ${WORKING_DIR}/gisto-${1}-{x64,ia32}-uncompressed.dmg;
}

mkwindows() {
    for arch in ${architechture[@]}; do
        if [[ ! -d "${WORKING_DIR}/installjammer" ]]; then
            git clone https://github.com/damoncourtney/installjammer.git
            cd installjammer
            git checkout v1.2.14
        fi
        cd ${WORKING_DIR}
        ./installjammer/installjammer -DAppName Gisto --quick-build --platform Windows --build win_gisto.mpi
    done
}

prepare() {
    cd ${PROJECT_DIR}
    gulp version_bump --to=${1}
    gulp dist && gulp dev
    cd ${BUILD_DIR}/script
    ./node-webkit-build.sh --build
    cd ${BUILD_DIR}
}

if [[ ${1} = "--clean" ]]; then
    rm -rfv ${WORKING_DIR}
fi

if [[ ${1} = "--linux" ]]; then
    prepare ${2};
    mklinux ${2};
fi

if [[ ${1} = "--osx" ]]; then
    prepare ${2};
    mkosx ${2};
fi

if [[ ${1} = "--windows" ]]; then
    prepare ${2};
    mkwindows ${2};
fi

if [[ ${1} = "--all" ]]; then
    prepare ${2};
    mkosx ${2};
    mklinux ${2};
    mkwindows ${2};
fi
