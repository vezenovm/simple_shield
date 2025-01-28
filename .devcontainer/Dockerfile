FROM mcr.microsoft.com/devcontainers/typescript-node:18
SHELL ["/bin/bash", "-c"]
RUN apt update && apt install -y curl tar gzip libc++-dev unzip

# For simplicity's sake we install a compatible version of bb.
ENV BB_HOME="/bb"
RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/cpp/installation/install | bash
RUN $BB_HOME/bbup -v 0.66.0
ENV PATH="$BB_HOME:$PATH"

