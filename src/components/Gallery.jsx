import { useState } from "react";
import { CarImage } from "./ui";

export default function Gallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const multiple = images.length > 1;

  function go(delta) {
    setIndex((value) => (value + delta + images.length) % images.length);
  }

  function onKeyDown(event) {
    if (!multiple) return;
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  return (
    <div
      role="region"
      aria-label={`${name} photos`}
      tabIndex={multiple ? 0 : undefined}
      onKeyDown={onKeyDown}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ember"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-sand">
        <CarImage
          key={current.src}
          src={current.src}
          alt={current.alt}
          priority
          className="fade-photo h-full w-full object-cover"
        />
        {multiple ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-lg text-ink shadow"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-lg text-ink shadow"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      {multiple ? (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show photo ${imageIndex + 1}`}
              aria-current={imageIndex === index}
              className={`overflow-hidden rounded-2xl border-2 ${imageIndex === index ? "border-ink" : "border-transparent"}`}
            >
              <CarImage src={image.src} alt="" className="aspect-[16/10] w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
