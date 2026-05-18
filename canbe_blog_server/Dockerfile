# syntax=docker/dockerfile:1.7

FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY pom.xml ./
COPY settings-docker.xml ./
RUN --mount=type=cache,target=/root/.m2,sharing=locked \
    mvn -s /workspace/settings-docker.xml -B -ntp -DskipTests \
    -Dmaven.wagon.http.retryHandler.count=3 \
    -Dmaven.wagon.rto=180000 \
    dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2,sharing=locked \
    mvn -s /workspace/settings-docker.xml -B -ntp -DskipTests \
    -Dmaven.wagon.http.retryHandler.count=3 \
    -Dmaven.wagon.rto=180000 \
    package

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8800 18800

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
