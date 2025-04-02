import Button from "@codegouvfr/react-dsfr/Button";
import Image from "next/image";

export const DEFAULT_BANNER_IMAGE =
  "/candidat/images/image-home-character-young-man-glasses.png";
export const DEFAULT_BANNER_IMAGE_ALT = "Homme portant des lunettes";

export interface BannerActionButton {
  href: string;
  label: string;
  testId?: string;
}

export interface BaseBannerProps {
  content: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  actionButton?: BannerActionButton;
  testId?: string;
}

const BannerImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="min-w-[167px] hidden lg:flex relative -left-3">
    <Image src={src} width={167} height={168} alt={alt} />
  </div>
);

const ActionButton = ({ href, label, testId }: BannerActionButton) => (
  <Button
    data-test={testId}
    linkProps={{
      href,
    }}
  >
    {label}
  </Button>
);

export const BaseBanner = ({
  content,
  imageSrc = DEFAULT_BANNER_IMAGE,
  imageAlt = DEFAULT_BANNER_IMAGE_ALT,
  actionButton,
  testId,
}: BaseBannerProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex bg-white items-center border-b-[4px] border-b-[#FFA180] shadow-[0px_6px_18px_0px_rgba(0,0,18,0.16)] py-8 px-8 lg:ml-3 lg:pl-0 mt-32 lg:mt-16 lg:h-[110px]">
        <BannerImage src={imageSrc} alt={imageAlt} />
        <p className="my-0 lg:ml-4 text-justify" data-test={testId}>
          {content}
        </p>
      </div>
      {actionButton && (
        <div className="self-end mt-2">
          <ActionButton {...actionButton} />
        </div>
      )}
    </div>
  );
};
