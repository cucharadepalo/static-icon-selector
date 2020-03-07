'use strict';

const fs = require('fs');
const junk = require('junk');

const walkSync = (dir, list, level) => {
  let files = fs.readdirSync(dir);
  files = files.filter(junk.not);
  let iconList = list || [];
  let counter = level || 0;
  files.forEach(file => {
    if (fs.statSync(dir + file).isDirectory()) {
      let directory = { category: file, data: []};
      iconList.push(directory);
      
      walkSync(dir + file + '/', iconList, counter);
      counter++;
    }
    else if (iconList[counter]) {
      let iconName = file.slice(0, -4);
      let iconData = fs.readFileSync(dir + file, "utf8");
      iconList[counter]['data'].push({ name: iconName, icon: iconData });
    }
  });
  return iconList;
};

exports.run = (dir) => {
  const output = JSON.stringify(walkSync(dir), null, 2);
  fs.writeFileSync(dir + 'icons.json', output);
  console.log('Hecho!');
}