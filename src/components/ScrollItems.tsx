import { ProductResponse } from "@/model/ProductModel";
import { SubProductResponse } from "@/model/SubProduct";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  items: SubProductResponse[];
  product?: ProductResponse;
  onClick: (value: SubProductResponse) => void;
  onPhotoSelected: (photoUrl: string) => void;
}

const ScrollItems = (props: Props) => {
  const { items, onClick, product, onPhotoSelected } = props;
  const [elements, setElements] = useState<any[]>([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const groups: any[] = [];
    if (product) {
      product.images.forEach((img) => {
        groups.push({ item: undefined, imgUrlSelected: img });
      });
    }
    // if (items) {
    //   items.forEach((item) => {
    //     const listImg: string[] = item.images;
    //     if (listImg) {
    //       listImg.forEach((img) => {
    //         groups.push({ item: { ...item }, imgUrlSelected: img });
    //       });
    //     }
    //   });
    //   // for (let i = 0; i < 7; i++) {
    //   //   groups.push({
    //   //     item: undefined,
    //   //     imgUrl:
    //   //       "https://assets.mycast.io/actor_images/actor-lee-ji-eun-342899_large.jpg?1641835312",
    //   //   });
    //   // }
    // }
    setElements(groups);
  }, [items]);

  useEffect(() => {
    console.log(elements);
  }, [elements]);

  const scrollGallery = (offset: number) => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += offset;
      checkScrollPosition();
    }
  };

  const scrollLeft = () => scrollGallery(-300);
  const scrollRight = () => scrollGallery(300);

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
  }, [elements]);

  return (
    <div className="gallery-wrap">
      {!isAtStart && (
        <button id="btn-back" className="btn" onClick={scrollLeft}>
          <FontAwesomeIcon icon={faAngleLeft} className="btn-icon" />
        </button>
      )}
      <div className="sub-product-gallery" ref={galleryRef}>
        {elements.length > 0 &&
          elements.map((item, index) => (
            <a
              key={"image" + index}
              onClick={() => {
                onPhotoSelected(item.imgUrlSelected);
                item.item && onClick(item.item);
              }}
            >
              <div className="image">
                <span>
                  <img
                    style={{ objectFit: "cover" }}
                    width={"80px"}
                    height={"90px"}
                    src={item.imgUrlSelected}
                    alt=""
                  />
                </span>
              </div>
            </a>
          ))}
      </div>
      {!isAtEnd && (
        <button id="btn-next" className="btn" onClick={scrollRight}>
          <FontAwesomeIcon icon={faAngleRight} className="btn-icon" />
        </button>
      )}
    </div>
  );
};

export default ScrollItems;
