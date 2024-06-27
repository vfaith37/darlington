"use client";

import React, { useState, useRef, MutableRefObject } from "react";
import Image from "next/image";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Define the image data interface
export interface ImageData {
  id: number;
  src: string;
  title: string;
  desc: string;
}

// Define the image data
export const images: ImageData[] = [
  {
    id: 1,
    src: "/Blackcoffee.png",
    title: "Black Coffee",
    desc: "Black coffee is a beverage made from roasted coffee beans...",
  },
  {
    id: 2,
    src: "/Cappuccino.jpg",
    title: "Cappuccino",
    desc: "A cappuccino is an espresso-based coffee drink...",
  },
  {
    id: 3,
    src: "/Espresso.png",
    title: "Espresso",
    desc: "Espresso is a concentrated form of coffee...",
  },
  {
    id: 4,
    src: "/Latte.jpg",
    title: "Latte",
    desc: "A latte or caffè latte is a milk coffee...",
  },
  {
    id: 5,
    src: "/Macchiato.jpg",
    title: "Macchiato",
    desc: "Caffè macchiato, sometimes called espresso macchiato...",
  },
];

// Thumbnail navigation plugin
const ThumbnailPlugin = (
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin => {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }

    function addActive(idx: number) {
      if (slider.slides[idx]) {
        slider.slides[idx].classList.add("active");
      }
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
};

const CoffeeSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 1,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex w-full max-w-6xl relative">
        <div ref={sliderRef} className="keen-slider relative w-[75%] h-[500px]">
          {images.map((image) => (
            <div
              key={image.id}
              className="keen-slider__slide flex justify-center items-center"
            >
              <div className="max-w-md">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="w-full h-full object-cover object-center rounded-md shadow-md"
                />
                <div className="bg-white shadow-lg p-4 mt-4 rounded-md">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {image.title}
                  </h2>
                  <p className="text-gray-600">{image.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <div
            ref={thumbnailRef}
            className="keen-slider max-w-[200px] ml-4 h-[200px]"
          >
            {images.slice(1).map((image, idx) => (
              <div
                key={image.id}
                className={`keen-slider__slide cursor-pointer ${
                  currentSlide ===
                  instanceRef.current?.track.details.slides.length! - 1
                    ? "hidden"
                    : ""
                }`}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  width={150}
                  height={100}
                  className="rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        {loaded && (
          <div className="mt-6 flex justify-between items-center w-[300px]">
            <Arrow
              left
              onClick={() => instanceRef.current?.prev()}
              disabled={currentSlide === 0}
            />
            <Arrow
              onClick={() => instanceRef.current?.next()}
              disabled={
                currentSlide ===
                instanceRef.current?.track.details.slides.length! - 1
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeSlider;

const Arrow = ({
  left,
  onClick,
  disabled,
}: {
  left?: boolean;
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full shadow-md ${disabled ? "hidden" : ""}`}
    disabled={disabled}
  >
    <svg
      className={`w-6 h-6 ${left ? "transform rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);
