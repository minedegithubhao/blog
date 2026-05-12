$env:JAVA_HOME = 'D:\AAA_tools\java\17.0.16-ms'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location 'D:\IdeaProjects\blog\canbe_blog_server'
& 'D:\AAA_tools\maven\3.9.6\bin\mvn.cmd' spring-boot:run '-Dspring-boot.run.profiles=dev'
