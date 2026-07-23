const video = document.getElementById("camera");

navigator.mediaDevices
    .getUserMedia({

        video: {
            facingMode: "environment"
        }

    })

    .then(stream => {

        video.srcObject = stream;

    });