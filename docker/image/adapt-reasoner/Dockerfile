# compile java code in a separate image
FROM hseeberger/scala-sbt:11.0.6_1.3.8_2.13.1 as build

# copy & install adapt-models
COPY adapt-models /adapt-models
RUN cd /adapt-models && sbt publishLocal

# copy & compile adapt-reasoner
COPY adapt-reasoner /adapt-reasoner
RUN cd /adapt-reasoner && sbt playUpdateSecret && sbt dist
RUN cd /adapt-reasoner/target/universal && unzip -o adapt-reasoner-1.0-SNAPSHOT.zip && rm adapt-reasoner-1.0-SNAPSHOT.zip

# base image - check later to see if there is an alpine image
FROM openjdk:11-jre-slim

# copy built java
COPY --from=build /adapt-reasoner/target/universal/ /adapt-reasoner

COPY docker/image/reasoner-entrypoint.sh /reasoner-entrypoint.sh

EXPOSE 9000
ENTRYPOINT [ "/reasoner-entrypoint.sh" ]