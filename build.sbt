name := """aurita"""
organization := "meetsatori.com"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.12.3"

lazy val macwireVersion = "2.3.0"

lazy val taggingVersion = "1.0.0"

lazy val playSlickVersion = "3.0.3"

// libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test

libraryDependencies ++= Seq(
  ehcache,
  ws,
  specs2                      % Test,
  "com.softwaremill.macwire" %% "macros"                   % macwireVersion          % "provided",
  "com.softwaremill.macwire" %% "util"                     % macwireVersion,
  "com.softwaremill.common"  %% "tagging"                  % taggingVersion,
  "com.typesafe.play"        %% "play-slick"               % playSlickVersion,
  "com.typesafe.play"        %% "play-slick-evolutions"    % playSlickVersion
)

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "meetsatori.com.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "meetsatori.com.binders._"
