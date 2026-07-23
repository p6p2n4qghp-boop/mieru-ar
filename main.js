/*
    ==========================================
    展示内容は、基本的にこの部分だけ変更します
    ==========================================
*/

const spots = [
    {
        number: "01",
        title: "個展",
        english: "STUDENT EXHIBITION",
        description:
            "学生による作品展示を想定した仮のサインです。展示内容が決まったら、この文章を変更します。"
    },
    {
        number: "02",
        title: "染色ワークショップ",
        english: "DYEING WORKSHOP",
        description:
            "橋の下で行われる体験型ワークショップを想定しています。日時や参加方法などを掲載できます。"
    },
    {
        number: "03",
        title: "休憩",
        english: "REST AREA",
        description:
            "川や橋の風景を眺めながら過ごせる休憩スペースを想定しています。"
    }
];


/*
    ==========================================
    ARラベルの描画
    ==========================================
*/

function drawLabel(canvas, spot) {
    const scale = 2;

    canvas.width = 1000 * scale;
    canvas.height = 340 * scale;

    const context = canvas.getContext("2d");

    context.scale(scale, scale);
    context.clearRect(0, 0, 1000, 340);

    // 背景
    context.fillStyle = "#ffffff";
    context.fillRect(10, 10, 980, 320);

    // 外枠
    context.strokeStyle = "#111111";
    context.lineWidth = 5;
    context.strokeRect(10, 10, 980, 320);

    // 左側の黒い四角
    context.fillStyle = "#111111";
    context.fillRect(70, 105, 86, 86);

    // 番号
    context.fillStyle = "#111111";
    context.font = "500 34px sans-serif";
    context.textBaseline = "middle";
    context.fillText(spot.number, 70, 63);

    // 日本語タイトル
    context.font =
        '600 70px -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif';

    context.fillText(spot.title, 205, 142);

    // 英語タイトル
    context.font =
        '400 29px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';

    context.letterSpacing = "3px";
    context.fillText(spot.english, 205, 229);

    // 下部ライン
    context.fillRect(205, 276, 700, 4);
}


/*
    ==========================================
    CanvasをAR空間の画像として使用
    ==========================================
*/

AFRAME.registerComponent("canvas-texture", {
    schema: {
        canvas: {
            type: "selector"
        }
    },

    init: function () {
        this.texture = null;

        this.refresh = this.refresh.bind(this);

        this.el.addEventListener("object3dset", this.refresh);

        window.setTimeout(this.refresh, 300);
    },

    refresh: function () {
        const canvas = this.data.canvas;
        const mesh = this.el.getObject3D("mesh");

        if (!canvas || !mesh) {
            return;
        }

        if (!this.texture) {
            this.texture = new THREE.CanvasTexture(canvas);

            this.texture.minFilter = THREE.LinearFilter;
            this.texture.magFilter = THREE.LinearFilter;
        }

        this.texture.needsUpdate = true;

        mesh.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        mesh.material.needsUpdate = true;
    }
});


/*
    ==========================================
    サインをタップしたときの処理
    ==========================================
*/

AFRAME.registerComponent("spot-card", {
    init: function () {
        this.el.addEventListener("click", () => {
            const spotIndex = Number(this.el.dataset.spot);

            openCard(spotIndex);
        });
    }
});


/*
    ==========================================
    情報カード
    ==========================================
*/

function openCard(index) {
    const spot = spots[index];
    const modal = document.getElementById("modal");

    if (!spot || !modal) {
        return;
    }

    document.getElementById("card-number").textContent =
        spot.number;

    document.getElementById("card-title").textContent =
        spot.title;

    document.getElementById("card-english").textContent =
        spot.english;

    document.getElementById("card-description").textContent =
        spot.description;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
}


function closeCard() {
    const modal = document.getElementById("modal");

    if (!modal) {
        return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
}


/*
    ==========================================
    ページ読み込み後
    ==========================================
*/

window.addEventListener("DOMContentLoaded", () => {
    spots.forEach((spot, index) => {
        const canvas =
            document.getElementById(`label-${index}`);

        if (!canvas) {
            return;
        }

        drawLabel(canvas, spot);
    });

    // Canvasの描画内容をテクスチャへ反映
    window.setTimeout(() => {
        document
            .querySelectorAll("[canvas-texture]")
            .forEach((entity) => {
                const component =
                    entity.components["canvas-texture"];

                if (component) {
                    component.refresh();
                }
            });
    }, 500);

    const modal =
        document.getElementById("modal");

    const closeButton =
        document.getElementById("close-button");

    const modalBackdrop =
        document.getElementById("modal-backdrop");

    closeButton.addEventListener("click", closeCard);
    modalBackdrop.addEventListener("click", closeCard);

    // マーカー認識時の案内
    const marker =
        document.getElementById("hiro-marker");

    const guide =
        document.getElementById("guide");

    marker.addEventListener("markerFound", () => {
        guide.textContent =
            "サインをタップすると情報が開きます";

        guide.classList.add("marker-visible");
    });

    marker.addEventListener("markerLost", () => {
        guide.textContent =
            "HIROマーカーを映してください";

        guide.classList.remove("marker-visible");

        closeCard();
    });
});