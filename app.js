window.addEventListener("load", () => {
    let iconGrid = document.getElementById("iconGrid"),
        toolbar = document.getElementById("toolbar"),
        parser = new DOMParser();



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
            let container = document.createElement("div");
            container.className = "grid";
            container.id = category.toLowerCase();
            let heading = document.createElement("h2");
            heading.className = "category-heading";
            heading.innerHTML = category == 'none' ? 'uncategorized' : category;
            let category_icons = iconsByCat[category];

            category_icons.forEach(element => {
                let button = document.createElement("button");
                button.className = "icon-btn";
                button.id = element["name"];
                button.setAttribute("data-filename", element["filename"]);
                button.addEventListener("click", showDetail);
                let svg = parser.parseFromString(element["icon"], "image/svg+xml");
                button.appendChild(svg.documentElement);
                container.appendChild(button);
            });
            iconGrid.append(heading, container);
        });
    }

    function showDetail(e) {
        let icon = e.currentTarget;
        let preview = toolbar.querySelector(".icon-details");
        let codeBlock = toolbar.querySelector("pre");
        preview.innerHTML = icon.firstElementChild.outerHTML;
        codeBlock.textContent = icon.firstElementChild.outerHTML;
    }

    function groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
});