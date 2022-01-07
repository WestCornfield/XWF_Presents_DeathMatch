{ pkgs }: {
    deps = [
        pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
    ];
    env = {
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
    };
}
