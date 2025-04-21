import { ChangeEvent } from 'react'
import { Config, Data } from '../../api/api';


type PropsType = {
  val: string | number;
  data: Config[] | Data[];
  setValue: (e: any) => void;
  type: string
  optionType: 'pipe' | 'list'
};
export const MyCommonSelect = (props: PropsType) => {
  const { val, data, setValue, type, optionType } = props;
  return (
    <select
      disabled={type !== optionType}
      value={val}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => setValue(e.target.value)}
    >
      <option value="">Choose option</option>
      {data?.map((item) => (
        <option key={item.id} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  );
};
