import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  jumpPage(url:string){
    Taro.navigateTo({
      url
    })
  }

  render () {
    return (
      <View className='index'>
        <view><Text>测试案例：</Text></view>
        <View><AtButton onClick={()=>this.jumpPage('/pages/translation/index')}>同声传译</AtButton></View>
        <View><AtButton onClick={()=>this.jumpPage('/pages/speak/index')}>文字转语音</AtButton></View>
      </View>
    )
  }
}
