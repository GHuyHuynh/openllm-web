import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import { GithubIcon, LinkedinIcon } from "lucide-react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    imageSrc: string;
    name: string;
    github: string;
    linkedin: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          to={item?.github}
          key={item?.github}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)} 
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={item.imageSrc} alt={item.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardTitle className="mb-6">{item.name}</CardTitle>
              <div className="flex gap-6 justify-center">
                <a href={item.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200 p-2 rounded-lg hover:bg-zinc-800/50">
                  <GithubIcon size={20} />
                </a>
                <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200 p-2 rounded-lg hover:bg-zinc-800/50">
                  <LinkedinIcon size={20} />
                </a>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-semibold tracking-wide text-lg", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
