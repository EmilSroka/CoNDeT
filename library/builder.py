import os
import re
from pathlib import Path
import sys
start_path = "." # current directory

if ( len(sys.argv) == 2):
    outputFileName = "./dist/" + sys.argv[1] + ".js"
else:
    outputFileName = "./dist/CoNDeT.js"

f = open(outputFileName,"w")
f.close()

for path,dirs,files in os.walk(start_path):
    wholeCode = open(outputFileName, 'a')
    for filename in files:
        file = os.path.join(path,filename)
        if ( (re.search(".*\.js",file) != None) ):
            f = open(file)
            content = f.readlines()
            for line in content:
                wholeCode.write(line)
            f.close()

