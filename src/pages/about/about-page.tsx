import { SparklesIcon } from "@/components/ui/icons";
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/hover-effect";
import tobiImg from "@/assets/tobi.jpeg";
import huyImg from "@/assets/huy.jpeg";
import hassanImg from "@/assets/hassan.jpeg";
import vanshImg from "@/assets/vansh.jpeg";
import eduardImg from "@/assets/eduard.jpeg";

const data = {
  icon: <SparklesIcon size={24} />,
  preheading: "OpenLLM",
  heading: "Make access to AI Free and Open",
  description: "We created OpenLLM to make access to AI Free and Open for everyone. By hosting open source models at Dalhousie University, Halifax, Nova Scotia, Canada, we are able to provide a free and open access to AI for everyone.",
  button: {
    text: "Contact Us",
    url: "/contact",
  },
}

export const contributors = [
  {
    imageSrc: tobiImg,
    name: "Tobi Onibudo",
    github: "https://github.com/TobiOnibudo",
    linkedin: "https://www.linkedin.com/in/tobi-onibudo/",
  },
  {
    imageSrc: huyImg,
    name: "Huy Huynh",
    github: "https://github.com/ghuyhuynh",
    linkedin: "https://www.linkedin.com/in/huyghuynh/",
  },
  {
    imageSrc: hassanImg,
    name: "Hassan Chowdhry",
    github: "https://github.com/HassanChowdhry",
    linkedin: "https://www.linkedin.com/in/hassanchowdhry/",
  },
  {
    imageSrc: vanshImg,
    name: "Vansh Sood",
    github: "https://github.com/Vansh983",
    linkedin: "https://www.linkedin.com/in/vanshsood/",
  },
  {
    imageSrc: eduardImg,
    name: "Eduard Kakosyan",
    github: "https://github.com/EduardKakosyan",
    linkedin: "https://www.linkedin.com/in/eduard-kakosyan/",
  },
]

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden py-32">
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
                <a onClick={() => navigate(data.button.url)}>
                  {data.button.text}
                </a>
              </Button>
            </div>
          </div>
          <h2 className="mx-auto max-w-5xl text-center text-xl font-medium text-balance md:text-3xl">Contributors</h2>
          <HoverEffect items={contributors} />
        </div>
      </div>
    </section>
  );
};
