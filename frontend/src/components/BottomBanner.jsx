import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      <img
        alt="banner"
        className="w-full hidden md:block"
        src={assets.bottom_banner_image}
      />
      <img
        alt="banner"
        className="w-full md:hidden"
        src={assets.bottom_banner_image_sm}
      />
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            Tại sao chúng tôi là tốt nhất?
          </h1>
          <div className="space-y-4">
            {features.map((feature) => (
              <div className="flex items-center gap-4" key={feature.title}>
                <img
                  alt={feature.title}
                  className="md:w-11 w-9"
                  src={feature.icon}
                />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500/70 text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
