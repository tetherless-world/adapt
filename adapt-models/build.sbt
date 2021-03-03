lazy val root = (project in file("."))
    .settings(
        libraryDependencies ++= Seq(
            "io.lemonlabs" %% "scala-uri" % "2.1.0",
            "org.apache.jena" % "jena-core" % jenaVersion,
            "org.apache.jena" % "jena-geosparql" % jenaVersion,
            "org.scalatest" %% "scalatest" % "3.0.8" % "test",
            "com.novocode" % "junit-interface" % "0.11" % "test",
            "org.slf4j" % "slf4j-simple" % "1.7.30" % "test"
        ),
        name := """adapt-models""",
        organization := "edu.rpi.tw.adapt",
        testOptions += Tests.Argument(TestFrameworks.JUnit, "-q", "-v"),
        version := "1.0-SNAPSHOT"
    )

scalaVersion := "2.13.1"
val jenaVersion = "3.14.0"
