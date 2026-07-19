with open('src/App.tsx', 'r') as f:
    content = f.read()

# Currently, we have:
#        </div>
#        {/* PRODUCTS SECTION */}
#        {activeSection === "products" && (

# We need to insert `)}` after the </div> of HERO SECTION.
# The `homeRef` ends at line 647.
content = content.replace('        </div>\n\n        {/* PRODUCTS SECTION */}', '        </div>\n        )}\n\n        {/* PRODUCTS SECTION */}')

# Then we have:
#        {/* ABOUT US SECTION */}
#        {activeSection === "about" && (
# We need to close products section. Wait, products section ends with `</AnimatePresence>`.
# Let's see:
#          )}
#        </AnimatePresence>
#
#        {/* ABOUT US SECTION */}
content = content.replace('        </AnimatePresence>\n\n        {/* ABOUT US SECTION */}', '        </AnimatePresence>\n        )}\n\n        {/* ABOUT US SECTION */}')

# Then we have:
#        {/* CONTACT US SECTION */}
#        {activeSection === "contact" && (
# It ends right before contact section:
#            </div>
#          </div>
#        </div>
#
#        {/* CONTACT US SECTION */}
content = content.replace('        </div>\n\n        {/* CONTACT US SECTION */}', '        </div>\n        )}\n\n        {/* CONTACT US SECTION */}')

# The end of main:
#        </div>
#        )}
#      </main>
# It should be correctly having 1 `)}` because my python script added `)}` before </main>.
# But let's check.

with open('src/App.tsx', 'w') as f:
    f.write(content)
