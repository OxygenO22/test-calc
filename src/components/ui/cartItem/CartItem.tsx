
type PropsType = {
  key?: number
  name: string
  option: string | number;
  unit: string
}

export const CartItem = (props: PropsType) => {
  const { key, name, option, unit } = props;
  return (
    <li key={key}>
      <div>
        <p>
          {name} {option ? option : "-"} {unit}
        </p>
      </div>
    </li>
  );
};
