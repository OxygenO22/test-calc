import { ChangeEvent, useEffect, useState } from 'react';
import s from './Calculator.module.scss'
import axios from "axios";
import { MySelect } from '../ui/select/MySelect';
import { MyCommonSelect } from '../ui/select/MyCommonSelect';
import { MyInput } from '../ui/input/MyInput';
import { CartItem } from '../ui/cartItem/CartItem';
import { Config, Data, dateApi } from '../api/api';
export const Calculator = () => {
  const [data, setData] = useState<Data[] | null>(null);
  const [config, setConfig] = useState<Config[] | null>(null);
  const [type, setType] = useState('');
  const [width, setWidth] = useState(5);
  const [length, setLength] = useState(5);
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
    dateApi.getMaterials().then((res) => setData(res.data));
    dateApi.getConfig().then((res) => setConfig(res.data));
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
    price
      ? (pipeTotalPrice = (+pipeTotalLength * +pipePrice).toFixed(2))
      : "нет данных";
  }
  

  const getFixPrice = getFixList
    ?.map((item) => item.price);

  if (getFixPrice) {
    const [price] = getFixPrice;
    price ? (fixPrice = price) : "нет данных";
  }

  if (getCurrentPipePrice && fixPrice && fixValueOnSquare) {
    const [price] = getCurrentPipePrice;
    price
      ? (fixTotalPrice = (+fixValueOnSquare * +fixPrice).toFixed(2))
      : "нет данных";
  }

  if (listTotalPrice && pipeTotalPrice && fixTotalPrice) {
    roofTotalPrice = (+listTotalPrice + +pipeTotalPrice + +fixTotalPrice).toFixed(2);
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
            {getConfigWidth && (
              <MyInput
                name={"Width"}
                data={getConfigWidth}
                value={+width}
                setValue={setWidth}
              />
            )}
          </div>
          <div>
            {getConfigLength && (
              <MyInput
                name={"Length"}
                data={getConfigLength}
                value={+length}
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
            <CartItem name={"Ширина крыши:"} option={width} unit={"м"} />
            <CartItem name={"Длина крыши:"} option={length} unit={"м"} />
            <CartItem name={"Конструкция крыши:"} option={frame} unit={""} />
            <CartItem
              name={"Площадь крыши:"}
              option={roofSquare}
              unit={" м2"}
            />
          </ul>
        </div>
        <div>
          <h3>Лист</h3>
          <ul>
            <CartItem
              name={"Стандартная длина листа:"}
              option={listLength}
              unit={"м"}
            />
            {listWidth && (
              <CartItem
                name={"Выбранная ширина листа:"}
                option={listWidth}
                unit={"м"}
              />
            )}
            {listSquare && (
              <CartItem
                name={"Площадь выбранного листа:"}
                option={listSquare}
                unit={"м2"}
              />
            )}
            <li>
              <div>
                <p>
                  Материал выбранного листа:
                  {getCurrentListMaterial ? getCurrentListMaterial : "-"}
                </p>
              </div>
            </li>
            {listQuantity && (
              <CartItem
                name={"Количество листов:"}
                option={listQuantity}
                unit={"шт"}
              />
            )}
          </ul>
          <h3>Цена листа</h3>
          <ul>
            {listPrice && (
              <CartItem
                name={"Цена 1 листа:"}
                option={listPrice}
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
            {frameStep && (
              <CartItem name={"Шаг трубы:"} option={frameStep} unit={"м"} />
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
            {pipePrice && (
              <CartItem
                name={"Цена 1мп трубы:"}
                option={pipePrice}
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
            {fixPrice && (
              <CartItem
                name={"Цена 1шт самореза:"}
                option={fixPrice}
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
