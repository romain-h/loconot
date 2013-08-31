def action
    system("echo less file modified")
    system("lessc less/main.less > main.css")
end

watch( 'less/*') { action }