import { createInnerAudioContext,requirePlugin } from '@tarojs/taro';
import { useState } from 'react';
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.scss'

const plugin = requirePlugin('WechatSI');
const Speak = () => {
  const [content, setContent] = useState('微信同声传译插件是微信自研的语音输入，文本翻译等功能的插件封装，用于提供给第三方小程序调用。');
  const [audioSource, setAudioSource] = useState('');
  const watchAudioStatus = () => {
    if (!audioSource) {
      console.log('暂无语音');
      return;
    }
    // 创建音频实例
    const innerAudioContext = createInnerAudioContext();
    innerAudioContext.src = audioSource;
    innerAudioContext.play(); // 播放音频
    innerAudioContext.onPlay(() => {
      console.log('监听开始播放');
    });
    innerAudioContext.onEnded(() => {
      console.log('监听播报结束，可在结束中进行相应的处理逻辑');
      innerAudioContext.stop();
      // 播放停止，销毁该实例,不然会出现多个语音重复执行的情况
      console.log('销毁innerAudioContext实例');
      innerAudioContext.destroy();
    });
    innerAudioContext.onError(() => {
      console.log('监听语音播放异常');
      innerAudioContext.destroy();// 销毁播放实例
    });
  };
  const translationTextToAudio = () => {
    plugin.textToSpeech({
      lang: 'zh_CN', // 代表中文
      tts: true, // 是否对翻译结果进行语音合成，默认为false，不进行语音合成
      content, // 要转为语音的文字
      success(res) {
        console.log('succ tts', res);
        setAudioSource(res.filename);
        watchAudioStatus();// 调用此方法来监听语音播放情况
      },
      fail(res) {
        console.log('fail tts', res);
      },
    });
  };
  return (
    <View>
      <View>
        <AtButton
          onClick={translationTextToAudio}
          aria-role='button' aria-label='关键词内容播报'
          className='recognition-play-key'
        >按住读取下面内容</AtButton>
      </View>
      <View>
        <Text>{content}</Text>
      </View>
    </View>
  )
}
export default Speak
