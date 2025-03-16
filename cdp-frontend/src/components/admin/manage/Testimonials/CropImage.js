export default function getCroppedImg(imageSrc, crop) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.crossOrigin = "anonymous"; // Avoid CORS issues
        image.src = imageSrc;

        image.onload = () => {
            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x, crop.y, crop.width, crop.height,
                0, 0, crop.width, crop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }

                const file = new File([blob], "croppedImage.jpeg", { type: "image/jpeg" });
                resolve(file);
            }, "image/jpeg");
        };

        image.onerror = reject;
    });
}
