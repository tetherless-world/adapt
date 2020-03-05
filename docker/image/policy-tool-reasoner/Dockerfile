# compile java code in a separate image
FROM hseeberger/scala-sbt:11.0.6_1.3.8_2.13.1 as build

# copy & install policy-tool-models
COPY policy-tool-models /policy-tool-models
RUN cd /policy-tool-models && sbt publishLocal

# copy & compile policy-tool-reasoner
COPY policy-tool-reasoner /policy-tool-reasoner
RUN cd /policy-tool-reasoner && sbt playUpdateSecret && sbt dist
RUN cd /policy-tool-reasoner/target/universal && unzip -o policy-tool-reasoner-1.0-SNAPSHOT.zip && rm policy-tool-reasoner-1.0-SNAPSHOT.zip

# base image - check later to see if there is an alpine image
FROM openjdk:11-jre-slim

# copy built java
COPY --from=build /policy-tool-reasoner/target/universal/ /policy-tool-reasoner

COPY docker/image/reasoner-entrypoint.sh /reasoner-entrypoint.sh

EXPOSE 9000
ENTRYPOINT [ "/reasoner-entrypoint.sh" ]