// ==UserScript==
// @name         Arras Build Loader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Load Arras Builds
// @author       Hepta + Gemini
// @match        *://arras.io/*
// @match        *://*.arras.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const notifyInGame = true; // change in-game notifications here
    const style = document.createElement("style");
    style.innerHTML = `
        :root {
            --font: "Ubuntu", "Segoe UI", Roboto, sans-serif;
            --font-size-btn: 13px;
            --font-weight: 700;
            --panel: #8a8a98;
            --background: #767682;
            --dbackground: #666670;
            --border: #484848;
            --border-radius: 3px;
            --lgreen: #85b285;
            --green: #749b74;
            --lblue: #6bbbb0;
            --blue: #5da399;
            --lgray: #a0a0a8;
            --gray: #888890;
            --red: #ff9ea6;
            --text: #ffffff;
            --stroke: 0.2em;
        }

        #panel-overlay {
            display: flex;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            justify-content: center;
            align-items: center;
            z-index: 99999;
        }

        #panel {
            font-family: var(--font);
            color: var(--text);
            background: var(--panel);
            border: 3px solid var(--border);
            border-radius: 6px;
            padding: 20px 24px 24px;
            width: 600px;
            max-width: 95vw;
            box-sizing: border-box;
            -webkit-text-stroke: var(--stroke) var(--border);
            paint-order: stroke fill;
            display: flex;
            flex-direction: column;
            gap: 0;
            outline: none;
        }
        
        #panel h2.panel-title {
            margin: 0 0 16px 0;
            font-size: 26px;
            font-weight: 700;
            -webkit-text-stroke: var(--stroke) var(--border);
            paint-order: stroke fill;
        }
        #panel .panel-row {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 2px solid var(--border);
            gap: 12px;
        }
        #panel .panel-row:last-child {
            border-bottom: none;
        }

        #panel .panel-label {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
        }
        #panel .panel-label strong, #panel #note {
            font-size: 14px;
            font-weight: 700;
            -webkit-text-stroke: 0;
            paint-order: normal;
        }
        #panel .panel-label span {
            font-size: 11.5px;
            font-weight: 400;
            -webkit-text-stroke: 0;
            paint-order: normal;
            opacity: 0.88;
        }

        #panel input[type="text"] {
            font-size: var(--font-size-btn);
            font-family: var(--font);
            font-weight: 700;
            color: var(--border);
            padding: 7px 10px;
            border: 3px solid var(--border);
            border-radius: var(--border-radius);
            background: white;
            outline: none;
            -webkit-text-stroke: 0;
            paint-order: normal;
            flex: 1;
            min-width: 0;
            box-sizing: border-box;
            margin: 6px 0px;
        }

        #panel button.btn-green, #panel button.btn-gray {
            display: inline-flex;
            font-weight: var(--font-weight);
            font-family: var(--font);
            padding: 6px 14px;
            cursor: pointer;
            border: 3px solid var(--border);
            border-radius: var(--border-radius);
            font-size: var(--font-size-btn);
            height: 30px;
            color: var(--text);
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            -webkit-text-stroke: var(--stroke) var(--border);
            paint-order: stroke fill;
        }
        #panel button.btn-green {
            background: linear-gradient(var(--lgreen) 0 60%, var(--green) 60% 100%);
        }
        #panel button.btn-gray {
            background: linear-gradient(var(--lgray) 0 60%, var(--gray) 60% 100%);
        }
        #panel button.btn-green:hover, #panel button.btn-gray:hover {
            filter: brightness(1.1);
        }

        #panel .panel-input-row {
            display: flex;
            flex-direction: row;
            gap: 6px;
            align-items: center;
            width: 100%;
        }

        #panel .scroll {
            overflow-y: auto;
            max-height: 200px;
            overflow-x: hidden;
            box-sizing: border-box;
            border: none;
            background: var(--panel);
            width: 100%;
            scrollbar-width: thin;
            scrollbar-color: var(--border) transparent; 
        }
        #panel .scroll .div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 7px 0;
            border-bottom: 1px solid rgba(0,0,0,0.18);
        }
        #panel .scroll .div:last-child {
            border-bottom: none;
        }
        #panel .scroll .div .text {
            flex: 1;
            font-size: 13px;
            font-weight: 700;
            -webkit-text-stroke: 0;
            paint-order: normal;
            color: var(--text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #panel .scroll .div .text span {
            font-weight: 400;
            opacity: 0.8;
        }
        #panel .scroll .div .checkbox {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            width: 26px;
            height: 26px;
            background: var(--red);
            border: 3px solid var(--border);
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 15px;
            font-weight: 900;
            color: var(--text);
            -webkit-text-stroke: 0;
            paint-order: normal;
            line-height: 1;
        }
        #panel .scroll .div input {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            width: 26px;
            height: 26px;
            background: white;
            border: 3px solid var(--border);
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 15px;
            font-weight: 900;
            color: var(--border);
            -webkit-text-stroke: 0;
            paint-order: normal;
            line-height: 1;
            flex: none !important;
            padding: 7px 0px;
            text-align: center;
        }
        #panel .scroll .div .checkbox:hover {
            filter: brightness(1.15);
        }
    `;

    const overlay = document.createElement('div');
    overlay.id = 'panel-overlay';
    overlay.style.display = 'none';

    const panel = document.createElement("div");
    panel.id = "panel";
    panel.setAttribute("tabindex", "-1");
    panel.style.display = 'none';
    panel.innerHTML = `
        <h2 class="panel-title">Build Loader</h2>
        <div class="panel-row">
            <div class="panel-label">
                <strong>Apply Theme</strong>
                <span>Enter your arras theme code below.</span>
            </div>
            <div class="panel-input-row">
                <input type="text" id="theme-input" maxlength="200" placeholder="arras/..." value="arras/ABBUxpZ2h0AkNYFHrT27nofueJbf3zgHrbuu+Zw+jr96Skrf///0hISDyky4q8P+A+Qe/HS41q38xmnKenr3Jvb9vb2wAAAAFISEiZAA">
                <button class="btn-gray" id="clear-theme-btn">Clear</button>
            </div>
        </div>

        <div class="panel-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
            <div class="panel-label">
                <strong>Add a build</strong>
                <span>Enter a build string and press Add to save it.</span>
            </div>
            <p id="note"></p>
            <div class="panel-input-row">
                <input type="text" id="build-input" maxlength="50" placeholder="my-build:0/0/0/9/9/9/9/6/0/0">
                <button class="btn-green" id="add-btn">Add</button>
                <button class="btn-gray" id="clear-btn">Clear</button>
            </div>
            <div class="panel-label">
                <span>Format:&lt;name&gt;:&lt;build&gt; 10 values separated by <code style="-webkit-text-stroke:0;paint-order:normal">/</code>, each between 0-12 (normal) or 0-15 (other gamemodes).</span>
            </div>
        </div>

        <div class="panel-row">
            <div class="panel-label" style="display: block; width: 100%">
                <strong>List of builds</strong> <br/>
                <span>List of your saved builds.</span>
            </div>
            <div class="scroll" id="build-list"></div>
        </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(style);
    document.body.appendChild(overlay);

    const arrayListeners = [];
    const interceptAdd = (target) => {
        if (!target) return;
        try {
            const originalAdd = target.addEventListener;
            target.addEventListener = function (type, listener, options) {
                if (type === 'keydown' || type === 'keyup') {
                    const wrappedListener = function (e) {
                        const active = document.activeElement;

                        // not important, for better ux
                        if (e.key === "`") {
                            const ingameCond = active.tagName === "INPUT" && (active.getAttribute("maxlength") === "24" || active.getAttribute("maxlength") === "60");
                            const themeCond = active.tagName === "INPUT" && active.id === "theme-input";
                            if (ingameCond) return;
                            if (themeCond) return listener.call(this, e);
                        }

                        const cond = active?.closest("#panel") && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
                        if (cond) {
                            return;
                        }
                        return listener.call(this, e);
                    };
                    arrayListeners.push({ target: this, type, listener: wrappedListener });
                    return originalAdd.call(this, type, wrappedListener, options);
                }
                return originalAdd.call(this, type, listener, options);
            };
        } catch (e) { }
    };

    interceptAdd(EventTarget.prototype);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function getNumberKeyInfo(digit) {
        const num = Number(digit);
        return {
            key: String(digit),
            code: 'Digit' + digit,
            keyCode: 48 + num
        };
    }

    async function pressNumberKey(digit, holdTime = 0) {
        const { key, code, keyCode } = getNumberKeyInfo(digit);
        const createEvent = (type) => ({
            type,
            isTrusted: true,
            _simulated: true,
            key,
            code,
            keyCode,
            which: keyCode,
            repeat: false,
            bubbles: true,
            cancelable: true,
            preventDefault: () => { },
            stopPropagation: () => { },
            stopImmediatePropagation: () => { }
        });
        const bypassDown = createEvent('keydown');
        const bypassUp = createEvent('keyup');

        arrayListeners.forEach(item => {
            if (item.type === 'keydown') {
                try { item.listener.call(item.target, bypassDown); } catch (e) { }
            }
        });
        if (holdTime > 0) await delay(holdTime);
        arrayListeners.forEach(item => {
            if (item.type === 'keyup') {
                try { item.listener.call(item.target, bypassUp); } catch (e) { }
            }
        });
    }

    const g = (element) => document.getElementById(element);
    const HTML = {
        panel: g('panel'),
        panelOverlay: g('panel-overlay'),
        addBtn: g('add-btn'),
        clearBtn: g('clear-btn'),
        buildInput: g('build-input'),
        buildList: g('build-list'),
        note: g('note'),
        themeInput: g('theme-input'),
        clearThemeBtn: g('clear-theme-btn'),
    };

    let storage = { theme: '', build: [] };

    const openPanel = () => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "`") {
                const isHidden = HTML.panel.style.display === 'none';
                HTML.panel.style.display = isHidden ? 'flex' : 'none';
                HTML.panelOverlay.style.display = isHidden ? 'flex' : 'none';
                HTML.panel.focus();
            }
        });
    };

    const notify = (original = "You will be invulnerable", replace = "Arras Build Loader is now ready. Press ` to open the panel.", options = "startsWith") => {
        if (!notifyInGame) return;
        const originalCanvas = {
            fillText: CanvasRenderingContext2D.prototype.fillText,
            strokeText: CanvasRenderingContext2D.prototype.strokeText,
            measureText: CanvasRenderingContext2D.prototype.measureText,
        };

        const checkText = (text, ori, option) => {
            switch (option) {
                case "startsWith": return text.startsWith(ori);
                case "endsWith": return text.endsWith(ori);
                case "includes": return text.includes(ori);
                default: return text === ori;
            }
        };

        CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
            if (checkText(text, original, options)) text = replace;
            return originalCanvas.fillText.apply(this, [text, x, y]);
        };
        CanvasRenderingContext2D.prototype.strokeText = function (text, x, y) {
            if (checkText(text, original, options)) text = replace;
            return originalCanvas.strokeText.apply(this, [text, x, y]);
        };
        CanvasRenderingContext2D.prototype.measureText = function (text) {
            if (checkText(text, original, options)) text = replace;
            return originalCanvas.measureText.apply(this, [text]);
        };
    };

    const defaultTheme = 'arras/ABBUxpZ2h0AkNYFHrT27nofueJbf3zgHrbuu+Zw+jr96Skrf///0hISDyky4q8P+A+Qe/HS41q38xmnKenr3Jvb9vb2wAAAAFISEiZAA';

    const readingTheme = (themeCode) => {
        const data = atob(themeCode.trim().replace(/\s+/g, ''));
        const intToHex = (num) => '#' + num.toString(16).padStart(6, '0');
        if (data.startsWith('\x6a\xba\xda\xb3\xf0')) {
            let offset = 5;
            const version = data.charCodeAt(offset++);
            const nameLen = data.charCodeAt(offset++);
            const name = data.slice(offset, offset + nameLen);
            offset += nameLen;
            const authorLen = data.charCodeAt(offset++);
            const author = data.slice(offset, offset + authorLen);
            offset += authorLen;
            const tableLen = data.charCodeAt(offset++);
            const table = [];
            const colorName = ["Shield Bars", "Health Bars", "Triangles", "Neutral", "Hexagons", "Crashers", "Eggs", "Walls", "Text", "Borders", "Blue", "Green", "Red", "Squares", "Pentagons", "Purple", "Barrels", "Rogues", "Background", "Grid"];
            for (let i = 0; i < tableLen; i++) {
                const r = data.charCodeAt(offset++);
                const g = data.charCodeAt(offset++);
                const b = data.charCodeAt(offset++);
                table.push(intToHex((r << 16) | (g << 8) | b));
            }
            const blend = data.charCodeAt(offset++) / 255;
            const neon = data.charCodeAt(offset++) === 1;
            return {
                format: 'v1',
                name: name || 'Unknown Theme',
                author: author || 'Unknown',
                blend: blend,
                neon: neon,
                colors: Object.fromEntries(colorName.map((name, i) => [name, table[i]])),
            };
        }
        return null;
    };

    const darken = (color, percent = 0.15) => {
        let [r, g, b] = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)];
        let dark = (c) => Math.max(0, Math.floor(parseInt(c, 16) * (1 - percent)));
        return `#${dark(r).toString(16).padStart(2, '0')}${dark(g).toString(16).padStart(2, '0')}${dark(b).toString(16).padStart(2, '0')}`;
    };

    const updateTheme = (themeCode) => {
        const parsed = readingTheme(themeCode);
        if (!parsed || !parsed.colors) throw new Error("Invalid theme");
        let colors = parsed.colors;
        const [green, red, gray, panel, border, text] = [colors['Green'], colors['Red'], colors['Walls'], colors['Barrels'], colors['Borders'], colors['Text']];
        document.documentElement.style.setProperty('--lgreen', green);
        document.documentElement.style.setProperty('--green', darken(green));
        document.documentElement.style.setProperty('--red', red);
        document.documentElement.style.setProperty('--lgray', gray);
        document.documentElement.style.setProperty('--gray', darken(gray));
        document.documentElement.style.setProperty('--panel', panel);
        document.documentElement.style.setProperty('--border', border);
        document.documentElement.style.setProperty('--text', text);
    };

    const useStorageTheme = () => {
        if (storage.theme) {
            HTML.themeInput.value = storage.theme;
            try { updateTheme(storage.theme); } catch (e) { updateTheme(defaultTheme); }
        } else {
            HTML.themeInput.value = defaultTheme;
            storage.theme = defaultTheme;
            saveStorage();
            updateTheme(defaultTheme);
        }
    };

    const listenThemeInput = (input) => {
        const currentValue = input.value;
        try {
            updateTheme(currentValue);
            storage.theme = currentValue;
        } catch (err) {
            updateTheme(defaultTheme);
            storage.theme = defaultTheme;
            input.value = defaultTheme;
        }
        saveStorage();
    };

    const saveKey = () => {
        let keyInput = document.querySelectorAll("input[data-keybind]");
        let arrKey = [];
        keyInput.forEach(input => {
            if (input.value === "`") {
                alert("Please don't use ` as a keybind!");
                input.value = "";
            }
            if (arrKey.includes(input.value) && input.value !== "") {
                alert("Keybind already used!");
                document.activeElement.value = "";
            }
            arrKey.push(input.value);
            const buildName = input.getAttribute("data-keybind");
            const targetBuild = storage.build.find(b => b.name === buildName);
            if (targetBuild) {
                targetBuild.key = input.value;
            }
        });
        saveStorage();
    };

    const deleteBuild = (name) => {
        storage.build = storage.build.filter(build => build.name !== name);
        saveStorage();
        const element = document.getElementById('c-' + name);
        if (element && element.parentElement) {
            element.parentElement.remove();
        }
    };

    const addBuild = (input, isSaved = false) => {
        if (!isSaved) {
            let parse = input.trim().split(':');
            if (parse.length !== 2 || parse[0].length === 0) { alert('Build or name is not valid'); return; }
            if (storage.build.some(build => build.name === parse[0])) { alert('Name already exists'); return; }
        }

        const [name, build, key] = isSaved ? [input.name, input.build, input.key] : [...input.trim().split(":"), ""];
        if (!name || !build) return;

        let fBuild = build.trim().split("/");
        let isGreaterThan = (arr, max) => arr.some(x => Number(x) > max);
        let hasNoNumber = (arr) => arr.some(x => isNaN(Number(x)) || x.trim() === "");

        if (fBuild.length !== 10 || isGreaterThan(fBuild, 15) || hasNoNumber(fBuild)) {
            alert('Build is not valid');
            return;
        }

        const escapeHtml = str => new Option(str).innerHTML;
        const div = `
            <div class="div">
                <div class="text">${escapeHtml(name)} <span>${escapeHtml(build)}</span></div>
                <input type="text" maxlength="1" placeholder="" data-keybind="${escapeHtml(name)}" value="${escapeHtml(key)}" title="Keybind">
                <button class="checkbox" id="c-${escapeHtml(name)}" title="Delete">&#x2715;</button>
            </div>
        `;
        HTML.buildList.insertAdjacentHTML('beforeend', div);

        const insertedDiv = HTML.buildList.lastElementChild;
        insertedDiv.querySelector('input').addEventListener('input', saveKey);
        insertedDiv.querySelector('.checkbox').addEventListener('click', () => deleteBuild(name));

        if (!isSaved) {
            storage.build.push({ name, build, key });
            saveStorage();
        }
    };

    const applyBuild = async (build, waitms = 0) => {
        let fBuild = build.trim().split("/");
        for (let i = 0; i < fBuild.length; i++) {
            for (let j = 0; j < Number(fBuild[i]); j++) {
                let a = (i === 9) ? 0 : i + 1;
                pressNumberKey(a);
                if (waitms > 0) await delay(waitms);
            }
        }
    };

    const listeningBuildKey = () => {
        document.addEventListener('keydown', (e) => {
            storage.build.forEach(b => {
                if (b.key && e.key.toLowerCase() === b.key.toLowerCase()) {
                    applyBuild(b.build);
                }
            });
        });
    };

    const note = () => {
        HTML.note.style.display = "none";
        HTML.buildInput.addEventListener('input', () => {
            if (!HTML.buildInput.value.includes(":")) {
                HTML.note.style.display = "none";
                return;
            }
            let parse = HTML.buildInput.value.trim().split(":")[1] || "";
            let noteInfo = ["Body Damage", "Max Health", "Bullet Speed", "Bullet Heal", "Bullet Penetration", "Bullet Damage", "Reload", "Movement Speed", "Shield Regeneration", "Shield Capacity"];
            let index = parse.split("/").length - 1;
            if (index >= 0 && index < noteInfo.length) {
                HTML.note.style.display = "block";
                HTML.note.textContent = noteInfo[index];
            } else {
                HTML.note.style.display = "none";
            }
        });
    };

    const getStorage = () => {
        const updated = window.localStorage.getItem("arras_build_loader_storage");
        if (updated) {
            try { storage = JSON.parse(updated); } catch (e) { }
        }
    };

    const saveStorage = () => {
        window.localStorage.setItem("arras_build_loader_storage", JSON.stringify(storage));
    };

    const start = () => {
        getStorage();
        useStorageTheme();

        if (Array.isArray(storage.build)) {
            storage.build.forEach(b => addBuild(b, true));
        }

        openPanel();
        note();
        notify();
        listeningBuildKey();

        HTML.addBtn.addEventListener("click", () => {
            addBuild(HTML.buildInput.value);
            HTML.buildInput.value = '';
        });
        HTML.clearBtn.addEventListener("click", () => {
            HTML.buildInput.value = '';
        });
        HTML.themeInput.addEventListener("input", () => {
            listenThemeInput(HTML.themeInput);
        });
        HTML.themeInput.addEventListener("focus", () => {
            HTML.themeInput.select();
        });
        HTML.clearThemeBtn.addEventListener("click", () => {
            HTML.themeInput.value = defaultTheme;
            listenThemeInput(HTML.themeInput);
        });
        console.log('%c[Arras Build Loader] Ready.', 'color: #10B981; font-weight: bold;');
    };

    start();
})();
