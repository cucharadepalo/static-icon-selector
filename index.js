'use strict';

const fs = require('fs');
const junk = require('junk');
const jsonFile = 'icons.json';

const walkSync = (dir, list, category) => {
  let files = fs.readdirSync(dir);
  files = files.filter(junk.not);
  let iconList = list || [];
  let iconCategory = category || "none";
  files.forEach(file => {
    if (fs.statSync(dir + file).isDirectory()) {
      iconList = walkSync(dir + file + '/', iconList, file);
    }
    else if (file != jsonFile) {
      let iconName = file.slice(0, -4);
      let fileName = file;
      let iconData = fs.readFileSync(dir + file, "utf8");
      iconList.push({ name: iconName, filename: fileName, category: iconCategory, icon: iconData });
    }
  });
  return iconList;
}

const findAndReplace = (dir, string1, string2) => {
  let files = fs.readdirSync(dir);
  files = files.filter(junk.not);
  files.forEach( file => {
    if (fs.statSync(dir + file).isDirectory()) {
      findAndReplace(dir + file + '/', string1, string2);
    }
    else {
      let fileContent = fs.readFileSync(dir + file, "utf8");
      let newContent = fileContent.replace(string1, string2);
      fs.writeFileSync(dir + file, newContent);
    }
  })
  return 'Done';
}

exports.run = (dir) => {
  const output = JSON.stringify(walkSync(dir), null, 2);
  return Promise.resolve(fs.writeFileSync('dist/' + jsonFile, output));
}

exports.findAndReplace = findAndReplace;