import { ChangeEvent, useEffect, useState } from 'react';
import s from './Calculator.module.scss'
import axios from "axios";
import { MySelect } from '../ui/select/MySelect';
import { MyCommonSelect } from '../ui/select/MyCommonSelect';

export type Data = {
  id: string;
  material?: string;
  name: string;
  price: number
  type: string;
  unit: string;
  width?: number
};

export type Config = {
  type: string;
  key: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  id: string;
  value?: number
};
export const Calculator = () => {
  const [data, setData] = useState<Data[] | null>(null);
  const [config, setConfig] = useState<Config[] | null>(null);
  const [type, setType] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [frame, setFrame] = useState('');
  const [listType, setListType] = useState("");
  const [pipeType, setPipeType] = useState("");
  const listLength = 1;
  const roofSquare = Math.ceil(+width * +length);
  let listSquare;
  let listWidth;
  let listPrice;
  let listTotalPrice;
  let listQuantity;

  let frameStep;

  let pipeWidth;
  let pipeQuantityByWidth;
  let pipeQuantityByLength;
  let pipeSumByWidth;
  let pipeSumByLength;
  let pipeTotalLength;
  let pipePrice;
  let pipeTotalPrice;

  let getConfigFixValue;
  let fixValue;
  let fixPrice;
  let fixValueOnSquare;
  let fixTotalPrice;

  let roofTotalPrice;
  
  
  useEffect(() => {
    axios("http://localhost:3001/data").then((res) => {
      setData(res.data)
    });
    axios("http://localhost:3001/config").then((res) => {
      setConfig(res.data);
    });
  }, []);

  // Data

  const getTypes = [
    ...new Set(data?.map((item) => item.type).filter(item => item !== 'fix')),
  ];

 

  const getListList = data?.filter((item) => item.type === 'list');
  const getPipeList = data?.filter((item) => item.type === 'pipe');
  const getFixList = data?.filter((item) => item.type === 'fix');

  const getCurrentListWidth = getListList
    ?.filter((item) => item.name === listType)
    .map((item) => item.width);

  const getCurrentListMaterial = getListList
    ?.filter((item) => item.name === listType)
    .map((item) => item.material);

  
    

  if (getCurrentListWidth) {
    const [width] = getCurrentListWidth;
    width ? listSquare = listLength * width : 'нет данных';
    width ? (listWidth = width) : "нет данных";
  }

  listSquare ? (listQuantity = Math.ceil(roofSquare / listSquare)) : "нет данных";

  const getCurrentPipeWidth = getPipeList
    ?.filter((item) => item.name === pipeType)
    .map((item) => item.width);
  if (getCurrentPipeWidth) {
    const [width] = getCurrentPipeWidth;
    width ? pipeWidth = width / 1000 : "нет данных";
  }

  

    // Config

  const getConfigWidth = config?.filter((item) => item.key === "width");
  const getConfigLength = config?.filter(item => item.key === 'length')
  const getConfigFrame = config?.filter(item => item.type === 'frame')

  if (getCurrentListMaterial) {
    const [material] = getCurrentListMaterial
    getConfigFixValue = config?.filter(
      (item) => item.type === "fix" && item.key === material
    ).map((item) => item.value);
  }

  if (getConfigFixValue) {
    const [value] = getConfigFixValue;
    value ? (fixValue = value) : "нет данных";
  }

  if (fixValue) {
    fixValueOnSquare = roofSquare * fixValue;
  }


  const getFrameStep = config?.filter((item) => item.name === frame).map(item => item.step);
  if (getFrameStep) {
    const [step] = getFrameStep;
    step ? frameStep = step : "нет данных";
  }

  // Pipe length

  if (width && listWidth && frameStep) {
    pipeQuantityByWidth =
      +listWidth <= +frameStep ? +width / +listWidth : +width / +frameStep;
    pipeQuantityByWidth === Math.floor(pipeQuantityByWidth)
      ? (pipeSumByWidth = (pipeQuantityByWidth + 1) * +width)
      : (pipeSumByWidth = (Math.floor(pipeQuantityByWidth) + 2) * +width);
  } 

  if (length && listLength) {
    pipeQuantityByLength = +length / +listLength;
    pipeQuantityByLength === Math.floor(pipeQuantityByLength)
      ? (pipeSumByLength = (pipeQuantityByLength + 1) * +length)
      : (pipeSumByLength =
          (Math.floor(pipeQuantityByLength) + 2) * +length);
  } 

  if (pipeSumByWidth && pipeSumByLength) {
    pipeTotalLength = (pipeSumByWidth + pipeSumByLength).toFixed(1);
  } 


  // Prices

  const getCurrentListPrice = getListList
    ?.filter((item) => item.name === listType)
    .map((item) => item.price);

  if (getCurrentListPrice) {
    const [price] = getCurrentListPrice;
    price ? (listPrice = price) : "нет данных";
  }

  if (getCurrentListPrice && listPrice) {
    const [price] = getCurrentListPrice;
    price ? (listTotalPrice = roofSquare * +listPrice) : "нет данных";
  }



  const getCurrentPipePrice = getPipeList
    ?.filter((item) => item.name === pipeType)
    .map((item) => item.price);

  if (getCurrentPipePrice) {
    const [price] = getCurrentPipePrice;
    price ? (pipePrice = price) : "нет данных";
  }

  if (getCurrentPipePrice && pipePrice && pipeTotalLength) {
    const [price] = getCurrentPipePrice;
    price ? (pipeTotalPrice = +pipeTotalLength * +pipePrice) : "нет данных";
  }



  const getFixPrice = getFixList
    ?.map((item) => item.price);

  if (getFixPrice) {
    const [price] = getFixPrice;
    price ? (fixPrice = price) : "нет данных";
  }

  if (getCurrentPipePrice && fixPrice && fixValueOnSquare) {
    const [price] = getCurrentPipePrice;
    price ? (fixTotalPrice = +fixValueOnSquare * +fixPrice) : "нет данных";
  }

  if (listTotalPrice && pipeTotalPrice && fixTotalPrice) {
    roofTotalPrice = listTotalPrice + pipeTotalPrice + fixTotalPrice;
  }

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
            {getConfigWidth?.map((item) => (
              <label key={item.id}>
                Width
                <input
                  type="number"
                  value={width}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setWidth(e.target.value)
                  }
                  step={item.step}
                  min={item.min}
                  max={item.max}
                />
              </label>
            ))}
          </div>
          <div>
            {getConfigLength?.map((item) => (
              <label key={item.id}>
                Length
                <input
                  type="number"
                  value={length}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLength(e.target.value)
                  }
                  step={item.step}
                  min={item.min}
                  max={item.max}
                />
              </label>
            ))}
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
              {getPipeList && (
                <MyCommonSelect
                  val={pipeType}
                  data={getPipeList}
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
              {getListList && (
                <MyCommonSelect
                  val={listType}
                  data={getListList}
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
            <li>
              <div>
                <p>Ширина крыши: {width ? width : "-"} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>Длина крыши: {length ? length : "-"} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>Конструкция крыши: {frame ? frame : "-"}</p>
              </div>
            </li>
            <li>
              <div>
                <p>Площадь крыши: {roofSquare ? roofSquare : "-"} м2</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3>Лист</h3>
          <ul>
            <li>
              <div>
                <p>Стандартная длина листа: {listLength} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>Выбранная ширина листа: {listWidth ? listWidth : "-"} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Площадь выбранного листа: {listSquare ? listSquare : "-"} м2
                </p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Материал выбранного листа:
                  {getCurrentListMaterial ? getCurrentListMaterial : "-"}
                </p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Количество листов:
                  {listQuantity ? listQuantity : "-"}
                </p>
              </div>
            </li>
          </ul>
          <h3>Цена листа</h3>
          <ul>
            <li>
              <div>
                <p>Цена 1 листа: {listPrice ? listPrice : "-"} BYN/шт</p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Цена за всю площадь листа:{" "}
                  {listTotalPrice ? listTotalPrice : "-"} BYN
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3>Труба</h3>
          <ul>
            <li>
              <div>
                <p>Шаг трубы: {frameStep ? frameStep : "-"} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>Сечение трубы: {pipeWidth ? pipeWidth : "-"} м</p>
              </div>
            </li>
            <li>
              <div>
                <p>Длина трубы: {pipeTotalLength ? pipeTotalLength : "-"} мп</p>
              </div>
            </li>
          </ul>
          <h3>Цена трубы</h3>
          <ul>
            <li>
              <div>
                <p>Цена 1мп трубы: {pipePrice ? pipePrice : "-"} BYN/мп</p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Цена за всю длину трубы:{" "}
                  {pipeTotalPrice ? pipeTotalPrice : "-"} BYN
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3>Крепеж</h3>
          <ul>
            <li>
              <div>
                <p>
                  Количество саморезов:{" "}
                  {fixValueOnSquare ? fixValueOnSquare : "-"} шт
                </p>
              </div>
            </li>
          </ul>
          <h3>Цена крепежа</h3>
          <ul>
            <li>
              <div>
                <p>Цена 1шт самореза: {fixPrice ? fixPrice : "-"} BYN/шт</p>
              </div>
            </li>
            <li>
              <div>
                <p>
                  Цена за все саморезы: {fixTotalPrice ? fixTotalPrice : "-"}{" "}
                  BYN
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3>Общая цена кровли</h3>
          <ul>
            <li>
              <div>
                <p>Цена кровли: {roofTotalPrice ? roofTotalPrice : "-"} BYN</p>
              </div>
            </li>
          </ul>
        </div>
        <div className={s.cart__inner}></div>
      </div>
    </>
  );
}
