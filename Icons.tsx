import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    >
      {children}
    </svg>
  );
}

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <path d="M12 14.5v2" />
  </Base>
);

export const UnlockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7" />
    <path d="M12 14.5v2" />
  </Base>
);

export const KeyIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="7.5" cy="15.5" r="4" />
    <path d="M10.5 12.5 20 3" />
    <path d="m16 7 3 3" />
    <path d="m13.5 9.5 2 2" />
  </Base>
);

export const KeyholeIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="10" r="2.2" />
    <path d="M11 12l-1 5h4l-1-5" />
  </Base>
);

export const BookIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 6.5C10.5 5 8.3 4.5 4 4.5v13c4.3 0 6.5.5 8 2 1.5-1.5 3.700-2 8-2v-13c-4.300 0-6.500.5-8 2Z" />
    <path d="M12 6.500v13" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base strokeWidth={2.6} {...p}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.500 12h15" />
    <path d="m13.500 6 6 6-6 6" />
  </Base>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M19.500 12h-15" />
    <path d="m10.500 6-6 6 6 6" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const DotsIcon = (p: IconProps) => (
  <Base strokeWidth={3} {...p}>
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </Base>
);

export const RefreshIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12a8 8 0 0 1 13.700-5.600L20 8.500" />
    <path d="M20 4v4.500h-4.500" />
    <path d="M20 12a8 8 0 0 1-13.700 5.600L4 15.500" />
    <path d="M4 20v-4.500h4.500" />
  </Base>
);

export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="10.500" cy="10.500" r="6" />
    <path d="m15 15 5 5" />
  </Base>
);

export const BackspaceIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7Z" />
    <path d="m12 9.500 5 5M17 9.500l-5 5" />
  </Base>
);

export const CopyIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="8.500" y="8.500" width="11" height="11" rx="2" />
    <path d="M15.500 8.500v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
  </Base>
);

export const FileIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.500 3.500h7l4.500 4.500v12a.500.500 0 0 1-.500.500h-11a.500.500 0 0 1-.500-.500v-16a.500.500 0 0 1 .500-.500Z" />
    <path d="M13.500 3.500V8H18" />
    <path d="M9 12.500h6M9 16h6" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3.500 2.600 5.400 5.900.800-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.800L12 3.500Z" />
  </Base>
);
