import re

with open('index.html', 'r') as f:
    content = f.read()

replacement = """    <title>Tedchem Pvt Ltd - Premium Chemical & Industrial Supplies</title>
    <link rel="icon" type="image/svg+xml" href="/uploads/tedchem_logo.svg" />"""

content = re.sub(r'    <title>Tedchem Pvt Ltd - Premium Chemical & Industrial Supplies</title>', replacement, content)

with open('index.html', 'w') as f:
    f.write(content)
