import Header from 'components/content/Header'

import Logo from "assets/img/common/logo.png"
import Equ from "assets/img/index/equ.png"

export default function PageHeader(){
  
  return (
    <Header logo={Logo} equ={Equ} name="云萃SIOT"/>
  )
}