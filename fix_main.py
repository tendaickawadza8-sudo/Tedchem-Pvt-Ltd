with open('src/App.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')
# find the last "            </div>"
for i in range(len(lines)-1, -1, -1):
    if "            </div>" in lines[i]:
        lines.insert(i, "              </main>")
        break

with open('src/App.tsx', 'w') as f:
    f.write('\n'.join(lines))
