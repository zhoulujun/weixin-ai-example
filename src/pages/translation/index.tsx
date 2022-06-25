import { requirePlugin, useReady, showModal } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react';
import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.scss'


const Translation = () => {
  // 引入插件：微信同声传译
  const plugin = requirePlugin('WechatSI');
// 获取全局唯一的语音识别管理器recordRecoManager
  const manager = plugin.getRecordRecognitionManager();
  const [recordState, setRecordState] = useState(false);
  const [content, setContent] = useState('');
  const initRecord = () => {
    manager.onRecognize = function (res) {
      console.log(res);
    };
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log('成功开始录音识别', res);
    };
    // 识别错误事件
    manager.onError = function (res) {
      console.error('error msg', res);
    };
    // 识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音');
      console.log(`录音临时文件地址 -->${res.tempFilePath}`);
      console.log(`录音总时长 -->${res.duration}ms`);
      console.log(`文件大小 --> ${res.fileSize}B`);
      console.log(`语音内容 --> ${res.result}`);
      if (res.result === '') {
        showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success(status) {
            if (status.confirm) {
              console.log('用户点击确定');
            } else if (status.cancel) {
              console.log('用户点击取消');
            }
          },
        });
        return;
      }
      const text = content + res.result;
      setContent(text);
      showModal({
        title: '提示',
        content: text,
        showCancel: false,
        success(status) {
          if (status.confirm) {
            console.log('用户点击确定');
          } else if (status.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    };
  };
  useReady(() => {
    initRecord();
  });
  const touchStart = (): void => {
    debugger
    console.log('test____');
    setRecordState(true);
    // 语音开始识别
    manager.start({
      lang: 'zh_CN', // 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    });
  };
  const touchEnd = (): void => {
    setRecordState(false);
    // 语音结束识别
    manager.stop();
  };
  const handler = () => {
    if(recordState){
      touchEnd()
    }else {
      touchStart()
    }
  }
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
      <View>
        <Text>{content}</Text>
      </View>
    </View>
  )
}

export default Translation
