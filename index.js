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
      // let directory = { category: file, data: []};
      // iconList.push(directory);
      
      iconList = walkSync(dir + file + '/', iconList, file);
      // counter++;
    }
    else if (file != jsonFile) {
      let iconName = file.slice(0, -4);
      let fileName = file;
      let iconData = fs.readFileSync(dir + file, "utf8");
      iconList.push({ name: iconName, filename: fileName, category: iconCategory, icon: iconData });
    }
  });
  return iconList;
};

exports.run = (dir) => {
  const output = JSON.stringify(walkSync(dir), null, 2);
  fs.writeFileSync(dir + jsonFile, output);
  return 'Hecho!';
}