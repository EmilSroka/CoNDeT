import os
import re
from pathlib import Path
import sys
Path("/wholeCode.js").touch()
start_path = "." # current directory

if ( len(sys.argv) == 2):
    nazwa = "./dist/" + sys.argv[1] + ".js"
else:
    nazwa = "./dist/CoNDeT.js"

f = open(nazwa,"w")
f.close()

for path,dirs,files in os.walk(start_path):
    wholeCode = open(nazwa, 'a')
    for filename in files:
        file = os.path.join(path,filename)
        if ( (re.search(".*\.js",file) != None) ):
            f = open(file)
            content = f.readlines()
            for line in content:
                wholeCode.write(line)
            f.close()

