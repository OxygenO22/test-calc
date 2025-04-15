
import { Config } from '../../calculator/Calculator';

type PropsType = {
  name: string
  data: Config[];
  value: number
  setValue: (e: any) => void  
}

export const MyInput = (props: PropsType) => {
  const {name, data, value, setValue} = props
  return (
    <>
      {data?.map((item) => (
        <label key={item.id}>
          {name}
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            step={item.step}
            min={item.min}
            max={item.max}
          />
          {item.max && +value > +item.max && (
            <span>Длина не должна быть больше {item.max}</span>
          )}
          {item.min && +value < +item.min && (
            <span>Длина не должна быть меньше {item.min}</span>
          )}
        </label>
      ))}
    </>
  );
}
