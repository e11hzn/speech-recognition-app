export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  const { children, ...restProps } = props;
  return (
    <button
      {...restProps}
      className="rounded-2xl py-2 px-4 bg-amber-200 disabled:text-gray-400 cursor-pointer disabled:cursor-default"
    >
      {children}
    </button>
  )
};
