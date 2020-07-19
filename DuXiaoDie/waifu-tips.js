/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

function loadWidget(config) {
    let { waifuPath, apiPath, cdnPath } = config;
    let useCDN = false, modelList;
    if (typeof cdnPath === "string") {
        useCDN = true;
        if (!cdnPath.endsWith("/")) cdnPath += "/";
    } else if (typeof apiPath === "string") {
        if (!apiPath.endsWith("/")) apiPath += "/";
    } else {
        console.error("Invalid initWidget argument!");
        return;
    }
    localStorage.removeItem("waifu-display");
    sessionStorage.removeItem("waifu-text");
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
            <div id="waifu-tips"></div>
            <canvas id="live2d" width="800" height="800"></canvas>
            <div id="waifu-tool">
                <span class="fa fa-lg fa-comment"></span>
                <span class="fa fa-lg fa-camera-retro"></span>
                <span class="fa fa-lg fa-info-circle"></span>
                <span class="fa fa-lg fa-times"></span>
            </div>
        </div>`);
    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
    }, 0);

    function randomSelection(obj) {
        return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
    }
    // 检测用户活动状态，并在空闲时显示消息
    let userAction = false,
        userActionTimer,
        messageTimer,
        messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
    window.addEventListener("mousemove", () => userAction = true);
    window.addEventListener("keydown", () => userAction = true);
    setInterval(() => {
        if (userAction) {
            userAction = false;
            clearInterval(userActionTimer);
            userActionTimer = null;
        } else if (!userActionTimer) {
            userActionTimer = setInterval(() => {
                showMessage(randomSelection(messageArray), 6000, 9);
            }, 20000);
        }
    }, 1000);

    (function registerEventListener() {
        document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
        document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
            showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
            Live2D.captureName = "photo.png";
            Live2D.captureFrame = true;
        });
        document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
            open("https://github.com/meetbill/butterfly");
        });
        document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
            localStorage.setItem("waifu-display", Date.now());
            showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu").style.display = "none";
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        });
        let devtools = () => {};
        console.log("%c", devtools);
        devtools.toString = () => {
            showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
        };
        window.addEventListener("copy", () => {
            showMessage("你都复制了些什么呀!", 6000, 9);
        });
        window.addEventListener("visibilitychange", () => {
            if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
        });
    })();

    // 第一次加载时输出的信息
    (function welcomeMessage() {
        let text;
        let now = new Date().getHours();
        if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
        else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
        else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
        else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
        else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
        else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
        else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
        else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
        showMessage(text, 7000, 8);
    })();

    function showHitokoto() {
        // 增加 hitokoto.cn 的 API
        fetch("https://v1.hitokoto.cn")
            .then(response => response.json())
            .then(result => {
                let text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
                showMessage(result.hitokoto, 6000, 9);
                setTimeout(() => {
                    showMessage(text, 4000, 9);
                }, 6000);
            });
    }

    function showMessage(text, timeout, priority) {
        if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
        if (messageTimer) {
            clearTimeout(messageTimer);
            messageTimer = null;
        }
        text = randomSelection(text);
        sessionStorage.setItem("waifu-text", priority);
        let tips = document.getElementById("waifu-tips");
        tips.innerHTML = text;
        tips.classList.add("waifu-tips-active");
        messageTimer = setTimeout(() => {
            sessionStorage.removeItem("waifu-text");
            tips.classList.remove("waifu-tips-active");
        }, timeout);
    }

    (function initModel() {
        let modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (modelId === null) {
            // 首次访问加载 指定模型 的 指定材质
            modelId = 5; // 模型 ID
            // 第一次访问时，随机生成一个 modelTexturesId
            modelTexturesId = Math.floor(Math.random()*10); // 材质 ID
        }
        loadModel(modelId, modelTexturesId);
        fetch(waifuPath)
            .then(response => response.json())
            .then(result => {
                window.addEventListener("mouseover", event => {
                    for (let tips of result.mouseover) {
                        if (!event.target.matches(tips.selector)) continue;
                        let text = randomSelection(tips.text);
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                        return;
                    }
                });
                window.addEventListener("click", event => {
                    for (let tips of result.click) {
                        if (!event.target.matches(tips.selector)) continue;
                        let text = randomSelection(tips.text);
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                        return;
                    }
                });
                result.seasons.forEach(tips => {
                    let now = new Date(),
                        after = tips.date.split("-")[0],
                        before = tips.date.split("-")[1] || after;
                    if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                        let text = randomSelection(tips.text);
                        text = text.replace("{year}", now.getFullYear());
                        //showMessage(text, 7000, true);
                        messageArray.push(text);
                    }
                });
            });
    })();

    async function loadModelList() {
        let response = await fetch(`${cdnPath}model_list.json`);
        let result = await response.json();
        modelList = result;
    }

    async function loadModel(modelId, modelTexturesId, message) {
        localStorage.setItem("modelId", modelId);
        localStorage.setItem("modelTexturesId", modelTexturesId);
        showMessage(message, 4000, 10);
        if (useCDN) {
            if (!modelList) await loadModelList();
            // 获取指定的看板娘
            let target = modelList.models[modelId][modelTexturesId]
            // 获取随机的看板娘
            //let target = randomSelection(modelList.models[modelId]);
            loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
        } else {
            // 仅获取服务端 nepnep 模型
            loadlive2d('live2d', 'static/DuXiaoDie/model/nepnep/index.json');
            //loadlive2d("live2d", `${apiPath}get/?id=${modelId}-${modelTexturesId}`);
        }
    }
}

function initWidget(config, apiPath) {
    if (typeof config === "string") {
        config = {
            waifuPath: config,
            apiPath
        };
    }

    // 当看板娘隐藏时，在网站边上重新打开看板娘的按钮
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
            <span>度小蝶</span>
        </div>`);
    let toggle = document.getElementById("waifu-toggle");

    // 添加按钮点击事件
    toggle.addEventListener("click", () => {
        // 点击按钮时，移除 "waifu-toggle-active" 样式
        toggle.classList.remove("waifu-toggle-active");
        if (toggle.getAttribute("first-time")) {
            loadWidget(config);
            toggle.removeAttribute("first-time");
        } else {
            localStorage.removeItem("waifu-display");
            document.getElementById("waifu").style.display = "";
            setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0;
            }, 0);
        }
    });

    // 当发现 localStorage 中有 waifu-display key 时，如果点击关闭的时间在一天以内，则添加 "waifu-toggle-active" 样式
    if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
        toggle.setAttribute("first-time", true);
        setTimeout(() => {
            toggle.classList.add("waifu-toggle-active");
        }, 0);
    } else {
        loadWidget(config);
    }
}
