const PROJECT_DIRECTORY = "../example_project/"; // local path from execution directory to your project folder. Ends with slash.
const CSPROJ_NAME = "project"; // Name of csproj file without the extension
const HARDCODED_FILES = ['Properties/AssemblyInfo.cs']; // Change these if you need to include a file outside of your src directory
const REFERENCES_MARKER = '<REFERENCESGOHERE>';  // put this in your csprojtemplate file where the itemgroup for classes will go.


const { watch, series } = require('gulp');
const fs = require('fs');

function rebuild_csproj(cb) {
  let template = get_csproj_template();
  let referencesString = get_references_string();
  let csprojData = template.replace(REFERENCES_MARKER, referencesString);
  console.log(csprojData);

  fs.writeFile(`${PROJECT_DIRECTORY}${CSPROJ_NAME}.csproj`, csprojData, function(err){
    if (err){
      console.log(err);
    }
    else{
      console.log("Successfully updated csproj file");
    }
  });
  cb();
}

function get_csproj_template() {
  let csproj_path = `${PROJECT_DIRECTORY}${CSPROJ_NAME}.csprojtemplate`;
  let data;
  try {
    return fs.readFileSync(csproj_path, 'utf8');
    
  } catch(e) {
      console.log('Error:', e.stack);
  }
}

function get_references_string() {
  let baseDir = `${PROJECT_DIRECTORY}src`;
  let files = get_all_cs_files(baseDir);
  let references = [];
  
  HARDCODED_FILES.forEach(function(file){
    files.push(file);
  });

  files.forEach(function(file){
    let reference = file.replace(PROJECT_DIRECTORY, '');
    reference = `    <Compile Include="${reference}" />`;    
    references.push(reference);
  });

  let referencesString = references.join('\n');
  referencesString = `<ItemGroup>\n${referencesString}\n  </ItemGroup>`;

  return referencesString;
}

function get_all_cs_files(dir, fileList) {
  fileList = fileList || [];

  let files = fs.readdirSync(dir);
  files.forEach(function(file){
    let filePath = `${dir}/${file}`;
    if(fs.statSync(filePath).isDirectory()){
      fileList = get_all_cs_files(filePath, fileList);
    }
    else{
      fileList.push(filePath);
    }
  });

  return fileList;
}


exports.default = function() {
  watch(`${PROJECT_DIRECTORY}src/**/*.cs`, rebuild_csproj);
};