import os
import re
from pathlib import Path
Path("/wholeCode.js").touch()
start_path = "." # current directory

files_content =[]

f = open("wholeCode.js","w")
f.close()

for path,dirs,files in os.walk(start_path):
    counter = 0
    wholeCode = open("wholeCode.js", 'a')
    for filename in files:
        file = os.path.join(path,filename)
        if ( (re.search(".*\.js",file) != None) ):
            counter = 1
            f = open(file)
            content = f.readlines()
            for line in content:
                wholeCode.write(line)
            f.close()

