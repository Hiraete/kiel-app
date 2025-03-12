import { PermissionsAndroid } from 'react-native';

export const requestScreenCapturePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.DETECT_SCREEN_CAPTURE' as any,
      {
        title: 'Screen Capture Permission',
        message: 'App needs access to detect screen capture.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Screen capture permission granted');
    } else {
      console.log('Screen capture permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}; 