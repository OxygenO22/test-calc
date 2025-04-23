import { useEffect, useState } from 'react';
import s from './Calculator.module.scss'
import { MySelect } from '../ui/select/MySelect';
import { MyCommonSelect } from '../ui/select/MyCommonSelect';
import { MyInput } from '../ui/input/MyInput';
import { CartItem } from '../ui/cartItem/CartItem';
import { Config, Data, dateApi } from '../api/api';

enum TypeEnums {
  list = "list",
  pipe = "pipe",
  fix = "fix",
}
export const Calculator = () => {
  const [data, setData] = useState<Data[]>([]);
  const [config, setConfig] = useState<Config[]>([]);
  const [type, setType] = useState('');
  const [width, setWidth] = useState<number>(5);
  const [length, setLength] = useState<number>(5);
  const [frame, setFrame] = useState('');
  const [listType, setListType] = useState("");
  const [pipeType, setPipeType] = useState("");
  const listLength = 1;
  const roofSquare = Math.ceil(width * length);
  let listSquare;
  let listTotalPrice;
  let listQuantity;
  let pipeWidth;
  let pipeQuantityByWidth;
  let pipeQuantityByLength;
  let pipeSumByWidth;
  let pipeSumByLength;
  let pipeTotalLength;
  let pipeTotalPrice;
  let fixTotalPrice;
  let roofTotalPrice;
  
  useEffect(() => {
    dateApi.getMaterials().then((res) => setData(res.data));
    dateApi.getConfig().then((res) => setConfig(res.data));
  }, []);

  // Data

  const getTypes = [
    ...new Set(data?.map((item) => item.type).filter(item => item !== 'fix')),
  ];

  const getTypeFromData = (type: string) => {
    return data.filter((item) => item.type === type);
  };

  const getCurrentListWidth = getTypeFromData(TypeEnums.list)
    .filter((item) => item.name === listType)
    .map((item) => item.width)[0];

  const getCurrentListMaterial = getTypeFromData(TypeEnums.list)
    .filter((item) => item.name === listType)
    .map((item) => item.material)[0];

  getCurrentListWidth
    ? (listSquare = listLength * getCurrentListWidth)
    : "нет данных";

  listSquare ? (listQuantity = Math.ceil(roofSquare / listSquare)) : "нет данных";

  const getCurrentPipeWidth = getTypeFromData(TypeEnums.pipe)
    ?.filter((item) => item.name === pipeType)
    .map((item) => item.width)[0];

  getCurrentPipeWidth ? pipeWidth = getCurrentPipeWidth / 1000 : "нет данных";

  console.log(getCurrentPipeWidth);

    // Config

  const getConfigWidth = config.filter((item) => item.key === "width");
  const getConfigLength = config.filter(item => item.key === 'length')
  const getConfigFrame = config.filter(item => item.type === 'frame')

  const getConfigFixValue = config
      .filter(
        (item) => item.type === "fix" && item.key === getCurrentListMaterial
      )
      .map((item) => item.value)[0]

  const fixValueOnSquare = getConfigFixValue ? roofSquare * getConfigFixValue : "нет данных";
  const getFrameStep = config.filter((item) => item.name === frame).map(item => item.step)[0];

  // Pipe length

  if (width && getCurrentListWidth && getFrameStep) {
    pipeQuantityByWidth =
      +getCurrentListWidth <= +getFrameStep ? width / +getCurrentListWidth : width / +getFrameStep;
    pipeQuantityByWidth === Math.floor(pipeQuantityByWidth)
      ? (pipeSumByWidth = (pipeQuantityByWidth + 1) * width)
      : (pipeSumByWidth = (Math.floor(pipeQuantityByWidth) + 2) * width);
  } 

  if (length && listLength) {
    pipeQuantityByLength = length / +listLength;
    pipeQuantityByLength === Math.floor(pipeQuantityByLength)
      ? (pipeSumByLength = (pipeQuantityByLength + 1) * length)
      : (pipeSumByLength =
          (Math.floor(pipeQuantityByLength) + 2) * length);
  } 

  if (pipeSumByWidth && pipeSumByLength) {
    pipeTotalLength = (pipeSumByWidth + pipeSumByLength).toFixed(1);
  } 

  // Prices
  const getCurrentListPrice = getTypeFromData(TypeEnums.list)
    ?.filter((item) => item.name === listType)
    .map((item) => item.price)[0];

  getCurrentListPrice
    ? (listTotalPrice = roofSquare * +getCurrentListPrice)
    : "нет данных";

  const getCurrentPipePrice = getTypeFromData(TypeEnums.pipe)
    ?.filter((item) => item.name === pipeType)
    .map((item) => item.price)[0];

  getCurrentPipePrice && pipeTotalLength
    ? (pipeTotalPrice = (+pipeTotalLength * +getCurrentPipePrice).toFixed(2))
    : "нет данных";
  
  const getFixPrice = getTypeFromData(TypeEnums.fix)?.map((item) => item.price)[0];
  
  getCurrentPipePrice && getFixPrice
    ? (fixTotalPrice = (+fixValueOnSquare * +getFixPrice).toFixed(2))
    : "нет данных";

  if (listTotalPrice && pipeTotalPrice && fixTotalPrice) {
    roofTotalPrice = (+listTotalPrice + +pipeTotalPrice + +fixTotalPrice).toFixed(2);
  }

  const cartRoof = [
    {id: 1, name: 'Ширина крыши:', option: width, unit: 'м'},
    {id: 2, name: 'Длина крыши:', option: length, unit: 'м'},
    {id: 3, name: 'Конструкция крыши:', option: frame, unit: ''},
    {id: 4, name: 'Площадь крыши:', option: roofSquare, unit: 'м2'},
  ];

  const cartList = [
    { id: 1, name: "Стандартная длина листа:", option: listLength, unit: "м" },
    {
      id: 2,
      name: "Выбранная ширина листа:",
      option: getCurrentListWidth,
      unit: "м",
    },
    {
      id: 3,
      name: "Площадь выбранного листа:",
      option: listSquare,
      unit: "м2",
    },
    {
      id: 4,
      name: "Материал выбранного листа:",
      option: getCurrentListMaterial,
      unit: "",
    },
    { id: 5, name: "Количество листов:", option: listQuantity, unit: "шт" },
  ];

  return (
    <>
      <div className={s.calc__wrapper}>
        <h2>Calculator</h2>
        <div className={s.calc__inner}>
          <div>
            <label>
              Type
              <MySelect val={type} data={getTypes} setValue={setType} />
            </label>
          </div>
          <div>
            {getConfigWidth && (
              <MyInput
                name={"Width"}
                data={getConfigWidth}
                value={width}
                setValue={setWidth}
              />
            )}
          </div>
          <div>
            {getConfigLength && (
              <MyInput
                name={"Length"}
                data={getConfigLength}
                value={length}
                setValue={setLength}
              />
            )}
          </div>
          <div>
            <label>
              Frame
              {getConfigFrame && (
                <MyCommonSelect
                  val={frame}
                  data={getConfigFrame}
                  setValue={setFrame}
                  type={type}
                  optionType="pipe"
                />
              )}
            </label>
          </div>
          <div>
            <label>
              Pipe type
              {getTypeFromData(TypeEnums.pipe) && (
                <MyCommonSelect
                  val={pipeType}
                  data={getTypeFromData(TypeEnums.pipe)}
                  setValue={setPipeType}
                  type={type}
                  optionType="pipe"
                />
              )}
            </label>
          </div>
          <div>
            <label>
              List type
              {getTypeFromData(TypeEnums.list) && (
                <MyCommonSelect
                  val={listType}
                  data={getTypeFromData(TypeEnums.list)}
                  setValue={setListType}
                  type={type}
                  optionType="list"
                />
              )}
            </label>
          </div>
        </div>
      </div>
      <div className={s.cart__wrapper}>
        <h2>Cart</h2>
        <div>
          <h3>Крыша</h3>
          <ul>
            {cartRoof.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                option={item.option}
                unit={item.unit}
              />
            ))}
          </ul>
        </div>
        <div>
          <h3>Лист</h3>
          <ul>
            {cartList.map((item) => (
              item.option &&
              <CartItem
                key={item.id}
                name={item.name}
                option={item.option}
                unit={item.unit}
              />
            ))}
          </ul>
          <h3>Цена листа</h3>
          <ul>
            {getCurrentListPrice && (
              <CartItem
                name={"Цена 1 листа:"}
                option={getCurrentListPrice}
                unit={"BYN/м2"}
              />
            )}
            {listTotalPrice && (
              <CartItem
                name={"Цена за всю площадь листа:"}
                option={listTotalPrice}
                unit={"BYN"}
              />
            )}
          </ul>
        </div>
        <div>
          <h3>Труба</h3>
          <ul>
            {getFrameStep && (
              <CartItem name={"Шаг трубы:"} option={getFrameStep} unit={"м"} />
            )}
            {pipeWidth && (
              <CartItem name={"Сечение трубы:"} option={pipeWidth} unit={"м"} />
            )}
            {pipeTotalLength && (
              <CartItem
                name={"Длина трубы:"}
                option={pipeTotalLength}
                unit={"мп"}
              />
            )}
          </ul>
          <h3>Цена трубы</h3>
          <ul>
            {getCurrentPipePrice && (
              <CartItem
                name={"Цена 1мп трубы:"}
                option={getCurrentPipePrice}
                unit={"BYN/мп"}
              />
            )}
            {pipeTotalPrice && (
              <CartItem
                name={"Цена за всю длину трубы:"}
                option={pipeTotalPrice}
                unit={"BYN"}
              />
            )}
          </ul>
        </div>
        <div>
          <h3>Крепеж</h3>
          <ul>
            {fixValueOnSquare && (
              <CartItem
                name={"Количество саморезов:"}
                option={fixValueOnSquare}
                unit={"шт"}
              />
            )}
          </ul>
          <h3>Цена крепежа</h3>
          <ul>
            {getFixPrice && (
              <CartItem
                name={"Цена 1шт самореза:"}
                option={getFixPrice}
                unit={"BYN/шт"}
              />
            )}
            {fixTotalPrice && (
              <CartItem
                name={"Цена за все саморезы:"}
                option={fixTotalPrice}
                unit={"BYN"}
              />
            )}
          </ul>
        </div>
        <div>
          <h3>Общая цена кровли</h3>
          <ul>
            {roofTotalPrice && (
              <CartItem
                name={"Цена кровли:"}
                option={roofTotalPrice}
                unit={"BYN"}
              />
            )}
          </ul>
        </div>
        <div className={s.cart__inner}></div>
      </div>
    </>
  );
}
