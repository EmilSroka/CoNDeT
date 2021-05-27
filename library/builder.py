from pathlib import Path
import os
import re
import sys

current_path = '.'
default_output_file_name = 'CoNDeT'
output_file_path = f'./dist/{sys.argv[1] if len(sys.argv) == 2 else default_output_file_name}.js'

output = open(output_file_path, 'w+', encoding="utf8")

for path, _, files in os.walk(current_path):
    files.sort()
    for file_name in files:
        file_path = os.path.join(path, file_name)
        if re.search(".*\.js", file_path) != None:
            input = open(file_path, encoding="utf8")
            content = input.readlines()
            for line in content:
                output.write(line)
            input.close()
