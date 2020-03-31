## 简单说明

### 使用 Android 真机

参考:
https://reactnative.cn/docs/getting-started/

1. 开启 USB 调试
2. 通过 USB 数据线连接设备

```bash
# 下面检查你的设备是否能正确连接到 ADB（Android Debug Bridge），使用adb devices命令：
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```

3. 运行应用

```bash
cd AwesomeProject
yarn android
# 或者
yarn react-native run-android
```

### 打包 APK

参考:
https://reactnative.cn/docs/signed-apk-android/

**注意**: android/app/build.gradle 这个文件的修改.

```js
release {
  // Caution! In production, you need to generate your own keystore file.
  // see https://facebook.github.io/react-native/docs/signed-apk-android.
  signingConfig signingConfigs.debug //发布时需要注释
  // signingConfig signingConfigs.release //需要发布时去掉注释
  minifyEnabled enableProguardInReleaseBuilds
  proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
}
```
