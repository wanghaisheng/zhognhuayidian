declare module '@/pages/*' {
  import type { RouteComponent } from '@tanstack/react-router';
  const Component: RouteComponent;
  export default Component;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
