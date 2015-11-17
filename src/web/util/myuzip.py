#!/usr/bin/env python
# -*- coding: utf-8 -*-
# uzip.py

import os
import sys
import zipfile

reload(sys)  
sys.setdefaultencoding('utf8')

print "Processing File " + sys.argv[1]

file=zipfile.ZipFile(sys.argv[1],"r");
for name in file.namelist():
    try:
    	utf8name=name.decode('gbk')
    except:
	utf8name=name.decode('big5')
    print "Extracting " + utf8name
    fullname = sys.argv[2] + "/" + utf8name
    pathname = os.path.dirname(fullname)
    if not os.path.exists(pathname) and pathname!= "":
        os.makedirs(pathname)
    data = file.read(name)
    if not os.path.exists(fullname):
        fo = open(fullname, "w")
        fo.write(data)
        fo.close
file.close()
