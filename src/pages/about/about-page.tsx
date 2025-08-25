import { SparklesIcon } from "@/components/ui/icons";

import { Button } from "@/components/ui/button";

const data = {
  icon: <SparklesIcon size={24} />,
  preheading: "OpenLLM",
  heading: "Make access to AI Free and Open",
  description: "We created OpenLLM to make access to AI Free and Open for everyone.",
  button: {
    text: "Contact Us",
    url: "/contact",
  },
  imageSrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  imageAlt: "placeholder",
}

export function AboutPage() {
  return (
    <section className="overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] p-16 md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              {data.icon}
            </span>
            <h2 className="mx-auto max-w-5xl text-center text-lg font-medium text-balance md:text-2xl text-muted-foreground">
              {data.preheading}
            </h2>
            <h2 className="mx-auto max-w-5xl text-center text-3xl font-medium text-balance md:text-6xl">
              {data.heading}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
              {data.description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
              <Button size="lg" asChild>
                <a href={data.button.url}>
                  {data.button.text}
                </a>
              </Button>
            </div>
          </div>
          <img
            src={data.imageSrc}
            alt={data.imageAlt}
            className="mx-auto h-full max-h-[524px] w-full max-w-5xl rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};
