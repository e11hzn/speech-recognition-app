export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  const { children, ...restProps } = props;
  return (
    <button
      {...restProps}
      className="rounded-2xl my-4 mx-0 py-2 px-4 bg-amber-200 disabled:text-gray-400 cursor-pointer disabled:cursor-default"
    >
      {children}
    </button>
  )
};
