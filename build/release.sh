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
clear && cat <<EOF

NAME

    Gisto release script

DESCRIPTION

    Build installers for Windows, Linux and OSX

DEPENDENCIES

    CMAKE
        used formaking libdmg-hfsplus from source
    NSIS
        for windows installer creation
    genisoimage (cdrkit)
        for OSX installer creation
    dpkg
        for Debian package creation

USAGE
    Building:
            $ ./release.sh --all [--linux|--osx|--windows|--all] 0.2.6b
    Cleaning:
            $ ./release.sh --clean
    Help:
            $ ./release.sh --help

EOF
}

check_dependencies() {
    # Check if CMAKE is present
    if [[ "`cmake --version`" =~ "cmake version" && "`makensis`" =~ "MakeNSIS" ]]; then
        echo 'OK';
    else
        echo 'NO';
    fi
}


mklinux () {
    for arch in ${architechture[@]}; do
        cp -r ${BUILD_DIR}/resources/linux/Gisto-X.X.X-Linux ${WORKING_DIR}/Gisto-${1}-linux_${arch}
        cp -r ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/* ${WORKING_DIR}/Gisto-${1}-linux_${arch}/gisto
        tar -C ${WORKING_DIR} -czf ${WORKING_DIR}/Gisto-${1}-Linux-${arch}.tar.gz Gisto-${1}-linux_${arch}
        printf "\nDone Linux ${arch}\n"
        # DEB
        local GISTO_DEB_NAME="gisto_${1}-1_${arch}";
        cp -r ${BUILD_DIR}/resources/linux/Gisto-X.X.X-Linux ${WORKING_DIR}/${GISTO_DEB_NAME}
        cp -r ${BUILD_DIR}/resources/DEBIAN ${WORKING_DIR}/${GISTO_DEB_NAME}
        mkdir -p ${WORKING_DIR}/${GISTO_DEB_NAME}/{opt,usr/bin}
        mv ${WORKING_DIR}/${GISTO_DEB_NAME}/gisto ${WORKING_DIR}/${GISTO_DEB_NAME}/opt
        mv ${WORKING_DIR}/${GISTO_DEB_NAME}/share ${WORKING_DIR}/${GISTO_DEB_NAME}/usr
        ln -s /opt/gisto/gisto ${WORKING_DIR}/${GISTO_DEB_NAME}/usr/bin/gisto
        cp -r ${BUILD_DIR}/script/TMP/linux-${arch}/latest-git/* ${WORKING_DIR}/${GISTO_DEB_NAME}/opt/gisto
        rm ${WORKING_DIR}/${GISTO_DEB_NAME}/{setup,README}
        replace GISTO_REPLACE_VERSION ${1} -- ${WORKING_DIR}/${GISTO_DEB_NAME}/DEBIAN/control;
        dpkg-deb -b ${WORKING_DIR}/${GISTO_DEB_NAME}
        rm -rf ${WORKING_DIR}/${GISTO_DEB_NAME}
        printf "\nDone Debian .deb ${arch}\n"
    done
    # clean
    rm -rf ${WORKING_DIR}/Gisto-${1}-linux_{x64,ia32}
    printf "\nClened\n"
}

mkosx () {
    if [[ `check_dependencies` = "NO" ]]; then
        printf "\nNOTE! CMAKE and/or NSIS is missing in the system\n\n";
        exit 1;
    fi
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
    if [[ `check_dependencies` = "NO" ]]; then
        printf "\nNOTE! CMAKE and/or NSIS is missing in the system\n\n";
        exit 1;
    fi
    for arch in ${architechture[@]}; do
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
    build/script/nwjs-build.sh \
        --src=${PROJECT_DIR}/dist \
        --name=gisto \
        --nw=0.11.6 \
        --win-icon=${PROJECT_DIR}/app/icon.ico \
        --osx-icon=${PROJECT_DIR}/build/resources/osx/gisto.icns \
        --osx-plist=${PROJECT_DIR}/build/resources/osx/Info.plist \
        --target="${2}" \
        --libudev \
        --build
    cd ${BUILD_DIR}
}

if [[ ${1} != "--clean" && ${2} = "" ]];then
    printf "\nVersion is requered 2nd parameter\n"
elif [[ ${1} = "--help" || ${1} = "-h" ]]; then
    usage;
elif [[ ${1} = "--clean" ]]; then
    rm -rf ${WORKING_DIR}
    rm -rf ${PROJECT_DIR}/build/script/TMP
elif [[ ${1} = "--linux" ]]; then
    prepare ${2} "0 1";
    mklinux ${2};
elif [[ ${1} = "--osx" ]]; then
    prepare ${2} "4 5";
    mkosx ${2};
elif [[ ${1} = "--windows" ]]; then
    prepare ${2} "2 3";
    mkwindows ${2};
elif [[ ${1} = "--all" ]]; then
    prepare ${2} "0 1 2 3 4 5";
    mkosx ${2};
    mklinux ${2};
    mkwindows ${2};
else
    usage;
fi