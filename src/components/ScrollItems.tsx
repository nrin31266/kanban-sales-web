import { SubProductResponse } from "@/model/SubProduct";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  items: SubProductResponse[];
  onClick: (value: SubProductResponse) => void;
}

const ScrollItems = (props: Props) => {
  const { items, onClick } = props;
  const [elements, setElements] = useState<any[]>([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items) {
      const groups: any[] = [];
      items.forEach((item) => {
        const listImg: string[] = item.images;
        if (listImg) {
          listImg.forEach((img) => {
            groups.push({ item: item, imgUrl: img });
          });
        }
      });
      for (let i = 0; i < 7; i++) {
        groups.push({
          item: undefined,
          imgUrl:
            "https://assets.mycast.io/actor_images/actor-lee-ji-eun-342899_large.jpg?1641835312",
        });
      }
      setElements(groups);
    }
  }, [items]);

  const scrollGallery = (offset: number) => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += offset;
      checkScrollPosition();
    }
  };

  const scrollLeft = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft -= 300;
      checkScrollPosition();
    }
  };

  const scrollRight = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += 300;
      checkScrollPosition();
    }
  };

  const checkScrollPosition = () => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition(); // Kiểm tra vị trí cuộn ngay lập tức khi render lần đầu tiên
    }
    return () => {
      if (gallery) {
        gallery.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [elements]); // Thêm 'elements' vào dependency để cập nhật sau khi thiết lập xong
  const handleWheel = (e: React.WheelEvent) => {
    scrollGallery(e.deltaY > 0 ? 300 : -300);
  };
  return (
    <div className="sub-product-gallery-wrap">
      {!isAtStart && (
        <button id="btn-back" className="btn" onClick={scrollLeft}>
          <FontAwesomeIcon icon={faAngleLeft} className="btn-icon" />
        </button>
      )}
      <div className="sub-product-gallery" ref={galleryRef} onWheel={handleWheel}>
        {elements.length > 0 &&
          elements.map((group, index) => (
            <a key={"image" + index} onClick={() => onClick(group.item)}>
              <div>
                <span>
                  <img
                    style={{ objectFit: "cover" }}
                    width={100}
                    height={110}
                    src={group.imgUrl}
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
