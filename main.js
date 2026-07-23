const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "environment"
    }
})
    .then(stream => {
        video.srcObject = stream;
    });

const button = document.getElementById("startAR");

button.addEventListener("click", async () => {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        const permission = await DeviceOrientationEvent.requestPermission();

        if (permission === "granted") {

            window.addEventListener("deviceorientation", (event) => {

                console.log(event.alpha);

            });

            button.style.display = "none";
        }

    }

});