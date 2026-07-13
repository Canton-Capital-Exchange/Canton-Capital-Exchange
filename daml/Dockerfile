# Builds the CCX Daml Archive and runs it on a local Canton sandbox with the
# JSON Ledger API enabled. Party allocation and Lender cash seeding are NOT
# done here -- the frontend resolves/allocates parties itself on boot (see
# frontend/src/ledger/bootstrap.ts), so this image only needs to run the
# ledger.

FROM eclipse-temurin:21-jdk-jammy AS daml-build

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://get.digitalasset.com/install/install.sh | sh
ENV PATH="/root/.dpm/bin:${PATH}"
RUN dpm install 3.5.1

WORKDIR /src/main
COPY main/daml.yaml ./
COPY main/daml ./daml
RUN mkdir -p deps \
 && BASE=https://raw.githubusercontent.com/DLC-link/cbtc-lib/main/cbtc-dars/dars/dependencies \
 && curl -fsSL "$BASE/splice-api-token-metadata-v1-1.0.0.dar"              -o deps/splice-api-token-metadata-v1-1.0.0.dar \
 && curl -fsSL "$BASE/splice-api-token-holding-v1-1.0.0.dar"               -o deps/splice-api-token-holding-v1-1.0.0.dar \
 && curl -fsSL "$BASE/splice-api-token-transfer-instruction-v1-1.0.0.dar"  -o deps/splice-api-token-transfer-instruction-v1-1.0.0.dar \
 && dpm build

FROM eclipse-temurin:21-jre-jammy AS runtime

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://get.digitalasset.com/install/install.sh | sh
ENV PATH="/root/.dpm/bin:${PATH}"
RUN dpm install 3.5.1

COPY --from=daml-build /src/main/.daml/dist/daml-main-0.0.1.dar /app/daml-main.dar

EXPOSE 7575 6865

ENTRYPOINT ["dpm", "sandbox", "--json-api-port", "7575", "--dar", "/app/daml-main.dar"]
