import s from './Page.module.scss'
import { Calculator } from '../calculator/Calculator'

export const Page = () => {
  return (
    <div className={s.wrapper}>
      <Calculator />
    </div>
  )
}
