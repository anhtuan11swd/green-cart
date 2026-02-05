import { assets, footerLinks } from "../assets/assets.js";

const Footer = () => {
  return (
    <div className="bg-primary/10 mt-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex md:flex-row flex-col justify-between items-start gap-10 py-10 border-gray-500/30 border-b text-gray-500">
        <div>
          <img alt="logo" className="w-34 md:w-32" src={assets.logo} />
          <p className="mt-6 max-w-[410px]">
            Chúng tôi giao hàng tạp hóa và đồ ăn nhẹ tươi ngon trực tiếp đến cửa
            nhà bạn. Được tin tưởng bởi hàng nghìn khách hàng, chúng tôi mong
            muốn làm cho trải nghiệm mua sắm của bạn trở nên đơn giản và giá cả
            phải chăng.
          </p>
        </div>
        <div className="flex justify-start gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 md:mb-5 font-semibold text-gray-900 text-base">
                {section.title}
              </h2>
              <ul className="space-y-1 text-sm">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.text}`}>
                    <a className="hover:underline transition" href={link.url}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-sm md:text-base text-center">
        Bản quyền 2026 © Trần Anh Tuấn Tất cả quyền được bảo lưu.
      </p>
    </div>
  );
};

export default Footer;
