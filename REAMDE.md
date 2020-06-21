# Godot Utility
When working on godot C# projects, I use text editors and find updating the csproj
file by hand rather tedious. This gulp script updates all references when files change.

## Set up
1. Update PROJECT_DIRECTORY, CSPROJ_NAME, and HARDCODED_FILES in gulpfile.js
2. Create a file with the same name as your csproject file, but with the extension .csprojtemplate
3. Replace the itemgroup in your .csprojtemplate with the REFERENCES_MARKER found in gulp.js
