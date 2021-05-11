import os
import re
from pathlib import Path
import sys
start_path = "." # current directory

if ( len(sys.argv) == 2):
    outputfileName = "./dist/" + sys.argv[1] + ".js"
else:
    outputfileName = "./dist/CoNDeT.js"

f = open(outputfileName,"w")
f.close()

for path,dirs,files in os.walk(start_path):
    wholeCode = open(outputfileName, 'a')
    for filename in files:
        file = os.path.join(path,filename)
        if ( (re.search(".*\.js",file) != None) ):
            f = open(file)
            content = f.readlines()
            for line in content:
                wholeCode.write(line)
            f.close()

