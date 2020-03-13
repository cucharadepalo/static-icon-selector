# Static icon selector
Generates a quick reference app for designers and developers from a given folder with svg icons.

![Screenshot](screenshot.png?raw=true)

## Usage

1. Clone the repo.
2. Run `npm install` to install dev dependencies.
3. Copy your folder containing `.svg` files in the root directory. If you want to categorize the icons, place them in folders inside the original one. See example below. 
4. Each folder with icons inside the folder will be a category name
5. Edit `gulp.config.js` with the path of the icon folder you just copied and all the other options available if you like (not many). Don't forget the slash `'/'` at the end!!
6. Run `npm run build` to generate and serve the created app.


## Scripts

```
npm run build
```

Builds the app and serves it with [live-server](https://github.com/tapio/live-server). The app doen't work locally as it uses a `XMLHttpRequest` for the generated JSON with the icons.

````
gulp build
````

Builds the site without the server

```
gulp icons
```

Builds the JSON file with all the icons. Useful if some minor changes or additions are made.

```
gulp serve
```

Just the live-server part

## About the icons

Optimal conditions for svg code:

* Use `currentColor` on fills or strokes in monocolor icons
* Use square icons via `viewBox` with same size and stroke width for appearance consistency

### Folder structure

```
├── ICON FOLDER
│   ├── uncategorized icon.svg
│   ├── uncategorized icon.svg
│   ├── CATEGORY NAME
│   │   ├── icon.svg
│   │   ├── icon.svg
│   │   ├── icon.svg
│   │   ├── icon.svg
│   │   ├── icon.svg
│   ├── CATEGORY NAME
│   │   ├── icon.svg
│   │   ├── icon.svg
│   │   ├── icon.svg
│   │   ├── icon.svg
└── └── └── icon.svg
```



----

Inspired by [ICONSVG](https://iconsvg.xyz/) by [@gaddafirusli](https://www.twitter.com/gaddafirusli)

The icons in the screenshot are from [Feather](https://feathericons.com/)

Thanks!
