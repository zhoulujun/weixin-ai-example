import { useReady, getFileSystemManager, getRecorderManager } from '@tarojs/taro';

import { View, Button } from '@tarojs/components'
import { useState } from 'react';
import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.scss'


const Translation = () => {

  // 引入插件：微信同声传译
// 获取全局唯一的语音识别管理器recordRecoManager
  const recorderManager = getRecorderManager();
  const [recordState, setRecordState] = useState(false);

  useReady(() => {
    recorderManager.onStart(() => {
      console.log('开始录音');
    });
    recorderManager.onStop((res) => {
      const tempFilePath = res.tempFilePath;
      debugger
      console.log(tempFilePath)
      const base64_audio = getFileSystemManager().readFileSync(tempFilePath, 'base64');
      console.log(base64_audio)

    });
  });
  const touchStart = (): void => {
    console.log('test____touchStart');
    setRecordState(true);
    recorderManager.start({
      duration: 60000,
      format: 'mp3',
      sampleRate: 22050,
    })
  };
  const touchEnd = (): void => {
    setRecordState(false);
    // 语音结束识别
    recorderManager.stop();
  };
  return (
    <View className='index'>
      <View>
        <Button
          onLongPress={touchStart}
          onTouchEnd={touchEnd}
          aria-role='button' aria-label='关键词内容播报'
          className='recognition-play-key'
        >{recordState ? '……' : '按住说话'}</Button>
      </View>
    </View>
  )
}

export default Translation
