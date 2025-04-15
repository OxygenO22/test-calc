
type PropsType = {
  name: string
  option: string | number;
  unit: string
}

export const CartItem = (props: PropsType) => {
  const { name, option, unit } = props;
  return (
    <li>
      <div>
        <p>
          {name} {option ? option : "-"} {unit}
        </p>
      </div>
    </li>
  );
};
