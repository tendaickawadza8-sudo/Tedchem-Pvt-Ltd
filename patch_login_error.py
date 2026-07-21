import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

search = """              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input"""

replace = """              <form onSubmit={handleAdminLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center font-medium">
                    {loginError}
                  </div>
                )}
                <input"""

if search in content:
    content = content.replace(search, replace)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Search string not found")
