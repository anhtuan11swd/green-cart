import { assets } from "../assets/assets";

const MainBanner = () => {
  return (
    <div className="relative">
      <img
        alt="banner"
        className="hidden md:block w-full"
        src={assets.main_banner_bg}
      />
      <img
        alt="banner"
        className="md:hidden w-full"
        src={assets.main_banner_bg_sm}
      />
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center items-center md:items-start px-4 pb-24 md:pb-0 md:pl-18 lg:pl-24">
        <h1 className="max-w-72 md:max-w-80 lg:max-w-105 font-bold text-3xl md:text-4xl lg:text-5xl md:text-left text-center leading-tight lg:leading-15">
          Sự Tươi Ngon Bạn Có Thể Tin Cậy, Tiết Kiệm Bạn Sẽ Yêu Thích!
        </h1>
        <div className="flex items-center mt-6 font-medium">
          <a
            className="group flex items-center gap-2 bg-primary hover:bg-primary-dull px-7 md:px-9 py-3 rounded text-white transition cursor-pointer"
            data-discover="true"
            href="/products"
          >
            Mua ngay
            <img
              alt="arrow"
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
            />
          </a>
          <a
            className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
            data-discover="true"
            href="/deals"
          >
            Khám phá ưu đãi
            <img
              alt="arrow"
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
