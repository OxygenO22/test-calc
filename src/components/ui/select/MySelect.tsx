import { ChangeEvent } from 'react'

type PropsType = {
  val: string | number;
  data: string[];
  setValue: (e: any) => void;
};
export const MySelect = (props: PropsType) => {
  const {val, data, setValue} = props;
  return (
    <select
      value={val}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        setValue(e.target.value)
      }
    >
      <option value="">Choose option</option>
      {data &&
        data.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
    </select>
  )
}
