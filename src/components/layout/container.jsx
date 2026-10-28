import { cn } from "../../lib/utils";

/**
 * Standardized maximum width container with 4pt rhythmic responsive horizontal padding.
 * 
 * @param {Object} props
 * @param {React.ElementType} [props.as='div'] - HTML element to render
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Child elements
 */
export function Container({ as: Component = "div", className, children, ...props }) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
