import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
);

export const Pencil = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16z" />
  </Icon>
);

export const Sparkle = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7-5.6-1.9L10.1 9z" />
  </Icon>
);

export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
);

export const Images = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
    <path d="m3.5 16 4.6-4.6a1.6 1.6 0 0 1 2.3 0L16 17M14 14.5l1.4-1.4a1.6 1.6 0 0 1 2.3 0l2.8 2.8" />
    <circle cx="15.5" cy="9.5" r="1.4" />
  </Icon>
);

export const Flash = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />
  </Icon>
);

export const ScanFrame = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M10 8.5h4M10.5 8.5v1.6c0 .5-.3.9-.7 1.2-.5.3-.8.9-.8 1.5v3.7c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-3.7c0-.6-.3-1.2-.8-1.5-.4-.3-.7-.7-.7-1.2V8.5" />
  </Icon>
);

export const Grid = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Icon>
);

export const Camera = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.7l1.4-2h4.8l1.4 2h1.7A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
    <circle cx="12" cy="12.5" r="3.5" />
  </Icon>
);

export const Home = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  </Icon>
);

export const Chat = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 11.5c0 4-3.6 7-8 7-1.2 0-2.3-.2-3.3-.6L4 19l1.2-3.6A6.6 6.6 0 0 1 4 11.5c0-4 3.6-7 8-7s8 3 8 7z" />
  </Icon>
);

export const Utensils = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.2-3.5 3.6-3.5 6.5V14H17" />
  </Icon>
);

export const WineBottle = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 3h4M10.5 3v4.2c0 .8-.4 1.5-1 2A4.5 4.5 0 0 0 8 12.6V20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7.4c0-1.3-.6-2.5-1.5-3.4-.6-.5-1-1.2-1-2V3" />
    <path d="M8 14h8" />
  </Icon>
);

export const WineGlass = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7.5 3h9l.4 4.3a4.9 4.9 0 0 1-9.8 0zM12 12.2V20M8.5 20.5h7" />
  </Icon>
);

export const Sort = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 5v14M5 16l3 3 3-3M16 19V5M13 8l3-3 3 3" />
  </Icon>
);

export function StatusIcons() {
  return (
    <>
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
        <rect x="0" y="7.5" width="3" height="4.5" rx="0.9" />
        <rect x="5" y="5" width="3" height="7" rx="0.9" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.9" />
        <rect x="15" y="0" width="3" height="12" rx="0.9" />
      </svg>
      <svg width="16" height="12" viewBox="0 -0.5 16 12" aria-hidden="true">
        <path d="M0.22 2.95A11.2 11.2 0 0 1 15.78 2.95L14.26 4.53A9 9 0 0 0 1.74 4.53Z" />
        <path d="M2.86 5.68A7.4 7.4 0 0 1 13.14 5.68L11.61 7.26A5.2 5.2 0 0 0 4.39 7.26Z" />
        <path d="M8 11L5.5 8.41A3.6 3.6 0 0 1 10.5 8.41Z" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2.2" />
        <path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1z" fillOpacity="0.45" />
      </svg>
    </>
  );
}
