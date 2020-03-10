window.addEventListener("load", () => {
  let app, parser;
      app = document.getElementById("app"),
      parser = new DOMParser();

  function groupBy(xs, key) {
      return xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
      }, {});
  };

  const data = "iconos/icons.json";
  let request = new XMLHttpRequest();
      request.open("GET", data);
      request.responseType = "json";
      request.send();
      request.onload = () => {
          let icons = request.response;
          generateUI(groupBy(icons, 'category'));
      }

  function generateUI(iconsByCat) {
      Object.keys(iconsByCat).forEach(category => {
          let container, heading, category_icons;
              container = document.createElement("div");
              container.className = "grid";
              container.id = category.toLowerCase();
              heading = document.createElement("h2");
              heading.innerHTML = category == 'none' ? 'uncategorized': category;
              category_icons = iconsByCat[category];

          category_icons.forEach(element => {
              let wrapper = document.createElement("button");
                  wrapper.className = "icon";
                  wrapper.id = element["name"];
              let svg = parser.parseFromString(element["icon"], "image/svg+xml");
                  wrapper.appendChild(svg.documentElement);
                  container.appendChild(wrapper);
          });
          app.append(heading, container);
      });
  }         
});