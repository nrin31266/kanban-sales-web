import { CategoryResponse } from "@/model/CategoryModel";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  items: CategoryResponse[];
  onClick: (value: CategoryResponse) => void;
}

const ScrollCategories = (props: Props) => {
  const { items, onClick } = props;
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (offset: number) => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += offset;
      checkScrollPosition();
    }
  };

  const scrollLeft = () => scrollGallery(-600);
  const scrollRight = () => scrollGallery(600);

  const checkScrollPosition = () => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    const gallery = galleryRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Ngăn cuộn theo trục y
      const scrollAmount = e.deltaY >= 40 ? 350 : e.deltaY <= -40 ? -350 : 0;
      if (scrollAmount !== 0) {
        scrollGallery(scrollAmount);
      }
    };

    if (gallery) {
      gallery.addEventListener("wheel", handleWheel, { passive: false });
      gallery.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (gallery) {
        gallery.removeEventListener("wheel", handleWheel);
        gallery.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [items]);

  return (
    <div className="gallery-wrap p-2">
      {!isAtStart && (
        <button
          style={{ marginBottom: "30px" }}
          id="btn-back"
          className="btn"
          onClick={scrollLeft}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="btn-icon" />
        </button>
      )}
      <div className="category-gallery" ref={galleryRef}>
        {items.length > 0 &&
          items.map((item, index) => (
            <a className="category-gallery-item" key={"image" + index} onClick={() => onClick(item)}>
              <div>
                  <span>
                    <img
                      style={{ objectFit: "cover" }}
                      src={
                        item.imageUrl ??
                        "https://assets.mycast.io/actor_images/actor-lee-ji-eun-342899_large.jpg?1641835312"
                      }
                      alt=""
                    />
                  </span>
                </div>
                <div className="category-content">
                  <span>{item.name}</span>
                </div>
            </a>
          ))}
      </div>
      {!isAtEnd && (
        <button
          style={{ marginBottom: "30px" }}
          id="btn-next"
          className="btn"
          onClick={scrollRight}
        >
          <FontAwesomeIcon icon={faAngleRight} className="btn-icon" />
        </button>
      )}
    </div>
  );
};

export default ScrollCategories;
