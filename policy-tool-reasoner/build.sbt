name := """policy-tool-reasoner"""
organization := "policy-tool.tw.rpi.edu"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.1"

libraryDependencies += guice
