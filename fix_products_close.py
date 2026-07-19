import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# remove the `)}` before ABOUT US SECTION
content = content.replace('        )}\n\n        {/* ABOUT US SECTION */}', '        {/* ABOUT US SECTION */}')

# put `)}` before SPECIFICATIONS DETAIL MODAL
content = content.replace('        {/* SPECIFICATIONS DETAIL MODAL */}', '        )}\n\n        {/* SPECIFICATIONS DETAIL MODAL */}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
