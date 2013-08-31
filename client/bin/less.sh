#!/bin/bash
watchr -e 'watch("../assets/stylesheets/less/(.*).less") { |f| system("echo lol && lessc ../assets/stylesheets/less/main.less > ../assets/stylesheets/main.css")}'