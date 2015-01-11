#!/bin/bash

### USAGE ###
# ./release.sh --linux 0.2.6b

# Exit on error
set -e

BUILD_DIR=`pwd`
WORKING_DIR="${BUILD_DIR}/TMP"
PROJECT_DIR=`dirname ${BUILD_DIR}`
VERSION="${1}"


if [[ ! -f "${WORKING_DIR}" ]]; then
    mkdir -p TMP
fi

cd TMP

architechture="ia32 x64"

usage() {
    printf "\n--- Gisto release script ----------------------------\n\n"
    printf "\tBuild installers for Windows, Linux and OSX\n"
    printf "\n--- DEPENDENCIES ------------------------------------\n\n"
    printf "\tCMAKE (used formaking libdmg-hfsplus from source)\n"
    printf "\tNSIS (for windows installer creation)\n"
    printf "\n--- USAGE -------------------------------------------\n\n"
    printf "\tBuilding: \n\t$ ./release.sh --all [--linux|--osx|--windows|--all] 0.2.6b\n"
    printf "\tCleaning: \n\t$ ./release.sh --clean\n"
    printf "\tHelp: \n\t$ ./release.sh --help"
    printf "\n-----------------------------------------------------\n"
}

check_dependencies() {
    # Check if CMAKE is present
    if [[ "`cmake --version`" =~ "cmake version" && "`makensis`" =~ "MakeNSIS" ]]; then
        echo 'OK';
    else
        echo 'NO';
    fi
}

if [[ `check_dependencies` = "NO" ]]; then
    printf "\nNOTE! CMAKE and/or NSIS is missing in the system\n\n";
    exit 1;
fi

mklinux () {
    for arch in ${architechture[@]}; do
        cp -r ${BUILD_DIR}/resources/linux/Gisto-X.X.X-Linux ${WORKING_DIR} && mv ${WORKING_DIR}/Gisto-X.X.X-Linux ${WORKING_DIR}/Gisto-${1}-linux_${arch}
        mv -T ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/gisto ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/gisto-bin
        cp -r ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/* ${WORKING_DIR}/Gisto-${1}-linux_${arch}/gisto
        tar -C ${WORKING_DIR} -czf ${WORKING_DIR}/Gisto-${1}-Linux-${arch}.tar.gz Gisto-${1}-linux_${arch}
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
        ${WORKING_DIR}/libdmg-hfsplus/dmg/dmg dmg ${WORKING_DIR}/gisto-${1}-${arch}-uncompressed.dmg ${WORKING_DIR}/Gisto-${1}-OSX-${arch}.dmg
        printf "\nDone OSX ${arch}\n"
    done
    rm -rf ${WORKING_DIR}/libdmg-hfsplus ${WORKING_DIR}/gisto-${1}-{x64,ia32}-uncompressed.dmg;
}

mkwindows() {
    for arch in ${architechture[@]}; do
        # NOTE need to 
        # - see how to compile nsis bins here upon release
        # - remove locals folder
        # - see how to separate x64 and ia32 in installer
        cd ${WORKING_DIR}
        cp -r ${BUILD_DIR}/resources/windows/gisto.nsi ${WORKING_DIR}
        cp -r ${PROJECT_DIR}/app/icon.ico ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/
        # Replce paths and vars in nsi script
        replace \
            GISTO_REPLACE_VERSION ${1} \
            GISTO_REPLACE_EXE_NAME Gisto-${1}-Windows-${arch}.exe \
            GISTO_REPLACE_LICENSE ${PROJECT_DIR}/LICENSE \
            GISTO_REPLACE_INC_FILE_1 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/gisto.exe \
            GISTO_REPLACE_INC_FILE_2 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/icudtl.dat \
            GISTO_REPLACE_INC_FILE_3 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/libEGL.dll \
            GISTO_REPLACE_INC_FILE_4 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/libGLESv2.dll \
            GISTO_REPLACE_INC_FILE_5 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/nw.pak \
            GISTO_REPLACE_INC_FILE_6 ${BUILD_DIR}/script/TMP/win-${arch}/latest-git/d3dcompiler_46.dll \
            GISTO_REPLACE_INC_FILE_ICO ${PROJECT_DIR}/app/icon.ico -- gisto.nsi;
        makensis gisto.nsi
        # Clean a bit
        rm -rf ${WORKING_DIR}/gisto.nsi;
        printf "\nDone Windows ${arch}\n"
    done
}

prepare() {
    cd ${PROJECT_DIR}
    gulp version_bump --to=${1}
    gulp dist && gulp dev
    build/script/node-webkit-build.sh \
        --src=${PROJECT_DIR}/dist \
        --name=gisto \
        --nw=0.11.5 \
        --win-icon=${PROJECT_DIR}/app/icon.ico \
        --osx-icon=${PROJECT_DIR}/build/resources/osx/gisto.icns \
        --osx-plist=${PROJECT_DIR}/build/resources/osx/Info.plist \
        --build
    cd ${BUILD_DIR}
}

if [[ ${1} = "--help" || ${1} = "-h" ]]; then
    usage;
fi

if [[ ${1} = "--clean" ]]; then
    rm -rf ${WORKING_DIR}
    rm -rf ${PROJECT_DIR}/build/script/TMP
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
