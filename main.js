const video = document.getElementById("camera");
const button = document.getElementById("startAR");
const labels = document.querySelectorAll(".label");

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

        // 背面カメラを起動
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment"
                }
            },
            audio: false
        });

        video.srcObject = stream;

        // スマホの向きを取得
        window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
        );

        button.style.display = "none";
    } catch (error) {
        console.error(error);
        alert(
            "カメラまたはスマホの向きを利用できませんでした。Safariの設定を確認してください。"
        );
    }
});

function handleOrientation(event) {
    if (event.alpha === null) return;

    // AR開始時の向きを基準にする
    if (startAngle === null) {
        startAngle = event.alpha;
    }

    let difference = event.alpha - startAngle;

    // 0度と360度をまたいだ際の補正
    if (difference > 180) difference -= 360;
    if (difference < -180) difference += 360;

    // スマホを回した方向に合わせてラベルを移動
    labels.forEach((label, index) => {
        const depth = 1 - index * 0.15;
        const movement = difference * 4 * depth;

        label.style.transform =
            `translateX(${movement}px)`;
    });
}