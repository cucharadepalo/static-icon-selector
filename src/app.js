window.addEventListener("load", () => {
    const iconGrid = document.getElementById("iconGrid"),
        toolbar = document.getElementById("toolbar"),
        parser = new DOMParser(),
        iconCopyBtn = document.getElementById("iconCopy"),
        iconDownloadBtn = document.getElementById("iconDownload"),
        svgCode = document.getElementById("svgCode"),
        buttons = document.querySelectorAll(".action-btn"),
        buttonsTxt = {
            iconCopy: {
                text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> -copy_button_txt-`,
                success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> -copy_button_success-`
            },
            iconDownload: {
                text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg> -download_button_txt-`,
                success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;"> <path fill="currentColor" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"> <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/></path></svg> -download_button_success-`
            }
        },
        colorButtons = document.querySelectorAll(".preview-controls button"),
        data = "icons.json";

    let request = new XMLHttpRequest();
    request.open("GET", data);
    request.responseType = "json";
    request.send();
    request.onload = () => {
        buildUI(groupBy(request.response, 'category'));
    }

    function groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    function buildUI(iconsByCat) {
        Object.keys(iconsByCat).forEach(category => {
            let container = document.createElement("div");
            container.className = "grid";
            container.id = category;
            let heading = document.createElement("h2");
            heading.className = "category-heading";
            heading.innerHTML = category == 'none' ? '-no_category_heading-' : category;
            let category_icons = iconsByCat[category];

            category_icons.forEach(element => {
                let button = document.createElement("button");
                button.className = "icon-btn";
                button.id = element["name"];
                button.setAttribute("data-filename", element["filename"]);
                let svg = parser.parseFromString(element["icon"], "image/svg+xml");
                button.appendChild(svg.documentElement);
                button.addEventListener("click", showDetail);
                container.appendChild(button);
            });
            iconGrid.append(heading, container);
        });
        // Select the first icon of the grid
        let firstIcon = iconGrid.querySelector(".icon-btn");
        firstIcon.dispatchEvent(new Event("click"));
        firstIcon.focus();
        // Attach buttons actions & text
        iconCopyBtn.addEventListener("click", copyToClipboard);
        iconDownloadBtn.addEventListener("click", downloadIcon);
        for(let i = 0; i < buttons.length; i++){
            buttons[i].innerHTML = buttonsTxt[buttons[i].id]['text'];
            buttons[i].addEventListener("click", showButtonMessage, true);
        }
        for(let j = 0; j < colorButtons.length; j++){
            colorButtons[j].addEventListener("click", previewColor, true);
        }
    }

    function showDetail(e) {
        const icon = e.currentTarget,
              iconCode = icon.firstElementChild.outerHTML,
              iconFilename = icon.getAttribute("data-filename");
        // Add selected class to the clicked button
        let iconButtons = iconGrid.querySelectorAll(".icon-btn");
        iconButtons.forEach(element => {
            element.classList.remove("selected");
        });
        icon.classList.add("selected");
        // Paint icon preview and details
        let preview = toolbar.querySelector(".icon-preview");
        let details = toolbar.querySelector(".icon-details");
        let iconDetails = document.createElement("span");
        iconDetails.className = "icon-name";
        iconDetails.textContent = icon.id;
        let codeBlock = toolbar.querySelector("pre code");
        preview.innerHTML = iconCode;
        details.innerHTML = "";
        details.appendChild(iconDetails);
        codeBlock.textContent = iconCode;
        hljs.highlightBlock(codeBlock);
        svgCode.textContent = iconCode;
        svgCode.setAttribute("data-filename", iconFilename);
    }

    // Show different text on clicked buttons
    function showButtonMessage(e) {
        const element = e.currentTarget;
        const buttonId = element.id;
        const originalTxt = buttonsTxt[buttonId]['text'];
        const msg = buttonsTxt[buttonId]['success'];
        element.innerHTML = msg;
        setTimeout( () => {
            element.innerHTML = originalTxt;
        }, 2000 );
    }

    function copyToClipboard() {
        svgCode.select();
        return document.execCommand("copy");
    }

    function downloadIcon(e) {
        let element = document.createElement("a");
        let filename = svgCode.getAttribute("data-filename");
        element.setAttribute("href", "data:image/svg+xml;charset=utf-8, " + encodeURIComponent(svgCode.textContent));
        element.setAttribute("download", filename);
        toolbar.appendChild(element);
        element.click();
        toolbar.removeChild(element);
    }

    function previewColor(e) {
        const preview = toolbar.querySelector(".icon-preview");
        const color = e.currentTarget.getAttribute("data-color");
        let colorAttibute = "data-background";
        if (e.currentTarget.classList.contains("preview-foreground")) {
            colorAttibute = "data-foreground";
        }
        return preview.setAttribute(colorAttibute, color);
    }

});