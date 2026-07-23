const video = document.getElementById("camera");
const button = document.getElementById("startAR");
const labels = document.querySelectorAll(".label");
const debug = document.getElementById("debug");

let startAngle = null;

button.addEventListener("click", async () => {
    try {
        // iPhoneの向きセンサーを許可
        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
            const permission =
                await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {
                alert("スマホの向きの利用が許可されませんでした。");
                return;
            }
        }

        // 背面カメラを開始
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }
            },
            audio: false
        });

        video.srcObject = stream;

        window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
        );

        button.style.display = "none";
    } catch (error) {
        console.error(error);
        alert("カメラまたは向きセンサーを開始できませんでした。");
    }
});

function handleOrientation(event) {
    // iPhoneではwebkitCompassHeadingの方が安定することがある
    let angle;

    if (typeof event.webkitCompassHeading === "number") {
        angle = event.webkitCompassHeading;
    } else {
        angle = event.alpha;
    }

    if (angle === null || angle === undefined) {
        debug.textContent = "角度：取得できていません";
        return;
    }

    debug.textContent = `角度：${Math.round(angle)}°`;

    if (startAngle === null) {
        startAngle = angle;
    }

    let difference = angle - startAngle;

    if (difference > 180) difference -= 360;
    if (difference < -180) difference += 360;

    labels.forEach((label, index) => {
        const movement = difference * 10;
        const depthScale = 1 - index * 0.15;

        label.style.transform =
            `translateX(${movement * depthScale}px)`;
    });
}