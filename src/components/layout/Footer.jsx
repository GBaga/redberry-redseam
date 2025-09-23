// components/footer/Footer.jsx
import FooterLinks from "./FooterLinks";
import SocialNetworks from "./SocialNetworks";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto w-full max-w-[1920px] sm:px-[40px] md:px-[70px] lg:px-[100px] xl:px-[120px]">
        <div className=" px-4 py-6 flex items-center justify-center md:justify-between gap-5 sm:gap-5">
          <div className="w-full flex flex-col items-center gap-8 sm:gap-7 md:flex-row md:justify-between">
            <SocialNetworks />
            <FooterLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
